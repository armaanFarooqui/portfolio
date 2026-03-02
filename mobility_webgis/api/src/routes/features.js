import { Router } from 'express';
import client from '../db.js';

const router = new Router();
const allowedTables = ['districts', 'roads'];

router.get('/:table_name', async (req, res) => {
    const { table_name } = req.params;

    if (!allowedTables.includes(table_name)) {
        return res.status(404).json({
            error: 'Table not found'
        });
    }

    try {
        const result = await client.query({
            text: `SELECT *, ST_AsGeoJSON(geometry) AS geojson
                   FROM ${table_name};`
        });

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'No rows found'
            });
        }

        const featureCollection = {
            type: 'FeatureCollection',
            features: result.rows.map(row => {
                const {geojson, geometry, ...properties} = row;

                return {
                    type: 'Feature',
                    properties: properties,
                    geometry: JSON.parse(geojson)
                };
            })
        };

        res.type('application/geo+json');
        res.json(featureCollection);

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: err.message
        });
    }

});

router.get('/:table_name/:id', async (req, res) => {
    const { table_name, id } = req.params;

    if (!allowedTables.includes(table_name)) {
        res.status(404).json({
            error: 'Table not found'
        });
    }

    try {
        const result = await client.query({
            text: `SELECT *, ST_AsGeoJSON(geometry) AS geojson
                   FROM ${table_name}
                   WHERE id = $1;`,
            values: [id]
        });

        if (result.rows.length === 0) {
            res.status(404).json({
                error: 'Record not found'
            });
        }

        const row = result.rows[0];
        const { geojson, geometry, ...properties } = row;

        const feature = {
            type: 'Feature',
            properties: properties,
            geometry: JSON.parse(geojson)
        };

        res.type('application/geo+json');
        res.json(feature);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }

});

export default router;

