import express from 'express';
import router from './routes/features.js';

const app = express();
const port = Number(process.env.PORT);

app.get('/', (req, res) => {
    res.json({
        'status': '200',
        'message': 'Connection successful.'
    });
});

app.use('/table', router);

app.listen(port, () => {
    console.log(`API running on PORT ${port}`)
});