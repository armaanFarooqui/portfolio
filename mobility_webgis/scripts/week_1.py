import sys
import os
import requests
import zipfile
import geopandas as gpd
from pathlib import Path
from sqlalchemy import create_engine, text

RAW_DIR = Path('../data/raw')
RAW_DIR.mkdir(parents=True, exist_ok=True)

CBS_LINK = 'https://geodata.cbs.nl/files/Wijkenbuurtkaart/WijkBuurtkaart_2025_v1.zip'
CBS_PATH = RAW_DIR / 'wijken_en_buurten.zip'
    
OSM_LINK = 'https://download.geofabrik.de/europe/netherlands/overijssel-latest-free.gpkg.zip'
OSM_PATH = RAW_DIR / 'overijssel_geofabrik.zip'

ROAD_CLASSES = [
  "motorway","motorway_link",
  "trunk","trunk_link",
  "primary","primary_link",
  "secondary","secondary_link",
  "tertiary","tertiary_link",
  "residential","unclassified","living_street","service"
]

PG_USER = os.getenv('PGUSER')
PG_PASSWORD = os.getenv('PGPASSWORD')
PG_HOST = os.getenv('PGHOST')
PG_PORT = int(os.getenv('PGPORT'))
PG_DB = os.getenv('PGDATABASE')

CRS_METRIC = 'EPSG:28992'
CRS_WEB = 'EPSG:4326'

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

    print(f'Connected to Postgres at {host}:{port}/{db}')
    return engine

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

    print('Creating GiST indexes and analysing tables')

    with engine.begin() as conn:
        conn.execute(text(sql))

def download(url, output_path):
    print(f'Downloading file from {url}')
    
    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        with open(output_path, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
    print(f'Downloaded file at {output_path}')

def process_cbs(zip_path, engine):

    print(f'Processing CBS (districts)')
    
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

        enschede = dutch_cities[
            dutch_cities['gemeentenaam'] == 'Enschede'
        ]

        enschede = (
            enschede[['gemeentecode', 'gemeentenaam', 'geometry']]
            .rename(columns={
                'gemeentecode': 'cbs_code',
                'gemeentenaam': 'name'
            })
        )

        dutch_wijken = (
            gpd.read_file(
                f'zip://{zip_path}!{gpkg_file}',
                layer='wijken'
            )
            .to_crs(CRS_METRIC)
        )

        enschede_wijken = dutch_wijken[
            dutch_wijken['gemeentenaam'] == 'Enschede'
        ]

        enschede_wijken = (
            enschede_wijken[['wijkcode', 'wijknaam', 'geometry']]
            .rename(columns={
                'wijknaam': 'name',
                'wijkcode': 'cbs_code'
            })
        )

        enschede_wijken['name'] = enschede_wijken['name'].str.replace(
            r"^Wijk\s+\d+\s+", 
            '', 
            regex=True
        )
        
        enschede_wijken['geometry'] = enschede_wijken['geometry'].make_valid()
        enschede_wijken = enschede_wijken.to_crs(CRS_WEB)
        
        enschede_wijken.to_postgis(
            'districts', 
            engine, 
            if_exists='replace', 
            index=False
        )
        
        print('Wrote table: districts')
        return enschede

def process_osm(zip_path, engine, boundary):

    print(f'Processing Geofabrik (roads)')
    
    with zipfile.ZipFile(zip_path, 'r') as z:
        gpkg_file = next(
            name for name in z.namelist() if name.endswith('.gpkg')
        )

        overijssel_roads = (
            gpd.read_file(
                f'zip://{zip_path}!{gpkg_file}',
                layer='gis_osm_roads_free'
            )
            .to_crs(CRS_METRIC)
        )

        overijssel_roads = overijssel_roads[
            overijssel_roads['fclass'].isin(ROAD_CLASSES)
            ]

        boundary['geometry'] = boundary['geometry'].make_valid()
        
        enschede_roads = overijssel_roads.clip(boundary['geometry'].iloc[0])

        enschede_roads = (
            enschede_roads[['osm_id', 'name', 'fclass', 'geometry']]
            .rename(columns={'fclass': 'road_class'})
        )
                
        enschede_roads['geometry'] = enschede_roads['geometry'].make_valid()
        enschede_roads = enschede_roads.to_crs(CRS_WEB)
        
        enschede_roads.to_postgis(
                'roads',
                engine,
                if_exists='replace',
                index=False
            )
        
        print(f'Wrote table: roads')

if __name__ == '__main__':

    print('Starting spatial data load ...')

    try:
        engine = psql_connect(
            PG_USER,
            PG_PASSWORD,
            PG_HOST,
            PG_PORT,
            PG_DB
        )
    
        download(CBS_LINK, CBS_PATH)
        download(OSM_LINK, OSM_PATH)
        
        boundary = process_cbs(CBS_PATH, engine)
        process_osm(OSM_PATH, engine, boundary)
    
        post_sql_load(engine)

        print('Spatial tables loaded and GiST indexes created successfully')
        sys.exit(0)

    except Exception as e:
        print(f'ERROR: {str(e)}')
        sys.exit(1)
        