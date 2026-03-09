### 1. Imports

import logging
import sys
import os
import requests
import zipfile
import geopandas as gpd
import osmnx
from pathlib import Path
from sqlalchemy import create_engine, text

### 2. Globals

RAW_DIR = Path('../data/raw')
RAW_DIR.mkdir(parents=True, exist_ok=True)

CBS_LINK = 'https://geodata.cbs.nl/files/Wijkenbuurtkaart/WijkBuurtkaart_2025_v1.zip'
CBS_PATH = RAW_DIR / 'wijken_en_buurten.zip'
    
PG_USER = os.getenv('PGUSER')
PG_PASSWORD = os.getenv('PGPASSWORD')
PG_HOST = os.getenv('PGHOST')
PG_PORT = int(os.getenv('PGPORT'))
PG_DB = os.getenv('PGDATABASE')

CRS_METRIC = 'EPSG:28992'
CRS_WEB = 'EPSG:4326'
CITY = 'Enschede'

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s'
)

### 3. Connect to Postgres

def psql_connect(
    username,
    password,
    host,
    port,
    db
):
    engine = create_engine(
        f'postgresql+psycopg://{username}:{password}@{host}:{port}/{db}'
    )

    logging.info(f'Connected to Postgres at {host}:{port}/{db}')
    return engine

### 4. Create Spatial Indices

def post_sql_load(engine):
    sql = (
        """
        CREATE INDEX IF NOT EXISTS districts_idx 
        ON districts
        USING GIST(geometry);

        CREATE INDEX IF NOT EXISTS roads_idx
        ON roads
        USING GIST(geometry);

        ANALYZE districts;
        ANALYZE roads;
        """
    )

    logging.info('Creating GiST indexes and analysing tables')

    with engine.begin() as conn:
        conn.execute(text(sql))

### 5. Download and save a file
        
def download(url, output_path):
    logging.info(f'Downloading file from {url}')
    
    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        with open(output_path, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
    logging.info(f'Downloaded file at {output_path}')

### 6. Process and load CBS data into PostGIS

def process_cbs(zip_path, engine):

    logging.info(f'Processing CBS (districts)')
    
    with zipfile.ZipFile(zip_path, 'r') as z:
        gpkg_file = next(
            name for name in z.namelist() if name.endswith('.gpkg')
        )

        dutch_cities = (
            gpd.read_file(
                f'zip://{zip_path}!{gpkg_file}',
                layer='gemeenten'
            )
            .to_crs(CRS_METRIC)
        )

        boundary = dutch_cities[
            dutch_cities['gemeentenaam'] == CITY
        ]



        boundary['geometry'] = boundary['geometry'].make_valid()
        boundary = boundary.to_crs(CRS_WEB)
        
        boundary = boundary['geometry'].iloc[0]


        dutch_wijken = (
            gpd.read_file(
                f'zip://{zip_path}!{gpkg_file}',
                layer='wijken'
            )
            .to_crs(CRS_METRIC)
        )

        boundary_wijken = dutch_wijken[
            dutch_wijken['gemeentenaam'] == CITY
        ]

        boundary_wijken['area'] = (
            boundary_wijken['geometry'].area
            .div(10**6)
            .round(3)
        )

        boundary_wijken = (
            boundary_wijken[['wijkcode', 'wijknaam',  'aantal_inwoners', 'area', 'geometry']]
            .rename(columns={
                'wijkcode': 'id',
                'wijknaam': 'name',
                'aantal_inwoners': 'total_population',

            })
        )

        boundary_wijken['name'] = boundary_wijken['name'].str.replace(
            r"^Wijk\s+\d+\s+", 
            '', 
            regex=True
        )
        
        boundary_wijken['geometry'] = boundary_wijken['geometry'].make_valid()
        boundary_wijken = boundary_wijken.to_crs(CRS_WEB)
        
        boundary_wijken.to_postgis(
            'districts', 
            engine, 
            if_exists='replace', 
            index=False
        )
        
        logging.info('Wrote table: districts')
        return boundary

### 7. Process and load OSM data into PostGIS

def process_osm(engine, boundary):
    
    ### 7.1. Roads layer
    
    logging.info('Downloading OSM roads layer')
    
    boundary_roads = (
        osmnx.features_from_polygon(boundary, {'highway': True})
        .reset_index()
        .loc[lambda df: df.geometry.geom_type == 'LineString']
        .clip(boundary)
        [['id', 'name', 'highway', 'geometry']]
        .rename(columns={'highway': 'road_type'})
        .to_crs(CRS_WEB)
    )

    boundary_roads['geometry'] = boundary_roads['geometry'].make_valid()

    logging.info('Writing to PostGIS')
    
    boundary_roads.to_postgis(
        'roads',
        engine,
        if_exists='replace',
        index=False
    )

    logging.info('Wrote table: roads')

    ### 7.2. Rail layer
    
    logging.info('Downloading OSM rail layer')

    boundary_rail = (
        osmnx.features_from_polygon(boundary, {'railway': 'rail'})
        .reset_index()
        .loc[lambda df: df.geometry.geom_type == 'LineString']
        .clip(boundary)
        [['id', 'name', 'geometry']]
        .to_crs(CRS_WEB)
    )

    boundary_rail['geometry'] = boundary_rail['geometry'].make_valid()

    logging.info('Writing to PostGIS')

    boundary_rail.to_postgis(
        'rail',
        engine,
        if_exists='replace',
        index=False
    )

    logging.info('Wrote table: rail')

    ### 7.3. Canals layer
    
    logging.info('Downloading OSM canals layer')

    boundary_canals = (
        osmnx.features_from_polygon(boundary, {'waterway': 'canal'})
        .reset_index()
        .loc[lambda df: df.geometry.geom_type == 'LineString']
        .clip(boundary)
        [['id', 'name', 'geometry']]
        .to_crs(CRS_WEB)
    )

    boundary_canals['geometry'] = boundary_canals['geometry'].make_valid()

    logging.info('Writing to PostGIS')

    boundary_canals.to_postgis(
        'canals',
        engine,
        if_exists='replace',
        index=False
    )

    logging.info('Wrote table: canals')

    ### 7.4. Bus stops layer
    
    logging.info('Downloading OSM bus stops layer')

    boundary_bus = (
        osmnx.features_from_polygon(boundary, {'highway': 'bus_stop'})
        .reset_index()
        .loc[lambda df: df.geometry.geom_type == 'Point']
        .clip(boundary)
        [['id', 'name', 'geometry']]
        .to_crs(CRS_WEB)
    )

    boundary_bus['geometry'] = boundary_bus['geometry'].make_valid()

    logging.info('Writing to PostGIS')

    boundary_bus.to_postgis(
        'bus_stops',
        engine,
        if_exists='replace',
        index=False
    )

    logging.info('Wrote table: bus_stops')

    ### 7.5. Railway stations layer
    
    logging.info('Downloading OSM railway stations layer')

    boundary_stations = (
        osmnx.features_from_polygon(boundary, {'railway': 'station'})
        .reset_index()
        .loc[lambda df: df.geometry.geom_type == 'Point']
        .clip(boundary)
        [['id', 'name', 'geometry']]
        .to_crs(CRS_WEB)
    )

    logging.info('Writing to PostGIS')

    boundary_stations.to_postgis(
        'railway_stations',
        engine,
        if_exists='replace',
        index=False
    )

    logging.info('Wrote table: railway stations')

### 8. Main function

if __name__ == '__main__':

    logging.info('Starting spatial data load ...')

    try:
        engine = psql_connect(
            PG_USER,
            PG_PASSWORD,
            PG_HOST,
            PG_PORT,
            PG_DB
        )
    
        download(CBS_LINK, CBS_PATH)
        
        boundary = process_cbs(CBS_PATH, engine)
        process_osm(engine, boundary)
    
        post_sql_load(engine)

        logging.info('Spatial tables loaded and GiST indexes created successfully')
        sys.exit(0)

    except Exception as e:
        logging.exception('Spatial ETL failed')
        sys.exit(1)