async function getPrediction(prompt) {
  const responseDiv = document.getElementById('response');
  responseDiv.innerHTML = 'Waiting for response...';
  
  try {
    const response = await fetch('/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const fullResponse = data.response || 'No response received';
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