const scriptUrl = 'https://script.google.com/macros/s/AKfycbwcll6rXYieL8wi5s9a9p586zCPfHIkdD3VzOqwiJuZsx-MyNROdvKBK9d4x-19qMq7/exec'; // Reemplaza con la URL del script de Google Apps

async function saveAnswerToGoogleSheets(question, answer) {
  console.log('Guardando respuesta:', question, answer);
  const url = `${scriptUrl}?question=${encodeURIComponent(question)}&answer=${encodeURIComponent(answer)}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET'
    });
    if (response.ok) {
      console.log('Respuesta guardada en Google Sheets');
    } else {
      console.error('Error al guardar la respuesta', await response.text());
    }
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

async function saveEmail(email) {
  console.log('Guardando correo electrónico:', email);
  const url = `${scriptUrl}?email=${encodeURIComponent(email)}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET'
    });
    if (response.ok) {
      console.log('Correo electrónico guardado en Google Sheets');
    } else {
      console.error('Error al guardar el correo electrónico', await response.text());
    }
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

async function saveAnswer(questionIndex, answer) {
  const question = questions[questionIndex].question;
  await saveAnswerToGoogleSheets(question, answer);
}

// Inicializar con la primera pregunta
displayQuestion(currentQuestionIndex);
