const questions = [
  {
    question: "¿Es Álvaro el causante de todo el aumento de venta Online?",
    answers: ["¿Acaso lo dudas?", "¿Quién va a ser si no?, ¿Fran", "¿Antonio?", "Vaya preguntas..."]
  },
  {
    question: "¿Se merece Alvaro una casa gratis en Tulum Country Club?",
    answers: ["Yo creo que sí", "Un palacio", "Ya te digo", "No hay duda"]
  },
  {
    question: "¿Es Álvaro el puto amo?",
    answers: ["Sí", "100% lo es", "Absolutamente", "Sí rotundo"]
  }
];

let currentQuestionIndex = 0;
const chatBox = document.getElementById('chat-box');

function addMessageToChat(message, sender, answers) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender);

  const messageText = document.createElement('p');
  messageText.innerText = message;
  messageElement.appendChild(messageText);

  if (answers) {
    const answerContainer = document.createElement('div');
    answerContainer.classList.add('answer-container');

    answers.forEach(answer => {
      const answerButton = document.createElement('button');
      answerButton.classList.add('answer-button');
      answerButton.innerText = answer;
      answerButton.onclick = () => {
        addMessageToChat(answer, 'user');
        saveAnswer(currentQuestionIndex, answer);
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
          displayQuestion(currentQuestionIndex);
        } else {
          addMessageToChat('Gracias por responder', 'bot');
        }
      };
      answerContainer.appendChild(answerButton);
    });

    messageElement.appendChild(answerContainer);
  }

  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function saveAnswerToGoogleSheets(question, answer) {
  const sheetId = '1SUFNHZBTs6aNkOUS-MjMgMEP2h0XCVzhleWKvBv9kaQ'; // Reemplaza con tu ID de la hoja de Google
  const apiKey = 'AIzaSyB0LcBVw0dR2DXWBIoXoH04OhKalAhmq60'; // Reemplaza con tu clave de API
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:append?valueInputOption=USER_ENTERED&key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values: [[question, answer]]
    })
  });

  if (response.ok) {
    console.log('Respuesta guardada en Google Sheets');
  } else {
    console.error('Error al guardar la respuesta', await r
