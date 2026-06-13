import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { chapter_id } = req.query;
  if (!chapter_id) return res.status(400).json({ error: 'Missing chapter_id' });

  try {
    const { rows: pages } = await pool.query(`
      SELECT p.page_num, p.image_url,
             c.chapter_num, c.title AS chapter_title,
             m.title AS manga_title, m.url_slug
      FROM pages p
      JOIN chapters c ON c.id = p.chapter_id
      JOIN manga m ON m.id = c.manga_id
      WHERE p.chapter_id = $1
      ORDER BY p.page_num ASC
    `, [chapter_id]);

    if (!pages.length) return res.status(404).json({ error: 'Chapter not found' });

    res.status(200).json(pages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}