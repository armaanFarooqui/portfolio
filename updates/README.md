# Enschede NDVI Update Pipeline: Multi-Year Zonal Statistics (Python + PostGIS)

A reproducible pipeline that generates multi-year NDVI composites, computes district-level zonal statistics per year, and maintains an up-to-date snapshot table in PostGIS by updating only changed values.

## Purpose

Demonstrate a temporal spatial data engineering workflow focused on incremental updates, where new raster-derived statistics are compared against existing records. Only modified fields are propagated to a latest-state dataset for web mapping.

## Tech stack

* Python (GeoPandas, pystac-client, rioxarray, xarray, NumPy, mapclassify)
* PostGIS (raster tiling, zonal statistics, lateral joins, table updates)
* PostgreSQL
* Leaflet (visualisation of exported GeoJSON layers)

## Inputs

* Enschede municipal boundary (GeoPackage)
* Sentinel-2 L2A imagery for multiple years (cloud cover < 5%)
* Enschede district polygons

## Outputs

* ndvi_composite_(year).tif: Yearly NDVI median composites 
* ndvi_stats_(year): Year-specific zonal statistics tables 
* ndvi_stats_latest: latest snapshot with updated values
* data/latest/ndvi_stats_latest.geojson: web-ready output

## How to run

1. Start PostgreSQL with PostGIS enabled and configure the database connection.
2. Run the pipeline to generate yearly NDVI composites and compute zonal statistics per district.
3. Execute the update step to refresh the latest snapshot table by propagating only changed values.

## Scope

This project focuses on temporal updates of zonal statistics using annual NDVI composites. It does not cover time-series analysis.