# NDVI and NDBI Median Composite Generation for Enschede (Python + PostGIS)

A pipeline that generates annual NDVI and NDBI median composites for Enschede, the Netherlands from Sentinel-2 imagery and prepares them for efficient storage and querying in PostGIS.

## Purpose

Demonstrate a raster-focused spatial data engineering workflow that integrates STAC-based data discovery, database-side raster tiling and indexing, spatial indexing, temporal compositing, Cloud Optimised GeoTIFF generation.

## Tech stack

* Python (GeoPandas, pystac-client, rioxarray, xarray, NumPy, Pandas)
* PostGIS (raster loading, tiling, spatial indexing, summary statistics)
* PostgreSQL
* Leaflet (visualisation of exported GeoTiff layers)

## Inputs

* Enschede municipal boundary (GeoPackage)
* Sentinel-2 L2A imagery (2024, cloud cover < 5%) accessed via STAC
* Spectral bands: Red, NIR, SWIR

## Outputs

* data/ndvi/composite/ndvi_composite.tif
* data/ndbi/composite/ndbi_composite.tif
* PostGIS raster tables and tiled raster tables: ndvi_tiles, ndbi_tiles
* Raster metadata tables: ndvi_metadata.csv, ndbi_metadata.csv

## How to run

1. Start PostgreSQL with PostGIS enabled and configure the database connection.
2. Run the pipeline to query Sentinel-2 imagery via STAC, compute NDVI/NDBI, and generate median composites.
3. Load the composite rasters into PostGIS, tile them, build spatial indices, and export metadata.

## Scope

This project focuses on annual median compositing and raster database preparation. It does not address multi-year trend analysis.