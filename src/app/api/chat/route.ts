import { NextResponse } from 'next/server';

// Define the structure of the request and response
type ChatRequestBody = {
  message: string;
};

// const pythonServerUrl = 'http://192.168.0.102:5000/chat';
const pythonServerUrl = 'http://10.147.56.2:5000/chat';


export async function POST(req: Request) {
  try {
    const body = await req.json() as ChatRequestBody;

    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const response = await fetch(pythonServerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: body.message }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Python server error: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json({ response: data.response });
  } catch (error) {
    console.error('Error communicating with Python server:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
