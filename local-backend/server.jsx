const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Ollama API endpoint
const OLLAMA_API = 'http://localhost:11434/api';

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: 'No prompt provided' });
  }
  
  try {
    console.log(`Sending prompt to Ollama: "${prompt}"`);
    
    // Set headers for SSE (Server-Sent Events)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Make a request to Ollama API with responseType: 'stream'
    const response = await axios.post(`${OLLAMA_API}/generate`, {
      // model: 'phi4-mini-reasoning',
      model: 'tinyllama',
      // model: 'tinyllama:1.1b-chat-v1-q4_K_M',
      // model: 'phi4-mini',
      // model: 'qwen2.5-coder',
      // model: 'deepseek-r1:1.5b',
      // model: 'tinyllama:1.1b-chat-v1-q5_K_S',
      prompt: prompt,
      stream: true // Enable streaming
    }, { 
      responseType: 'stream',
      timeout: 60000 
    });
    
    console.log('Stream connected to Ollama');
    
    // Pipe the response stream directly to our response
    response.data.on('data', (chunk) => {
      const chunkStr = chunk.toString();
      try {
        // Send each chunk as a SSE event
        res.write(`data: ${chunkStr}\n\n`);
      } catch (error) {
        console.error('Error processing chunk:', error);
      }
    });
    
    response.data.on('end', () => {
      console.log('Stream ended');
      // Send a final event signaling the end of the stream
      res.write('data: [DONE]\n\n');
      res.end();
    });
    
    response.data.on('error', (err) => {
      console.error('Stream error:', err);
      res.end();
    });
    
  } catch (error) {
    console.error('Error connecting to Ollama:', error.message);
    if (error.response) {
      console.error('Response error data:', error.response.data);
    }
    res.status(500).json({ error: error.message });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Ollama API endpoint: ${OLLAMA_API}`);
});