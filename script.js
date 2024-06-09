const proxyUrl = '/api/proxy'; // URL del proxy en Netlify

const questions = [
  { // Pregunta 0
    question: "¿Es Álvaro el causante de todo el aumento de venta directa?",
    answers: [
      { text: "¿Acaso lo dudas?", nextQuestion: 1, image: "https://link-a-tu-imagen.com/imagen.jpg" },
      { text: "¿Quién va a ser si no, Fran?", nextQuestion: 2 },
      { text: "Antonio", nextQuestion: 3 },
      { text: "¡Vaya pregunta!", nextQuestion: 4 }
    ]
  },
  { // Pregunta 1
    question: "¿Se merece Álvaro una casa gratis en Tulum Country Club?",
    answers: [
      { text: "Yo creo que sí", nextQuestion: null },
      { text: "Un palacio", nextQuestion: null },
      { text: "¡Ya te digo!", nextQuestion: null },
      { text: "No hay duda", nextQuestion: null }
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
    question: "Pregunta alternativa 1",
    answers: [
      { text: "Respuesta 1", nextQuestion: null },
      { text: "Respuesta 2", nextQuestion: null }
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

function addMessageToChat(message, sender, answers, image) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender);

  const messageText = document.createElement('p');
  messageText.innerText = message;
  messageElement.appendChild(messageText);

  if (image) {
    const imageElement = document.createElement('img');
    imageElement.src = image;
    imageElement.alt = "Respuesta imagen";
    imageElement.classList.add('response-image'); // Puedes agregar una clase CSS para estilos
    messageElement.appendChild(imageElement);
  }

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
        if (answer.image) {
          addMessageToChat("", "bot", null, answer.image);
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
  const re = /^[^\s@]+
