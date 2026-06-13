import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: 'Missing slug' });

  try {
    // Lấy thông tin manga
    const { rows: manga } = await pool.query(`
      SELECT
        m.*,
        COALESCE(
          json_agg(g.name_en ORDER BY g.name_en) FILTER (WHERE g.name_en IS NOT NULL),
          '[]'
        ) AS genres
      FROM sc_manga m
      LEFT JOIN sc_manga_genres mg ON mg.manga_id = m.id
      LEFT JOIN sc_genres g ON g.id = mg.genre_id
      WHERE m.url_slug = $1
      GROUP BY m.id
    `, [slug]);

    if (!manga.length) return res.status(404).json({ error: 'Manga not found' });

    // Lấy danh sách chapter
    // const { rows: chapters } = await pool.query(`
    //   SELECT id, chapter_num, title, views, published_at
    //   FROM sc_chapters
    //   WHERE manga_id = $1
    //   ORDER BY chapter_num DESC
    // `, [parseInt(manga[0].id)]);

    const { rows: chapters } = await pool.query(`
  SELECT id, chapter_num, title, views, published_at
  FROM sc_chapters
  ORDER BY chapter_num DESC
  LIMIT 10
`);

    res.status(200).json({ manga: manga[0], chapters });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}