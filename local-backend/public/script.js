async function getPrediction(prompt) {
const responseDiv = document.getElementById('response');
responseDiv.innerHTML = 'Waiting for response...';

// Store the complete response
let fullResponse = '';

try {
  // Make a fetch request that will handle the streaming response
  const response = await fetch('/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  // Get a reader from the response body stream
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  // Read the stream
  while (true) {
    const { value, done } = await reader.read();
    
    if (done) {
      break;
    }
    
    // Convert the chunk to text
    const chunk = decoder.decode(value, { stream: true });
    
    // Process each line (each SSE event)
    const lines = chunk.split('\n\n');
    for (const line of lines) {
      if (!line.trim() || !line.startsWith('data: ')) continue;
      
      const eventData = line.substring(6); // Remove 'data: ' prefix
      
      if (eventData === '[DONE]') {
        continue; // End of stream marker
      }
      
      try {
        const jsonData = JSON.parse(eventData);
        
        if (jsonData.response) {
          // Append this chunk to the full response
          fullResponse += jsonData.response;
          
          // Update the UI with the current accumulated response
          responseDiv.innerHTML = `<strong>Response:</strong> ${fullResponse}`;
        }
      } catch (err) {
        console.error('Error parsing JSON:', err, eventData);
      }
    }
  }
  
  responseDiv.innerHTML = `<strong>Complete Response:</strong> ${fullResponse}`;
  
} catch (error) {
  console.error('Error in getPrediction:', error);
  responseDiv.innerHTML = `Request failed: ${error.message}`;
}
}

document.getElementById('submit').addEventListener('click', () => {
const prompt = document.getElementById('prompt').value.trim();
if (!prompt) {
  alert('Please enter a prompt.');
  return;
}
getPrediction(prompt);
});