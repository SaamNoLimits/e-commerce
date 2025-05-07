import { NextResponse } from 'next/server';
import { SessionsClient } from 'dialogflow';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { promises as fs } from 'fs';

const projectId = 'durable-verve-452402';
const KEYFILE = path.join(process.cwd(), 'mon-chatbot-ecommerce.json');

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Lire le fichier JSON
    const keyFileContent = await fs.readFile(KEYFILE, 'utf-8');
    const credentials = JSON.parse(keyFileContent);

    const client = new SessionsClient({ credentials });
    const sessionId = uuidv4();
    const sessionPath = client.projectAgentSessionPath(projectId, sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'fr',
        },
      },
    };

    const responses = await client.detectIntent(request);
    const result = responses[0].queryResult;

    return NextResponse.json({ response: result.fulfillmentText });
  } catch (error) {
    console.error('Erreur Dialogflow :', error);
    return NextResponse.json({ error: 'Erreur lors de la requête vers Dialogflow' }, { status: 500 });
  }
}
