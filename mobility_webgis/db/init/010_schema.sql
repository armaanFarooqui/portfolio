DROP TABLE IF EXISTS districts CASCADE;
CREATE TABLE districts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  cbs_code TEXT,
  geom geometry(MultiPolygon, 4326) NOT NULL
);

DROP TABLE IF EXISTS roads CASCADE;
CREATE TABLE roads (
  id SERIAL PRIMARY KEY,
  osm_id BIGINT,
  name TEXT,
  highway TEXT,
  geom geometry(MultiLineString, 4326) NOT NULL
);