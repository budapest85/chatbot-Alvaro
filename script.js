const questions = [
  {
    question: "¿Es Alvaro el causante de todo el aumento de venta directa?",
    answers: ["Acaso lo dudas", "¿Quién va a ser si no, ¿Fran?", "¿Antonio?", "Vaya preguntas..."]
  },
  {
    question: "¿Se merece Álvaro una casa gratis en Tulum Country Club?",
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
          displayEmailInput();
        }
      };
      answerContainer.appendChild(answerButton);
    });

    messageElement.appendChild(answerContainer);
  }

  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function displayEmailInput() {
  const emailInputContainer = document.createElement('div');
  emailInputContainer.classList.add('message', 'bot');

  const emailInputLabel = document.createElement('p');
  emailInputLabel.innerText = "Gracias por responder. Por favor, ingresa tu correo electrónico:";
  emailInputContainer.appendChild(emailInputLabel);

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.placeholder = 'Tu correo electrónico';
  emailInput.classList.add('email-input');
  emailInputContainer.appendChild(emailInput);

  const submitButton = document.createElement('button');
  submitButton.innerText = 'Enviar';
  submitButton.classList.add('submit-button');
  submitButton.onclick = () => {
    const email = emailInput.value;
    if (validateEmail(email)) {
      saveEmail(email);
      addMessageToChat('Correo electrónico enviado. ¡Gracias!', 'bot');
      emailInputContainer.remove();
    } else {
      alert('Por favor, ingresa un correo electrónico válido.');
    }
  };
  emailInputContainer.appendChild(submitButton);

  chatBox.appendChild(emailInputContainer);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

async function saveAnswerToGoogleSheets(question, answer) {
  const sheetId = '10kyTZwBYH4r4oxLY0YCdpiB1WFVWCPRDEvpP8QIGqjk'; // Reemplaza con tu ID de la hoja de Google
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

async function saveEmail(email) {
  const sheetId = 'YOUR_SHEET_ID'; // Reemplaza con tu ID de la hoja de Google
  const apiKey = 'YOUR_API_KEY'; // Reemplaza con tu clave de API
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:append?valueInputOption=USER_ENTERED&key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values: [['Email', email]]
    })
  });

  if (response.ok) {
    console.log('Correo electrónico guardado en Google Sheets');
  } else {
    console.error('Error al guardar el correo electrónico', await response.text());
  }
}

function saveAnswer(questionIndex, answer) {
  const question = questions[questionIndex].question;
  saveAnswerToGoogleSheets(question, answer);
}

function displayQuestion(index) {
  const questionData = questions[index];
  addMessageToChat(questionData.question, 'bot', questionData.answers);
}

// Inicializar con la primera pregunta
displayQuestion(currentQuestionIndex);
