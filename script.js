const scriptUrl = 'https://script.google.com/macros/s/AKfycbw2ICkm0GJiWGKQIAbkTTG4e3wXBWxMYyZC8c6RqbIgd_iUFjoODu3Js-_aeGH0yE3-/exec'; // Reemplaza con la URL del script de Google Apps

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
      answerButton.onclick = async () => {
        addMessageToChat(answer, 'user');
        await saveAnswer(currentQuestionIndex, answer);
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

functio
