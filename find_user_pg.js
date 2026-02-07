
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load .env manually
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        process.env[key] = value.replace(/^["'](.*)["']$/, '$1');
    }
});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    try {
        const query = `
            SELECT id, email, first_name, last_name, profile_photo_url 
            FROM "users" 
            WHERE first_name ILIKE '%abdulrahman%' 
               OR last_name ILIKE '%abdulrahman%'
        `;
        const res = await pool.query(query);
        console.log('Found users:', res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

main();
