import type { AnalysisResult } from '../types';

export async function analyzePhoto(imageBase64: string, mimeType: string): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('请在 .env.local 中配置 VITE_ANTHROPIC_API_KEY');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: `你是一位音乐与视觉艺术的跨界鉴赏家，拥有诗人的感知力。请深度感受这张照片的情绪、色彩、光线、构图和意境，推荐一首能与之产生灵魂共鸣的歌曲（中外均可）。

请仅返回以下JSON格式，不含任何其他文字或代码块：
{
  "mood": "照片的核心情绪（4字以内，中文，如：静谧悠远、忧郁迷离）",
  "song": "推荐歌曲名称（原名，可为中英文）",
  "artist": "歌手或艺术家名称",
  "reason": "一句诗意的推荐理由（20-40字，中文，用意象化、通感的语言，描述照片与音乐之间内在的情感连接）",
  "tags": ["视觉元素词1", "词2", "词3", "词4", "词5", "词6", "词7", "词8"],
  "atmosphere": "整体氛围描述（8-15字，中文，诗意凝练）"
}

tags要求：6-10个词，每词2-4字，涵盖照片中的视觉元素、色彩特征、光线质感、情绪关键词、空间感受等，词语需富有诗意。`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(errBody.error?.message ?? `API 请求失败 (${response.status})`);
  }

  const data = await response.json() as { content: Array<{ text: string }> };
  const raw = data.content[0].text.trim();

  // Strip markdown code fences if present
  const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const match = jsonStr.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('无法解析返回数据，请重试');

  return JSON.parse(match[0]) as AnalysisResult;
}
