import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectToMongoDB } from './config/db.js'

const app = express()

app.use(express.json())
app.use(cors())
const PORT = 3000

const startServer = async () => {
  try {
    await connectToMongoDB();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();