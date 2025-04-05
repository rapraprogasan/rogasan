document.addEventListener('DOMContentLoaded', () => {
    const quizQuestions = [
        {
            question: "What does HTML stand for?",
            options: [
                "Hyper Text Markup Language",
                "Hyperlinks and Text Markup Language",
                "Home Tool Markup Language",
                "Hyper Text Makeup Language"
            ],
            answer: 0,
            explanation: "HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages."
        },
        {
            question: "Which HTML element is used to define the structure of an HTML document?",
            options: [
                "<html>",
                "<head>",
                "<body>",
                "<!DOCTYPE>"
            ],
            answer: 0,
            explanation: "The <html> element is the root element that defines the whole HTML document."
        },
        {
            question: "Which tag is used to create a hyperlink in HTML?",
            options: [
                "<a>",
                "<link>",
                "<href>",
                "<hyperlink>"
            ],
            answer: 0,
            explanation: "The <a> tag defines a hyperlink, which is used to link from one page to another."
        },
        {
            question: "Which HTML element is used to display an image?",
            options: [
                "<img>",
                "<picture>",
                "<image>",
                "<src>"
            ],
            answer: 0,
            explanation: "The <img> tag is used to embed an image in an HTML page."
        },
        {
            question: "Which HTML attribute is used to define inline styles?",
            options: [
                "style",
                "css",
                "class",
                "font"
            ],
            answer: 0,
            explanation: "The style attribute is used to add inline styles to an element."
        },
        {
            question: "Which HTML element is used to define a paragraph?",
            options: [
                "<p>",
                "<para>",
                "<paragraph>",
                "<pg>"
            ],
            answer: 0,
            explanation: "The <p> tag defines a paragraph in HTML."
        },
        {
            question: "Which HTML element is used to define the most important heading?",
            options: [
                "<h1>",
                "<heading>",
                "<head>",
                "<h6>"
            ],
            answer: 0,
            explanation: "The <h1> tag defines the most important heading (level 1)."
        },
        {
            question: "Which HTML element is used to create an unordered list?",
            options: [
                "<ul>",
                "<ol>",
                "<li>",
                "<list>"
            ],
            answer: 0,
            explanation: "The <ul> tag defines an unordered (bulleted) list."
        },
        {
            question: "Which HTML element is used to define a table row?",
            options: [
                "<tr>",
                "<td>",
                "<th>",
                "<table-row>"
            ],
            answer: 0,
            explanation: "The <tr> tag defines a row in an HTML table."
        },
        {
            question: "Which HTML element is used to embed JavaScript code?",
            options: [
                "<script>",
                "<javascript>",
                "<js>",
                "<code>"
            ],
            answer: 0,
            explanation: "The <script> tag is used to embed or reference JavaScript code."
        }
    ];

    // DOM elements
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options-container');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const resultsContainer = document.getElementById('results-container');
    const scoreElement = document.getElementById('score');
    const scoreDetail = document.getElementById('score-detail');
    const feedbackElement = document.getElementById('feedback');
    const retryBtn = document.getElementById('retry-btn');

    // Quiz state
    let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers = Array(quizQuestions.length).fill(null);
    let quizSubmitted = false;

    // Initialize quiz
    showQuestion(currentQuestionIndex);

    // Event listeners
    prevBtn.addEventListener('click', goToPrevQuestion);
    nextBtn.addEventListener('click', goToNextQuestion);
    submitBtn.addEventListener('click', submitQuiz);
    retryBtn.addEventListener('click', resetQuiz);

    // Functions
    function showQuestion(index) {
        const question = quizQuestions[index];
        questionElement.textContent = question.question;
        optionsContainer.innerHTML = '';
        
        // Update progress
        progressText.textContent = `${index + 1}/${quizQuestions.length}`;
        
        // Create options
        question.options.forEach((option, i) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.textContent = option;
            optionElement.dataset.option = String.fromCharCode(65 + i); // A, B, C, D
            
            // Highlight selected answer
            if (userAnswers[index] === i) {
                optionElement.classList.add('selected');
            }
            
            // Show correct/incorrect answers after submission
            if (quizSubmitted) {
                optionElement.classList.remove('selected');
                if (i === question.answer) {
                    optionElement.classList.add('correct');
                } else if (userAnswers[index] === i && userAnswers[index] !== question.answer) {
                    optionElement.classList.add('incorrect');
                }
            }
            
            optionElement.addEventListener('click', () => selectOption(i));
            optionsContainer.appendChild(optionElement);
        });
        
        updateProgressBar();
        updateNavigationButtons();
    }

    function selectOption(optionIndex) {
        if (quizSubmitted) return;
        
        userAnswers[currentQuestionIndex] = optionIndex;
        showQuestion(currentQuestionIndex);
    }

    function updateProgressBar() {
        const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function updateNavigationButtons() {
        prevBtn.disabled = currentQuestionIndex === 0;
        nextBtn.disabled = currentQuestionIndex === quizQuestions.length - 1;
        submitBtn.style.display = currentQuestionIndex === quizQuestions.length - 1 ? 'block' : 'none';
    }

    function goToNextQuestion() {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        }
    }

    function goToPrevQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion(currentQuestionIndex);
        }
    }

    function calculateScore() {
        score = 0;
        for (let i = 0; i < quizQuestions.length; i++) {
            if (userAnswers[i] === quizQuestions[i].answer) {
                score++;
            }
        }
        return Math.round((score / quizQuestions.length) * 100);
    }

    function submitQuiz() {
        quizSubmitted = true;
        showResults();
    }

    function showResults() {
        const percentage = calculateScore();
        scoreElement.textContent = percentage;
        scoreDetail.textContent = `You got ${score} out of ${quizQuestions.length} questions correct`;
        
        // Generate feedback
        feedbackElement.innerHTML = '';
        quizQuestions.forEach((question, index) => {
            const feedbackItem = document.createElement('div');
            feedbackItem.classList.add('feedback-item');
            
            const isCorrect = userAnswers[index] === question.answer;
            
            if (isCorrect) {
                feedbackItem.classList.add('correct');
            } else {
                feedbackItem.classList.add('incorrect');
            }
            
            const feedbackStatus = document.createElement('div');
            feedbackStatus.classList.add('feedback-status');
            feedbackStatus.textContent = isCorrect ? 'Correct' : 'Incorrect';
            
            const feedbackQuestion = document.createElement('div');
            feedbackQuestion.classList.add('feedback-question');
            feedbackQuestion.textContent = question.question;
            
            const userAnswerText = userAnswers[index] !== null ? 
                `Your answer: ${question.options[userAnswers[index]]}` : 
                'You did not answer this question';
            
            const correctAnswerText = `Correct answer: ${question.options[question.answer]}`;
            
            const feedbackExplanation = document.createElement('div');
            feedbackExplanation.classList.add('feedback-explanation');
            feedbackExplanation.textContent = question.explanation;
            
            const feedbackAnswer = document.createElement('div');
            feedbackAnswer.classList.add('feedback-answer');
            feedbackAnswer.innerHTML = `${userAnswerText}<br>${correctAnswerText}`;
            
            feedbackItem.appendChild(feedbackStatus);
            feedbackItem.appendChild(feedbackQuestion);
            feedbackItem.appendChild(feedbackAnswer);
            feedbackItem.appendChild(feedbackExplanation);
            feedbackElement.appendChild(feedbackItem);
        });
        
        document.getElementById('question-container').style.display = 'none';
        resultsContainer.style.display = 'block';
        
        // Scroll to top of results
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function resetQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = Array(quizQuestions.length).fill(null);
        quizSubmitted = false;
        
        document.getElementById('question-container').style.display = 'block';
        resultsContainer.style.display = 'none';
        
        showQuestion(currentQuestionIndex);
    }
});