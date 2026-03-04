# Mobility Infrastructure WebGIS – Enschede

Reproducible WebGIS backend foundation for spatial API development and frontend integration.

## Stack

* PostGIS (Docker)
* Node.js + Express
* Python (GeoPandas) for data loading

## Data

* CBS Wijken (Enschede)
* OSM Roads (Geofabrik extract)

## Run

```bash
docker compose up -d --build
docker compose run --rm tools python week_1.py
```

API available at:

```
http://localhost:3000
```

Frontend available at:

```
http://localhost:5173/
```