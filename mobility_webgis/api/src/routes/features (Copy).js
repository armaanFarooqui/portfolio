import { Router } from 'express';
import client from '../db.js';

const allowedTables = [
    'districts',
    'roads',
    'rail',
    'canals',
    'bus_stops',
    'railway_stations'
];

const allowedColumns = [
    'id',
    'name',
    'road_class'
];

const router = new Router();

router.get('/layers', async (req, res) => {
    res.json({
        layers: allowedTables.join(', '),
    });
});

router.get('/layers/:layer', async (req, res) => {
    const { layer } = req.params;

    if (!allowedTables.includes(layer)) {
        return res.status(404).json({
            error: 'Layer not found'
        });
    }

    res.json({
        layer,
        description: `Spatial dataset for the ${layer}`
    });

});

router.get('/layers/:layer/features', async (req, res) => {
    const { layer } = req.params;
    const { bbox, ...filters } = req.query;

    if (!allowedTables.includes(layer)) {
        res.status(404).json({
            error: 'Table not found'
        });
    }

    let query = `SELECT *, ST_AsGeoJSON(geometry) as geojson
                 FROM ${layer}`;

    const values = [];
    const conditions = [];

    if (bbox) {
        const bboxvalues = bbox.split(',').map(Number);
        
        values.push(...bboxvalues);
        conditions.push(`geometry && ST_MakeEnvelope($1, $2, $3, $4)`);
    }

    Object.keys(filters).forEach(key => {
        if (allowedColumns.includes(key)) {
            values.push(filters[key]);
            conditions.push(`${key} = $${values.length}`);
        }
    });

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    try {
        const result = await client.query({
            text: query,
            values
        });

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'No rows found'
            });
        }

        const featureCollection = {
            type: 'FeatureCollection',
            features: result.rows.map(row => {
                const { geojson, geometry, ...properties } = row;

                return ({
                    type: 'Feature',
                    properties,
                    geometry: JSON.parse(geojson),
                });
            }),
        };

        res.type('application/geo+json');
        res.json(featureCollection);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }

});

router.get('/layers/:layer/schema', async (req, res) => {
    const { layer } = req.params;

    if (!allowedTables.includes(layer)) {
        res.status(404).json({
            error: 'Table not found'
        });
    }

    try {
        const result = await client.query({
            text: `SELECT column_name, data_type
                FROM information_schema.columns
                WHERE table_name = $1`,
            values: [layer]
        });

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }

});

export default router;