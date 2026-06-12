import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const { rows } = await pool.query(`
      SELECT
        m.id,
        m.title,
        m.kanji,
        m.cover_url,
        m.gradient_from,
        m.gradient_to,
        m.status,
        m.total_chapters,
        m.views,
        m.updated_at,
        m.url_slug,
        EXTRACT(DAY FROM NOW() - m.updated_at)::int AS update_days,
        COALESCE(
          json_agg(g.name_en ORDER BY g.name_en) FILTER (WHERE g.name_en IS NOT NULL),
          '[]'
        ) AS genres
      FROM sc_manga m
      LEFT JOIN sc_manga_genres mg ON mg.manga_id = m.id
      LEFT JOIN sc_genres g ON g.id = mg.genre_id
      GROUP BY m.id
      ORDER BY m.updated_at DESC
    `);

    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}