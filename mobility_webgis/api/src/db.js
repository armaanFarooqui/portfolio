import pg from 'pg';

const { Client } = pg;

const client = new Client({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
});

try {
    await client.connect();
    console.log('Postgres connection successful.')
} catch (err) {
    console.log(`Error: ${err}`)
    process.exit(1);
}

export default client;