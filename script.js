const proxyUrl = '/api/proxy'; // URL del proxy en Netlify

const questions = [
  { // Pregunta 0
    question: "¿Es Álvaro el causante de todo el aumento de venta directa?",
    answers: [
      { text: "¿Acaso lo dudas?", nextQuestion: 2 },
      { text: "¿Quién va a ser si no, ¿Fran?", nextQuestion: 1 },
      { text: "Antonio", nextQuestion: 3 }

    ]
  },
  { // Pregunta 1
    question: "¿Fran? ¿el que nunca está en su sitio? será broma!",
    answers: [
      { text: "Un día fui 3 veces a su sitio y nunca le encontré", nextQuestion: null },
      { text: "Estaba con su yate", nextQuestion: null },
      { text: "Estaba dándoles ventas a los brokers", nextQuestion: null }
    ]
  },
  { // Pregunta 2
    question: "¿Es Álvaro el puto amo?",
    answers: [
      { text: "Sí", nextQuestion: null },
      { text: "100% lo es", nextQuestion: null },
      { text: "Absolutamente", nextQuestion: null },
      { text: "Sí rotundo", nextQuestion: null }
    ]
  },
  { // Pregunta 3
    question: "Creo que te has equivocado",
    answers: [
      { text: "Sí, lo siento, se me ha ido la pinza con Antonio", nextQuestion: null },
      { text: "Lo siento, no volverá a pasar. Siempre es Alvaro", nextQuestion: null }
    ]
  },
  { // Pregunta 4
    question: "Pregunta alternativa 2",
    answers: [
      { text: "Respuesta A", nextQuestion: null },
      { text: "Respuesta B", nextQuestion: null }
    ]
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
      answerButton.innerText = answer.text;
      answerButton.onclick = async () => {
        addMessageToChat(answer.text, 'user');
        await saveAnswer(currentQuestionIndex, answer.text);
        if (answer.nextQuestion !== null) {
          currentQuestionIndex = answer.nextQuestion;
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
  submitButton.onclick = async () => {
    const email = emailInput.value;
    if (validateEmail(email)) {
      await saveEmail(email);
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
  const re = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
  return re.test(email);
}

async function saveAnswerToGoogleSheets(question, answer) {
  console.log('Guardando respuesta:', question, answer);
  const data = { question: question, answer: answer };

  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
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
  const data = { email: email };

  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
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

function displayQuestion(index) {
  const questionData = questions[index];
  addMessageToChat(questionData.question, 'bot', questionData.answers);
}

// Inicializar con la primera pregunta
displayQuestion(currentQuestionIndex);
