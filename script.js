const questions = [
  {
    question: "¿Cuál es tu color favorito?",
    answers: ["Rojo", "Azul", "Verde", "Amarillo"]
  },
  {
    question: "¿Cuál es tu comida favorita?",
    answers: ["Pizza", "Hamburguesa", "Ensalada", "Pasta"]
  }
];

let currentQuestionIndex = 0;
const chatBox = document.getElementById('chat-box');

function addMessageToChat(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender);
  const messageText = document.createElement('p');
  messageText.innerText = message;
  messageElement.appendChild(messageText);
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
    console.error('Error al guardar la respuesta', await response.text());
  }
}

function saveAnswer(questionIndex, answer) {
  const question = questions[questionIndex].question;
  saveAnswerToGoogleSheets(question, answer);
}

function displayQuestion(index) {
  const questionData = questions[index];
  addMessageToChat(questionData.question, 'bot');

  const inputContainer = document.getElementById('input-container');
  inputContainer.innerHTML = ''; // Limpiar respuestas anteriores

  questionData.answers.forEach(answer => {
    const answerButton = document.createElement('button');
    answerButton.innerText = answer;
    answerButton.onclick = () => {
      addMessageToChat(answer, 'user');
      saveAnswer(index, answer);
      if (index < questions.length
