document.addEventListener('DOMContentLoaded', function() {
    // Quiz questions array
    const quizQuestions = [
        {
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            answer: "Paris"
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            answer: "Mars"
        },
        {
            question: "Who painted the Mona Lisa?",
            options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
            answer: "Leonardo da Vinci"
        },
        {
            question: "What is the largest ocean on Earth?",
            options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
            answer: "Pacific Ocean"
        },
        {
            question: "Which element has the chemical symbol 'O'?",
            options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
            answer: "Oxygen"
        },
        {
            question: "In which year did World War II end?",
            options: ["1943", "1945", "1947", "1950"],
            answer: "1945"
        },
        {
            question: "What is the tallest mountain in the world?",
            options: ["K2", "Mount Kilimanjaro", "Mount Everest", "Mount Denali"],
            answer: "Mount Everest"
        },
        {
            question: "Which country is home to the kangaroo?",
            options: ["South Africa", "Brazil", "Australia", "New Zealand"],
            answer: "Australia"
        },
        {
            question: "What is the largest mammal in the world?",
            options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
            answer: "Blue Whale"
        },
        {
            question: "Which language has the most native speakers?",
            options: ["English", "Hindi", "Spanish", "Mandarin Chinese"],
            answer: "Mandarin Chinese"
        },
        {
            question: "What is the currency of Japan?",
            options: ["Won", "Yen", "Yuan", "Ringgit"],
            answer: "Yen"
        },
        {
            question: "Who wrote 'Romeo and Juliet'?",
            options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
            answer: "William Shakespeare"
        },
        {
            question: "Which country is the largest by land area?",
            options: ["China", "United States", "Canada", "Russia"],
            answer: "Russia"
        },
        {
            question: "What is the hardest natural substance on Earth?",
            options: ["Gold", "Iron", "Diamond", "Quartz"],
            answer: "Diamond"
        },
        {
            question: "Which gas is most abundant in Earth's atmosphere?",
            options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
            answer: "Nitrogen"
        },
        {
            question: "How many continents are there on Earth?",
            options: ["5", "6", "7", "8"],
            answer: "7"
        },
        {
            question: "What is the largest desert in the world?",
            options: ["Sahara Desert", "Arabian Desert", "Gobi Desert", "Antarctica"],
            answer: "Antarctica"
        },
        {
            question: "Which animal is known as the 'King of the Jungle'?",
            options: ["Tiger", "Elephant", "Lion", "Gorilla"],
            answer: "Lion"
        },
        {
            question: "What is the smallest country in the world?",
            options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
            answer: "Vatican City"
        },
        {
            question: "Which planet is closest to the Sun?",
            options: ["Venus", "Mercury", "Earth", "Mars"],
            answer: "Mercury"
        }
    ];

    // DOM elements
    const quizArea = document.getElementById('quiz-area');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const timerDisplay = document.getElementById('timer');
    const resultsModal = document.getElementById('results-modal');
    const resultsContent = document.getElementById('results');
    const closeBtn = document.getElementById('close-btn');
    const restartBtn = document.getElementById('restart-btn');
    const alertSound = document.getElementById('alert-sound');
    const timesUpSound = document.getElementById('times-up-sound');

    // Quiz state variables
    let currentQuestionIndex = 0;
    let userAnswers = Array(quizQuestions.length).fill(null);
    let timer;
    let timeLeft = 30; // 1.5 minutes per question (90 seconds)
    let alertShown = false;

    // Initialize the quiz
    function initQuiz() {
        displayQuestion();
        startTimer();
        updateProgress();
        updateNavButtons();
    }

    // Display current question
    function displayQuestion() {
        const question = quizQuestions[currentQuestionIndex];
        let optionsHTML = '';

        question.options.forEach((option, index) => {
            const isChecked = userAnswers[currentQuestionIndex] === option ? 'checked' : '';
            optionsHTML += `
                <li class="option ${isChecked ? 'selected' : ''}">
                    <input type="radio" id="option${index}" name="options" value="${option}" ${isChecked}>
                    <label for="option${index}">${option}</label>
                </li>
            `;
        });

        quizArea.innerHTML = `
            <div class="question">${question.question}</div>
            <ul class="options">${optionsHTML}</ul>
        `;

        // Add event listeners to options
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', function() {
                const radioInput = this.querySelector('input[type="radio"]');
                radioInput.checked = true;
                document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                userAnswers[currentQuestionIndex] = radioInput.value;
            });
        });
    }

    // Update navigation buttons
    function updateNavButtons() {
        prevBtn.disabled = currentQuestionIndex === 0;
        
        if (currentQuestionIndex === quizQuestions.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }

    // Update progress bar and text
    function updateProgress() {
        const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 30;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
    }

    // Timer functions
    function startTimer() {
        // Reset timer for new question
        timeLeft = 30;
        alertShown = false;
        updateTimerDisplay();
        
        // Clear any existing timer
        if (timer) {
            clearInterval(timer);
        }
        
        // Start new timer
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            // Play alert sound when 5 seconds remain
            if (timeLeft <= 5 && !alertShown) {
                alertSound.play();
                alertShown = true;
            }
            
            // Auto-skip when time runs out
            if (timeLeft <= 0) {
                timesUpSound.play();
                clearInterval(timer);
                autoSkipQuestion();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent =` ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Change color when time is running low
        if (timeLeft <= 10) {
            timerDisplay.style.color = '#ff6b6b';
        } else {
            timerDisplay.style.color = 'inherit';
        }
    }

    function autoSkipQuestion() {
        // Mark as unanswered if not answered
        if (userAnswers[currentQuestionIndex] === null) {
            userAnswers[currentQuestionIndex] = 'unanswered';
        }
        
        // Move to next question or submit if last question
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
            startTimer();
            updateProgress();
            updateNavButtons();
        } else {
            submitQuiz();
        }
    }

    // Navigation functions
    function goToNextQuestion() {
        // Save answer if selected
        const selectedOption = document.querySelector('input[name="options"]:checked');
        if (selectedOption) {
            userAnswers[currentQuestionIndex] = selectedOption.value;
        } else {
            userAnswers[currentQuestionIndex] = 'unanswered';
        }
        
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
            startTimer();
            updateProgress();
            updateNavButtons();
        }
    }

    function goToPrevQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion();
            startTimer();
            updateProgress();
            updateNavButtons();
        }
    }

    // Submit and show results
    function submitQuiz() {
        clearInterval(timer);
        
        // Calculate score
        let score = 0;
        quizQuestions.forEach((question, index) => {
            if (userAnswers[index] === question.answer) {
                score++;
            }
        });
        
        // Display results
        const percentage = Math.round((score / quizQuestions.length) * 100);
        let message = '';
        
        if (percentage >= 80) {
            message = 'Excellent! You have a great knowledge of general facts.';
        } else if (percentage >= 60) {
            message = 'Good job! You know quite a bit about the world.';
        } else if (percentage >= 40) {
            message = 'Not bad! Keep learning to improve your knowledge.';
        } else {
            message = 'Keep studying! You can do better next time.';
        }
        
        resultsContent.innerHTML = `
            <h3>Your Score: ${score} out of ${quizQuestions.length}</h3>
            <p>That's ${percentage}% correct answers.</p>
            <p>${message}</p>
            <h3>Question Review:</h3>
            <ul>
                ${quizQuestions.map((question, index) => `
                    <li>
                        <strong>Q${index + 1}: ${question.question}</strong><br>
                        Your answer: ${userAnswers[index] === 'unanswered' ? 'Unanswered' : userAnswers[index]}<br>
                        Correct answer: ${question.answer}<br>
                        ${userAnswers[index] === question.answer ? '✅ Correct' : '❌ Incorrect'}
                    </li>
                `).join('')}
            </ul>
        `;
        
        resultsModal.style.display = 'block';
    }

    // Restart quiz
    function restartQuiz() {
        currentQuestionIndex = 0;
        userAnswers = Array(quizQuestions.length).fill(null);
        resultsModal.style.display = 'none';
        initQuiz();
    }

    // Event listeners
    nextBtn.addEventListener('click', goToNextQuestion);
    prevBtn.addEventListener('click', goToPrevQuestion);
    submitBtn.addEventListener('click', submitQuiz);
    closeBtn.addEventListener('click', () => resultsModal.style.display = 'none');
    restartBtn.addEventListener('click', restartQuiz);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === resultsModal) {
            resultsModal.style.display = 'none';
        }
    });

    // Initialize the quiz
    initQuiz();
});