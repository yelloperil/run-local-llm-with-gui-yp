async function getPrediction(prompt) {
  const responseDiv = document.getElementById('response');
  responseDiv.innerHTML = 'Waiting for response...';
  
  let fullResponse = '';
  
  try {
    
    const response = await fetch('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { value, done } = await reader.read();
      
      if (done) {
        break;
      }
      
      const chunk = decoder.decode(value, { stream: true });
      
      const lines = chunk.split('\n\n');
      for (const line of lines) {
        if (!line.trim() || !line.startsWith('data: ')) continue;
        
        const eventData = line.substring(6); 
        
        if (eventData === '[DONE]') {
          continue; 
        }
        
        try {
          const jsonData = JSON.parse(eventData);
          
          if (jsonData.response) {
            
            fullResponse += jsonData.response;
            
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