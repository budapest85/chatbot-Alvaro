const scriptUrl = 'https://script.google.com/macros/s/AKfycbxHxOVwzrjRKjbEgE_aux3CGZPvBDlqpdLAi3uQhyh9UHOE2iwwLKkukJ8AhSkw1wch/exec'; // Reemplaza con la URL del script de Google Apps

const questions = [
  {
    question: "¿Es Álvaro el causante de todo el aumento de venta directa?",
    answers: ["¿Acaso lo dudas?", "¿Quién va a ser si no, Fran?", "Antonio", "¡Vaya pregunta!"]
  },
  {
    question: "¿Se merece Álvaro una casa gratis en Tulum Country Club?",
    answers: ["Yo creo que sí", "Un palacio", "¡Ya te digo!", "No hay duda"]
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
