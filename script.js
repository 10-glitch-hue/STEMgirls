console.log('script.js loaded');

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.querySelector('.start-btn');
    const popupInfo = document.querySelector('.popup-info');
    const exitBtn = document.querySelector('.exit-btn');
    const main = document.querySelector('main'); 
    const continueBtn = document.querySelector('.continue-btn');
    const quizSection = document.querySelector('.quiz-section');

    startBtn && (startBtn.onclick = () => {
        popupInfo && popupInfo.classList.add('active');
        main && main.classList.add('active');
    });

    exitBtn && (exitBtn.onclick = () => {
        popupInfo && popupInfo.classList.remove('active');
        main && main.classList.remove('active');
    });

    let questionCount = 0; // zero-based index
    let score = 0;
    const MAX_SCORE = 5; // display score out of 5
    const headerScore = document.querySelector('.header-score');
    if (headerScore) headerScore.textContent = `Score: ${score}/${MAX_SCORE}`;

    const nextBtn = document.querySelector('.next-btn');
    const optionList = document.querySelector('.option-list');

    if (nextBtn) {
        // start disabled until an option is selected
        nextBtn.disabled = true;
        nextBtn.onclick = () => {
            console.log('Next clicked (before increment), questionCount =', questionCount);
            // don't advance unless an answer was selected (optionList.dataset.locked is set after selection)
            if (optionList && optionList.dataset.locked !== 'true') {
                // you can provide user feedback here instead of silently ignoring
                console.log('Please select an answer before proceeding');
                return;
            }
            // if not the last question, advance
            if (typeof questions !== 'undefined' && questionCount < questions.length - 1) {
                questionCount++;
                console.log('Next clicked (after increment), new questionCount =', questionCount);
                showQuestions(questionCount);
            } else {
                // last question -> show results
                console.log('Finish clicked - showing results, questionCount =', questionCount);
                showResults();
            }
        };
    }

    function showQuestions(index){
        console.log('showQuestions called with index =', index);
        if (typeof questions === 'undefined' || !questions[index]) {
            console.log('showQuestions: questions undefined or questions[index] missing', typeof questions, questions && questions[index]);
            return;
        }

        const questionText = document.querySelector('.question-text');
        if (questionText) questionText.textContent = `${index + 1}. ${questions[index].question}`;

        const opts = questions[index].options || [];
        let optionTag = '';
        for (let i = 0; i < opts.length; i++) {
            optionTag += `<div class="option"><span>${opts[i]}</span></div>`;
        }

        if (optionList) {
            optionList.innerHTML = optionTag;

            // attach click handlers to options
            const optionElems = optionList.querySelectorAll('.option');
            optionElems.forEach(opt => {
                // reset any state
                opt.classList.remove('correct', 'incorrect', 'disabled');
                opt.onclick = () => {
                    // prevent multiple selections
                    if (optionList.dataset.locked === 'true') return;
                    optionSelected(opt, optionElems, questions[index].answer);
                    optionList.dataset.locked = 'true';
                    // enable Next now that an answer was selected
                    if (nextBtn) nextBtn.disabled = false;
                };
            });
            // clear lock for new question
            delete optionList.dataset.locked;
            // disable Next until user selects and set label for last question
            if (nextBtn) {
                nextBtn.disabled = true;
                if (typeof questions !== 'undefined' && index >= questions.length - 1) {
                    nextBtn.textContent = 'Finish';
                } else {
                    nextBtn.textContent = 'Next';
                }
            }
        }

        const qTotal = document.querySelector('.question-total');
        if (qTotal) qTotal.textContent = `${index + 1} of ${questions.length} questions`;
    }

    function optionSelected(answer, optionElems, correctAnswer){
        const userAnswer = answer.textContent && answer.textContent.trim();
        // mark selected answer
        if (userAnswer === correctAnswer) {
            answer.classList.add('correct');
            // increment score (clamp to MAX_SCORE)
            score = Math.min(MAX_SCORE, score + 1);
            if (headerScore) headerScore.textContent = `Score: ${score}/${MAX_SCORE}`;
        } else {
            answer.classList.add('incorrect');
            // highlight the correct one as well
            const correctElem = Array.from(optionElems).find(el => el.textContent && el.textContent.trim() === correctAnswer);
            if (correctElem) correctElem.classList.add('correct');
        }

        // disable further clicks on options for this question
        optionElems.forEach(el => {
            el.classList.add('disabled');
            el.onclick = null;
        });
    }
    
    function showResults(){
        // calculate percentage (based on MAX_SCORE)
        const percentage = Math.round((score / MAX_SCORE) * 100);

        const progressValue = document.querySelector('.progress-value');
        const circular = document.querySelector('.circular-progress');
        const scoreText = document.querySelector('.score-text');
        const resultBox = document.querySelector('.result-box');

        if (progressValue) progressValue.textContent = `${percentage}%`;
        if (scoreText) scoreText.textContent = `You scored ${score} out of ${MAX_SCORE}`;
        if (circular) {
            const deg = Math.round((percentage / 100) * 360);
            circular.style.background = `conic-gradient(#FF77CC ${deg}deg, white ${deg}deg)`;
        }

        // create backdrop if missing
        let backdrop = document.querySelector('.result-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'result-backdrop';
            document.body.appendChild(backdrop);
        }

        // show backdrop and result box (move resultBox to body so it's not blurred)
        backdrop.classList.add('show');
        if (resultBox) {
            // move the result box out of the main container so it remains sharp when main is blurred
            document.body.appendChild(resultBox);
            resultBox.classList.add('show');
        }

        // blur the main content
        if (main) main.classList.add('blurred');

        // disable Next so user can't click behind
        if (nextBtn) nextBtn.disabled = true;

        // wire up result buttons if present
        const tryAgain = document.querySelector('.tryAgain-btn');
        const goHome = document.querySelector('.goHome-btn');
        if (tryAgain) {
            tryAgain.onclick = () => {
                // hide overlay
                backdrop.classList.remove('show');
                if (resultBox) {
                    resultBox.classList.remove('show');
                    // move resultBox back into the quizSection for future use
                    const containerSection = document.querySelector('.quiz-section');
                    if (containerSection) containerSection.appendChild(resultBox);
                }
                if (main) main.classList.remove('blurred');
                // reset quiz
                score = 0;
                questionCount = 0;
                if (headerScore) headerScore.textContent = `Score: ${score}/${MAX_SCORE}`;
                if (nextBtn) nextBtn.disabled = true;
                showQuestions(questionCount);
            };
        }
        if (goHome) {
            goHome.onclick = () => {
                // hide overlay and navigate home (or you can change this to close overlay only)
                backdrop.classList.remove('show');
                if (resultBox) {
                    resultBox.classList.remove('show');
                    const containerSection = document.querySelector('.quiz-section');
                    if (containerSection) containerSection.appendChild(resultBox);
                }
                if (main) main.classList.remove('blurred');
                // navigate to home page
                window.location.href = 'Quiz.html';
            };
        }
    }
    // initialize first question if questions array exists
    if (typeof questions !== 'undefined' && questions.length) {
        showQuestions(questionCount);
    }
});
