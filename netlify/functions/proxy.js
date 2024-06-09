const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1TfBj2ODqw8pNQEEeQU7y_h3ipOcVWb5SmGKsWu3T1ndqB45x_vUY8HT8zTma8ycB/exec'; // Reemplaza con tu script URL

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: event.body
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 'error', message: error.message })
    };
  }
};
