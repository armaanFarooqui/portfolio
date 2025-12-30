# Urban Infrastructure Density for Enschede (Python + PostGIS)

A reproducible pipeline that computes district-level bike lane density and building footprint density for Enschede using OpenStreetMap features and PostGIS.

## Purpose

Demonstrate a spatial data engineering workflow that combines API-based vector ingestion, attribute and geometry cleaning, database loading and indexing, and PostGIS spatial aggregation to produce map-ready outputs for a web front end.

## Tech stack

* Python (requests, GeoPandas, OSMnx, Shapely, SQLAlchemy, mapclassify)
* PostGIS (spatial joins, intersections, area/length aggregation, GiST indexing)
* PostgreSQL
* Leaflet (visualisation of exported GeoJSON layers)

## Inputs
* PDOK OGC API Features: municipal boundary (Enschede)
* PDOK / CBS OGC API Features: district boundaries (year 2025)
* OpenStreetMap (via OSMnx): bike network + building footprints

## Outputs
* data/bike_lane_density.geojson: district polygons with bikeway_density
* data/building_footprint_density.geojson: district polygons with building_footprint_density
* PostGIS tables: districts, roads, buildings

## How to run

1. Start PostgreSQL with PostGIS enabled and set the connection string in the notebook/script.
2. Run the pipeline to fetch boundaries (PDOK/CBS) and OSM features, clean geometries, and load them into PostGIS.
3. Execute the PostGIS queries to export the resulting GeoJSON layers for the web map.

## Scope

This project focuses on district-level aggregation. It does not focus on the uncertainty or completeness assessment of OpenStreetMap data.
