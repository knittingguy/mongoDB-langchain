import express, { Express, Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import { callAgent } from './agent';
import 'dotenv/config';
import { start } from 'repl';

const app: Express = express();
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_ATLAS_URI as string);

async function startServer() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Connected to MongoDB Atlas');

    app.get('/', (req: Request, res: Response) => {
      res.send('LangGraph Agent Server');
    });



    app.post('/chat', async (req: Request, res: Response) => {
      const initialMessage = req.body.message;
      const thread_id = Date.now().toString(); // Use current timestamp as thread_id
  
      try {
        const response = await callAgent(client, initialMessage, thread_id);
        res.json({ thread_id, response });
      } catch (error) {
        console.error('Error starting conversation:', error);
        res.status(500).json({ error: 'Internal server error in chat' });
      }
    });

    app.post('/chat/:thread_id', async (req: Request, res: Response) => {
        const { thread_id } = req.params;
        const { message } = req.body;

        try {
            const response = await callAgent(client, message, thread_id);
            res.json({ thread_id, response });
        } catch (error) {
            console.error('Error in chat:', error);
            res.status(500).json({ error: 'Internal server error in chat thread' });
        }
    });

    const PORT = process.env.PORT || 3456;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    // Perform operations here
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
  } finally {
    // await client.close();
  }
}

startServer();
