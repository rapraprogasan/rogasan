document.addEventListener('DOMContentLoaded', () => {
    const quizQuestions = [
        {
            question: "What will be the output of: console.log(typeof null);",
            options: [
                "'object'",
                "'null'",
                "'undefined'",
                "'string'"
            ],
            answer: 0,
            explanation: "This is a known quirk in JavaScript. The typeof null returns 'object' due to a bug in the original implementation that was never fixed for backward compatibility."
        },
        {
            question: "What does the following code return: console.log([] == ![]);",
            options: [
                "true",
                "false",
                "undefined",
                "Throws an error"
            ],
            answer: 0,
            explanation: "This is due to JavaScript's type coercion. The ![] converts to false, then [] == false evaluates to true because both sides are coerced to 0 during comparison."
        },
        {
            question: "What is the output of: (function() { return typeof arguments; })();",
            options: [
                "'object'",
                "'array'",
                "'arguments'",
                "'undefined'"
            ],
            answer: 0,
            explanation: "The arguments object is an array-like object accessible inside functions that contains the values of the arguments passed to that function. Its type is 'object'."
        },
        {
            question: "What does 'this' refer to in an arrow function?",
            options: [
                "The lexical context where the arrow function was defined",
                "The object that called the function",
                "The global object",
                "It's always undefined"
            ],
            answer: 0,
            explanation: "Arrow functions don't have their own 'this' binding. Instead, they inherit 'this' from the parent scope at the time they're defined."
        },
        {
            question: "What is the output of: console.log(1 < 2 < 3); console.log(3 > 2 > 1);",
            options: [
                "true false",
                "true true",
                "false false",
                "false true"
            ],
            answer: 0,
            explanation: "The first evaluates as (1 < 2) = true, then true < 3 (true converts to 1) is true. The second evaluates as (3 > 2) = true, then true > 1 (true converts to 1) is false."
        },
        {
            question: "What is a closure in JavaScript?",
            options: [
                "A function that has access to its outer function's scope even after the outer function has returned",
                "A way to hide private variables",
                "A function that calls itself",
                "A method for handling asynchronous operations"
            ],
            answer: 0,
            explanation: "A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment)."
        },
        {
            question: "What will be logged: let a = {x: 1}; let b = a; a.x = 2; console.log(b.x);",
            options: [
                "2",
                "1",
                "undefined",
                "Throws an error"
            ],
            answer: 0,
            explanation: "Objects are assigned by reference in JavaScript. Both a and b point to the same object in memory, so changing a.x also affects b.x."
        },
        {
            question: "What is the output of: console.log('5' + 3); console.log('5' - 3);",
            options: [
                "'53' 2",
                "8 2",
                "'53' '53'",
                "8 '53'"
            ],
            answer: 0,
            explanation: "The + operator concatenates strings, converting 3 to '3'. The - operator converts both to numbers, resulting in 5 - 3 = 2."
        },
        {
            question: "What does the 'new' keyword do?",
            options: [
                "Creates a new object, sets the prototype, and binds 'this' to the new object",
                "Allocates memory for a new variable",
                "Creates a new instance of a class",
                "Initializes a new array"
            ],
            answer: 0,
            explanation: "The 'new' keyword does four things: 1) Creates a blank object, 2) Links this object to another object (sets the prototype), 3) Binds 'this' to the new object, 4) Returns 'this' if the function doesn't return an object."
        },
        {
            question: "What is the output of: console.log(0.1 + 0.2 === 0.3);",
            options: [
                "false",
                "true",
                "undefined",
                "NaN"
            ],
            answer: 0,
            explanation: "Due to floating point precision issues in JavaScript, 0.1 + 0.2 equals 0.30000000000000004, not 0.3."
        },
        {
            question: "What is hoisting in JavaScript?",
            options: [
                "The process of moving declarations to the top of their scope before code execution",
                "A way to load scripts asynchronously",
                "A method for optimizing code performance",
                "The process of converting ES6+ code to ES5"
            ],
            answer: 0,
            explanation: "Hoisting is JavaScript's default behavior of moving declarations (variable and function) to the top of their containing scope during compilation phase."
        },
        {
            question: "What is the output of: console.log([] + []);",
            options: [
                "'' (empty string)",
                "[]",
                "0",
                "NaN"
            ],
            answer: 0,
            explanation: "When arrays are converted to strings, they become empty strings, and adding two empty strings results in an empty string."
        },
        {
            question: "What is the purpose of the 'use strict' directive?",
            options: [
                "Enables stricter parsing and error handling in JavaScript",
                "Forces all variables to be declared with types",
                "Makes JavaScript behave like a strongly typed language",
                "Optimizes the performance of the code"
            ],
            answer: 0,
            explanation: "'use strict' makes several changes to normal JavaScript semantics: eliminates silent errors, prevents certain syntax, makes it easier to write secure JavaScript."
        },
        {
            question: "What is the output of: console.log(typeof NaN);",
            options: [
                "'number'",
                "'NaN'",
                "'undefined'",
                "'string'"
            ],
            answer: 0,
            explanation: "NaN stands for 'Not a Number' but is actually of type 'number'. This is because it results from numeric operations that can't produce a meaningful result."
        },
        {
            question: "What does the 'bind' method do?",
            options: [
                "Creates a new function with a specified 'this' value and initial arguments",
                "Connects two functions together",
                "Binds an event listener to an element",
                "Creates a deep copy of an object"
            ],
            answer: 0,
            explanation: "The bind() method creates a new function that, when called, has its 'this' keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function is called."
        },
        {
            question: "What is the output of: console.log(!!''); console.log(!!'0');",
            options: [
                "false true",
                "false false",
                "true true",
                "true false"
            ],
            answer: 0,
            explanation: "The double negation (!!) converts a value to a boolean. Empty string is falsy, while any non-empty string (including '0') is truthy."
        },
        {
            question: "What is the difference between == and === in JavaScript?",
            options: [
                "== performs type coercion, === doesn't",
                "=== performs type coercion, == doesn't",
                "== compares values, === compares references",
                "There is no difference"
            ],
            answer: 0,
            explanation: "The == operator compares values after performing type conversion if needed. The === operator (strict equality) checks both value and type without conversion."
        },
        {
            question: "What is the output of: console.log([1, 2, 3].map(parseInt));",
            options: [
                "[1, NaN, NaN]",
                "[1, 2, 3]",
                "['1', '2', '3']",
                "Throws an error"
            ],
            answer: 0,
            explanation: "parseInt takes two arguments (string, radix). map passes three (element, index, array). When index is passed as radix, it causes NaN for indices 1 and 2."
        },
        {
            question: "What is a promise in JavaScript?",
            options: [
                "An object representing the eventual completion or failure of an asynchronous operation",
                "A function that returns a value in the future",
                "A guarantee that a variable won't change",
                "A way to declare constants"
            ],
            answer: 0,
            explanation: "A Promise is an object representing the eventual completion or failure of an async operation. It's a returned object to which you attach callbacks."
        },
        {
            question: "What is the output of: console.log('b' + 'a' + + 'a' + 'a');",
            options: [
                "'baNaNa'",
                "'baaa'",
                "'baundefineda'",
                "Throws an error"
            ],
            answer: 0,
            explanation: "This evaluates as 'b' + 'a' + (+'a') + 'a'. +'a' results in NaN (Not a Number), so the concatenation becomes 'ba' + NaN + 'a', which is 'baNaNa'."
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