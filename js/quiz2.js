document.addEventListener('DOMContentLoaded', () => {
    const quizQuestions = [
        {
            question: "What does CSS stand for?",
            options: [
                "Cascading Style Sheets",
                "Creative Style Sheets",
                "Computer Style Sheets",
                "Colorful Style Sheets"
            ],
            answer: 0,
            explanation: "CSS stands for Cascading Style Sheets, which is used to style and layout web pages."
        },
        {
            question: "Which CSS property is used to change the text color of an element?",
            options: [
                "color",
                "text-color",
                "font-color",
                "text-style"
            ],
            answer: 0,
            explanation: "The 'color' property is used to set the color of the text."
        },
        {
            question: "How do you select an element with the id 'header' in CSS?",
            options: [
                "#header",
                ".header",
                "*header",
                "header"
            ],
            answer: 0,
            explanation: "The '#' selector is used to select elements by their id attribute."
        },
        {
            question: "Which CSS property controls the text size?",
            options: [
                "font-size",
                "text-size",
                "font-style",
                "text-font"
            ],
            answer: 0,
            explanation: "The 'font-size' property sets the size of the font."
        },
        {
            question: "How do you make each word in a text start with a capital letter?",
            options: [
                "text-transform: capitalize",
                "text-transform: uppercase",
                "text-style: capital",
                "font-variant: small-caps"
            ],
            answer: 0,
            explanation: "The 'text-transform: capitalize' property capitalizes the first letter of each word."
        },
        {
            question: "Which CSS property is used to change the font of an element?",
            options: [
                "font-family",
                "font-style",
                "font-weight",
                "text-font"
            ],
            answer: 0,
            explanation: "The 'font-family' property specifies the font for an element."
        },
        {
            question: "How do you select all paragraph elements inside a div element?",
            options: [
                "div p",
                "div.p",
                "div + p",
                "div > p"
            ],
            answer: 0,
            explanation: "The 'div p' selector selects all <p> elements inside <div> elements."
        },
        {
            question: "Which CSS property is used to change the background color?",
            options: [
                "background-color",
                "bgcolor",
                "color-background",
                "background"
            ],
            answer: 0,
            explanation: "The 'background-color' property sets the background color of an element."
        },
        {
            question: "How do you add a background image in CSS?",
            options: [
                "background-image: url('image.jpg')",
                "background: image('image.jpg')",
                "image: background('image.jpg')",
                "bg-image: url('image.jpg')"
            ],
            answer: 0,
            explanation: "The 'background-image' property sets one or more background images for an element."
        },
        {
            question: "Which property is used to change the left margin of an element?",
            options: [
                "margin-left",
                "padding-left",
                "indent",
                "left-margin"
            ],
            answer: 0,
            explanation: "The 'margin-left' property sets the left margin of an element."
        },
        {
            question: "How do you make a list display its items horizontally?",
            options: [
                "display: flex",
                "display: inline",
                "display: horizontal",
                "list-style: horizontal"
            ],
            answer: 0,
            explanation: "Flexbox (display: flex) is commonly used to create horizontal layouts."
        },
        {
            question: "Which property is used to create space between the element's border and inner content?",
            options: [
                "padding",
                "margin",
                "spacing",
                "border-space"
            ],
            answer: 0,
            explanation: "Padding creates space inside an element, between the border and the content."
        },
        {
            question: "How do you apply CSS styles only when the screen is less than 600px wide?",
            options: [
                "@media (max-width: 600px) {...}",
                "@screen (width < 600px) {...}",
                "@viewport (max: 600px) {...}",
                "@responsive (max-width: 600px) {...}"
            ],
            answer: 0,
            explanation: "Media queries with @media rule are used for responsive design."
        },
        {
            question: "Which value of the 'position' property makes an element stay in the same place even when the page is scrolled?",
            options: [
                "fixed",
                "absolute",
                "relative",
                "static"
            ],
            answer: 0,
            explanation: "position: fixed positions an element relative to the viewport."
        },
        {
            question: "How do you make a flexbox container arrange its items in a column?",
            options: [
                "flex-direction: column",
                "flex-flow: column",
                "flex-align: column",
                "flex-orientation: vertical"
            ],
            answer: 0,
            explanation: "flex-direction: column arranges flex items vertically."
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