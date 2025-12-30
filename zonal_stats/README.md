# District-Level Zonal Statistics for Enschede (Python + PostGIS)

A pipeline that computes district-level NDVI and NDBI zonal statistics for Enschede, the Netherlands using PostGIS raster functions and vector-raster spatial joins.

## Purpose

Demonstrate a vector-raster integration workflow in which spatial aggregation is executed inside the database, highlighting efficient raster tiling, spatial indexing, and SQL-based zonal statistics for web-ready outputs.

## Tech stack

* Python (GeoPandas, rioxarray, SQLAlchemy, Pandas, mapclassify)
* PostGIS (raster tiling, ST_Clip, ST_SummaryStatsAgg, GiST indexing)
* PostgreSQL
* Leaflet (visualisation of exported GeoJSON layers)

## Inputs

* Enschede district polygons (GeoPackage)
* NDVI and NDBI annual median composites (GeoTIFF)

## Outputs

* data/ndvi_zonal_stats.geojson: district-level NDVI statistics
* data/ndbi_zonal_stats.geojson: district-level NDBI statistics

## How to run

1. Start PostgreSQL with PostGIS enabled and load district polygons and raster composites.
2. Tile rasters, create spatial indices, and compute zonal statistics using PostGIS.
3. Export district-level results as GeoJSON for visualisation in a web map.

## Scope

This project focuses on single-year zonal statistics derived from precomputed raster composites. It does not address temporal change analysis.