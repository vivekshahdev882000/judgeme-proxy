// api/reviews.js
// Judge.me Reviews Proxy — Vercel Serverless Function
// Ye server-side Judge.me API call karta hai, CORS add karta hai

const PRIVATE_TOKEN = 'JTrPdtheJ1wD0fLAJEV82wZlG7Q';
const SHOP_DOMAIN   = '6mesih-sn.myshopify.com';

module.exports = async function handler(req, res) {

  // CORS headers — Shopify store se access allow karo
  res.setHeader('Access-Control-Allow-Origin', 'https://decadedog.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate'); // 5 min cache

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const page     = parseInt(req.query.page     || '1');
  const per_page = parseInt(req.query.per_page || '100');

  try {
    const url = `https://judge.me/api/v1/reviews` +
      `?shop_domain=${encodeURIComponent(SHOP_DOMAIN)}` +
      `&api_token=${encodeURIComponent(PRIVATE_TOKEN)}` +
      `&per_page=${per_page}` +
      `&page=${page}`;

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Judge.me API error: ${response.status}`);
    }

    const data = await response.json();

    return res.status(200).json({
      reviews:     data.reviews     || [],
      total:       data.total       || 0,
      rating:      data.rating      || null,
      total_pages: data.total_pages || 1,
      current_page: page
    });

  } catch (err) {
    console.error('[Proxy Error]', err.message);
    return res.status(500).json({ error: err.message });
  }
};
