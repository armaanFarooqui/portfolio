# Urban Infrastructure Density Analysis

### District-Level Spatial Metrics | Enschede, The Netherlands (EPSG:28992)

## Overview

This project implements a reproducible spatial data engineering pipeline to compute district-level infrastructure density metrics using authoritative administrative boundaries (PDOK/CBS) and OpenStreetMap-derived features.

The workflow integrates API-based data acquisition, geometry validation, PostGIS-backed spatial joins, and GeoJSON export for web-based choropleth mapping.

## Data

* **Administrative Boundaries:** PDOK (municipality) + CBS districts (2025) via OGC API
* **Infrastructure Data:** OpenStreetMap (bike network + building footprints)

## Methodology

1. **Boundary Retrieval**
   OGC API ingestion of municipality and district layers, geometry validation and reprojection.

2. **OSM Feature Extraction**
   Bike network (LineString) and building footprints (Polygon) via OSMnx.

3. **Database Integration**
   Layer ingestion into PostGIS with GiST spatial indices.

4. **Spatial Aggregation**
   ST_INTERSECTS + ST_INTERSECTION to compute:

   * Bikeway density (km / km²)
   * Building footprint density (km² / km²)

5. **Web Map Preparation**
   Natural Breaks (Jenks) classification for choropleth visualisation.



## Outputs

* bike_lane_density.geojson: district-level bikeway density
* building_footprint_density.geojson: district-level building footprint density



## Technical Stack

Python · GeoPandas · OSMnx · PostgreSQL · PostGIS · SQLAlchemy · mapclassify



## Project Relevance

* Demonstrates API-driven data ingestion
* Implements database-backed spatial computation
* Uses spatial indexing for performance-aware joins
* Applies CRS-consistent metric analysis
* Produces web-ready geospatial outputs

This project showcases a scalable spatial analytics workflow integrating external APIs, database systems, and geospatial computation. Thus bridging GIS and systems-oriented data engineering.