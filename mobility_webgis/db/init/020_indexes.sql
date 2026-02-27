CREATE INDEX districts_geom_gix 
ON districts 
USING GIST (geom);

CREATE INDEX roads_geom_gix 
ON roads 
USING GIST (geom);

CREATE INDEX roads_highway_idx 
ON roads (highway);