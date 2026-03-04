import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const MODEL = 'claude-sonnet-4-5-20250929';

/**
 * Generate a 1-2 sentence excerpt/summary from article body text
 */
export async function generateArticleSummary(articleBody: string, title: string): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set');
  }

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 200,
    messages: [
      {
        role: 'user',
        content: `You are writing a 1-2 sentence excerpt for a Philadelphia high school sports article. The excerpt should be engaging and capture the key point of the article. Keep it under 200 characters.

Title: ${title}

Article:
${articleBody.slice(0, 3000)}

Write just the excerpt, no quotes or labels.`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === 'text');
  return textBlock?.text?.trim() || '';
}

/**
 * Generate a game recap article draft from game data
 */
export async function generateGameRecap(gameData: {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  sport: string;
  date: string;
  season: string;
}): Promise<{ title: string; body: string; excerpt: string }> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set');
  }

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: `Write a short game recap for a Philadelphia high school ${gameData.sport} game. Write in an engaging sports journalism style appropriate for PhillySportsPack.com.

Game details:
- ${gameData.awayTeam} at ${gameData.homeTeam}
- Score: ${gameData.homeTeam} ${gameData.homeScore}, ${gameData.awayTeam} ${gameData.awayScore}
- Date: ${gameData.date}
- Season: ${gameData.season}

Respond in this exact JSON format:
{
  "title": "headline for the article",
  "body": "2-3 paragraph recap in markdown format",
  "excerpt": "1 sentence summary under 200 characters"
}

Only output the JSON, nothing else.`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === 'text');
  const text = textBlock?.text?.trim() || '{}';

  try {
    return JSON.parse(text);
  } catch {
    // If JSON parse fails, return raw text as body
    return {
      title: `${gameData.homeTeam} vs ${gameData.awayTeam} Recap`,
      body: text,
      excerpt: `${gameData.homeTeam} ${gameData.homeScore > gameData.awayScore ? 'defeats' : 'falls to'} ${gameData.awayTeam} ${gameData.homeScore}-${gameData.awayScore}.`,
    };
  }
}
