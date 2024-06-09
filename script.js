<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chatbot</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f0f0f0;
            margin: 0;
        }
        #chat-container {
            width: 400px;
            background: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        #chat-box {
            padding: 20px;
            height: 300px;
            overflow-y: auto;
        }
        .message {
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 8px;
            background: #f9f9f9;
        }
        .message.bot {
            background: #e0e0e0;
        }
        .message.user {
            background: #d0ffd6;
            align-self: flex-end;
        }
        .answer-container {
            margin-top: 10px;
        }
        .answer-button {
            display: block;
            width: 100%;
            margin-bottom: 5px;
            padding: 10px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .answer-button:hover {
            background: #0056b3;
        }
        .response-image {
            max-width: 100%;
            height: auto;
            margin-top: 10px;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div id="chat-container">
        <div id="chat-box"></div>
    </div>
    <script>
        const proxyUrl = '/api/proxy'; // URL del proxy en Netlify

        const questions = [
            { // Pregunta 0
                question: "¿Es Álvaro el causante de todo el aumento de venta directa?",
                answers: [
                    { text: "¿Acaso lo dudas?", nextQuestion: 1, image: "https://github.com/budapest85/chatbot-Alvaro/blob/main/giphy.gif?raw=true" },
                    { text: "Fran", nextQuestion: 1 },
                    { text: "Antonio", nextQuestion: 3 }
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
    </script>
</body>
</html>
