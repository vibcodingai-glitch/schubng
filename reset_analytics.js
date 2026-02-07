
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
        const email = 'binisah.info@gmail.com';

        // 1. Reset Profile Views to 0
        const resUser = await pool.query(
            'UPDATE "users" SET profile_views = 0 WHERE email = $1 RETURNING id',
            [email]
        );

        if (resUser.rows.length === 0) {
            console.log('User not found');
            return;
        }
        const userId = resUser.rows[0].id;
        console.log('Reset profile_views to 0 for user:', userId);

        // 2. Reset Post Impressions to 0
        const resPosts = await pool.query('UPDATE "posts" SET impressions = 0 WHERE author_id = $1', [userId]);
        console.log(`Reset impressions to 0 for ${resPosts.rowCount} posts.`);

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

main();
