import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Debug: print key info without exposing the full key
  console.log('[analyze] ANTHROPIC_API_KEY present:', !!apiKey);
  console.log('[analyze] ANTHROPIC_API_KEY length:', apiKey?.length ?? 0);
  console.log('[analyze] ANTHROPIC_API_KEY prefix:', apiKey ? apiKey.slice(0, 15) : '(empty)');

  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured' });
  }

  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
  };

  // Confirm what we're sending
  console.log('[analyze] x-api-key header prefix:', headers['x-api-key'].slice(0, 15));

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers,
    body: JSON.stringify(req.body),
  });

  const data = await upstream.json();
  console.log('[analyze] upstream status:', upstream.status);
  if (!upstream.ok) {
    console.log('[analyze] upstream error:', JSON.stringify(data));
  }
  return res.status(upstream.status).json(data);
}
