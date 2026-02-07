
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

        // 1. Update Profile Views to 56
        const resUser = await pool.query(
            'UPDATE "users" SET profile_views = 56 WHERE email = $1 RETURNING id',
            [email]
        );

        if (resUser.rows.length === 0) {
            console.log('User not found');
            return;
        }
        const userId = resUser.rows[0].id;
        console.log('Updated profile_views to 56 for user:', userId);

        // 2. Update Post Impressions to sum to 69
        // We have 3 posts. 23 + 23 + 23 = 69.
        const resPosts = await pool.query('SELECT id FROM "posts" WHERE author_id = $1', [userId]);
        const posts = resPosts.rows;

        console.log(`Found ${posts.length} posts.`);

        if (posts.length > 0) {
            // Distribute 69 evenly-ish
            // If we have 3 posts: 23, 23, 23.
            // If random number of posts, we distribute.
            const targetTotal = 69;
            const base = Math.floor(targetTotal / posts.length);
            let remainder = targetTotal % posts.length;

            for (const post of posts) {
                let imp = base;
                if (remainder > 0) {
                    imp += 1;
                    remainder--;
                }
                await pool.query('UPDATE "posts" SET impressions = $1 WHERE id = $2', [imp, post.id]);
                console.log(`Updated post ${post.id} impressions to ${imp}`);
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

main();
