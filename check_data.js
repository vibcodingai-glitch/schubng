
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
        // Check User Profile Views
        const resUser = await pool.query('SELECT id, first_name, profile_views FROM "users" WHERE email = $1', ['binisah.info@gmail.com']);
        if (resUser.rows.length === 0) {
            console.log('User not found');
            return;
        }
        const user = resUser.rows[0];
        console.log('User Profile Views:', user.profile_views);

        // Check Post Impressions
        // 'impressions' column might be mixed case if not mapped, but usually lowercase in PG if created by Prisma without map
        // Let's check listing columns first if unsure, but try selecting 'impressions'
        try {
            const resPosts = await pool.query('SELECT id, impressions FROM "posts" WHERE author_id = $1', [user.id]);
            console.log('Posts Count:', resPosts.rowCount);
            let totalImpressions = 0;
            resPosts.rows.forEach(p => {
                totalImpressions += (p.impressions || 0);
            });
            console.log('Total Impressions:', totalImpressions);
        } catch (e) {
            console.log('Error querying posts impressions:', e.message);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

main();
