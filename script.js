const scriptUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'; // Reemplaza con la URL del script de Google Apps

async function saveAnswerToGoogleSheets(question, answer) {
  console.log('Guardando respuesta:', question, answer);
  const response = await fetch(scriptUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      question: question,
      answer: answer
    })
  });

  if (response.ok) {
    console.log('Respuesta guardada en Google Sheets');
  } else {
    console.error('Error al guardar la respuesta', await response.text());
  }
}

async function saveEmail(email) {
  console.log('Guardando correo electrónico:', email);
  const response = await fetch(scriptUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email
    })
  });

  if (response.ok) {
    console.log('Correo electrónico guardado en Google Sheets');
  } else {
    console.error('Error al guardar el correo electrónico', await response.text());
  }
}

// Otros métodos y funciones de script.js permanecen sin cambios
