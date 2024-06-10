const proxyUrl = '/api/proxy'; // URL del proxy en Netlify

const questions = [
  { // Pregunta 0
    question: "¿What type of property are you looking for??",
    answers: [
      { text: "An Apartment", nextQuestion: 2, image: "https://raw.githubusercontent.com/budapest85/chatbot-Alvaro/main/casa.gif" },
      { text: "A Vila", nextQuestion: 3, image: "https://raw.githubusercontent.com/budapest85/chatbot-Alvaro/main/playa.gif" },
      { text: "A condominium lot", nextQuestion: 1, image: "https://raw.githubusercontent.com/budapest85/chatbot-Alvaro/main/fam3.gif" },
      { text: "I'm not sure", nextQuestion: 4, image: "https://raw.githubusercontent.com/budapest85/chatbot-Alvaro/main/cas2.gif" }
    ]
  },
  { // Pregunta 1
    question: "Alright, you want a lot. Do you know how much you are willing to invest?",
    answers: [
      { text: "Less than a million dollars", nextQuestion: null },
      { text: "More than a million dollars", nextQuestion: null }
    ]
  },
  { // Pregunta 2
    question: "¿Are you looking for a family-friendly environment?",
    answers: [
      { text: "Yes, I’m looking for common areas", nextQuestion: null },
      { text: "I'm very interested in sports", nextQuestion: null },
      { text: "I'm only looking to invest.", nextQuestion: null },
      { text: "I'm looking for a second home", nextQuestion: null }
    ]
  },
  { // Pregunta 3
    question: "We already know you're looking for a villa, but...",
    answers: [
      { text: "Do you also want a swimming pool?", nextQuestion: 2, image: "https://raw.githubusercontent.com/budapest85/chatbot-Alvaro/main/yrt.gif" },
      { text: "One or two floors?", nextQuestion: null }
    ]
  },
  { // Pregunta 4
    question: "Eres sabio",
    answers: [
      { text: "A", nextQuestion: null },
      { text: "B", nextQuestion: null }
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
    imageElement.classList.add('response-image');
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
        if (answer.image) {
          addMessageToChat("", "bot", null, answer.image);
          setTimeout(() => {
            currentQuestionIndex = answer.nextQuestion;
            displayQuestion(currentQuestionIndex);
          }, 3000); // Espera 3 segundos antes de mostrar la siguiente pregunta
        } else if (answer.nextQuestion !== null) {
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
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

function typeWriter(text, i, callback) {
  if (i < text.length) {
    document.getElementById("intro-text").innerHTML = text.substring(0, i + 1) + '<span aria-hidden="true"></span>';
    setTimeout(function() {
      typeWriter(text, i + 1, callback);
    }, 20); // Velocidad ajustada a 50ms para mayor rapidez
  } else if (typeof callback == 'function') {
    setTimeout(callback, 700);
  }
}

// Inicializar con la introducción
function startIntro() {
  const introText = "Welcome to this chat that will guide you to find the product that best suits your needs. Discover everything you're looking for within our <b>Residencial Playa Nueva Romana.</b>";
  const introElement = document.createElement('div');
  introElement.classList.add('message', 'bot', 'typewriter');
  introElement.innerHTML = '<p id="intro-text"></p>';
  chatBox.appendChild(introElement);

  typeWriter(introText, 0, function() {
    displayQuestion(currentQuestionIndex);
  });
}

// Ejecutar la introducción al cargar
startIntro();
