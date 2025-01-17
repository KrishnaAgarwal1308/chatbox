import type { NextApiRequest, NextApiResponse } from 'next';

// Define the structure of the request and response
type ChatRequestBody = {
  message: string;
};

type ChatResponseBody = {
  response: string;
};

const pythonServerUrl = 'http://192.168.0.102:5000/chat'; 

export default async function POST(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponseBody | { error: string }>
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { message } = req.body as ChatRequestBody;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Invalid request body' });
    return;
  }

  try {
    const response = await fetch(pythonServerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Python server error: ${errorText}`);
    }

    const data = await response.json();
    res.status(200).json({ response: data.response });
  } catch (error: unknown) {
    console.error('Error communicating with Python server:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
