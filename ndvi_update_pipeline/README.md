# Multi-Year NDVI Update Pipeline

### STAC + PostGIS Raster Analytics | Enschede, The Netherlands (EPSG:28992)

## Overview

This project implements a reproducible multi-year remote sensing pipeline to compute district-level NDVI statistics using Sentinel-2 imagery and PostGIS raster analytics.

The workflow integrates STAC-based satellite data acquisition, NDVI composite generation, tiled raster storage in PostGIS, zonal statistics computation, and incremental update logic for maintaining the latest snapshot.



## Data

* **Satellite Imagery:** Sentinel-2 Level-2A (via Element84 Earth Search STAC API)
* **Boundary Data:** PDOK municipality + CBS districts (2025)



## Methodology

1. **STAC-Based Ingestion**
   Query Sentinel-2 imagery (low cloud cover) covering Enschede.

2. **NDVI Composite Generation**
   Compute NDVI from Red/NIR bands and generate yearly median composites.

3. **PostGIS Raster Integration**
   Import composites, tile rasters (256×256), and create spatial indices.

4. **Zonal Statistics**
   Use ST_Clip + ST_SummaryStatsAgg to compute per-district:

   * Minimum NDVI
   * Maximum NDVI
   * Mean NDVI

5. **Incremental Update Logic**
   Maintain a “latest” statistics table by updating changed values across years.

6. **Web Map Preparation**
   Apply Natural Breaks (Jenks) classification for choropleth visualisation.



## Outputs

* ndvi_composite_<year>.tif: yearly NDVI median composites
* zonal_stats_<year>.geojson: district-level NDVI statistics
* ndvi_stats_latest.geojson: consolidated latest snapshot



## Technical Stack

Python · pystac-client · rioxarray · xarray · PostgreSQL · PostGIS · SQLAlchemy · mapclassify



## Project Relevance

* Demonstrates STAC-based satellite data engineering
* Implements PostGIS raster analytics with tiling and indexing
* Applies spatial SQL for zonal statistics computation
* Introduces incremental update strategy for multi-year data
* Produces web-ready geospatial outputs

This project showcases a scalable raster data engineering workflow that bridges remote sensing, database systems, and spatial analytics.