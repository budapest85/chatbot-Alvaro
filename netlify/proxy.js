const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzKRHKHCePwW1TFDWhUWUnwqbNQ5HJXS9FUBYWjwL4P-v3FwTYGDHDNsCNMLajWZOCn/exec'; // Reemplaza con tu script URL

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
