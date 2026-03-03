import express from 'express';
import cors from 'cors';
import router from './routes/features.js';

const app = express();
const port = Number(process.env.PORT);

app.use(cors());

app.get('/', (req, res) => {
    res.json({
        'status': '200',
        'message': 'Connection successful.'
    });
});

app.use('/api', router);

app.listen(port, () => {
    console.log(`API running on PORT ${port}`)
});