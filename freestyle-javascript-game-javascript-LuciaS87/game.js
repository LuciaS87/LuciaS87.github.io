let listOfSongs;
const amountOfSongs = 7;
let randomSongs = [];
let keyInterval;
listOfSongs = JSON.parse(localStorage.getItem('tracks'));

const playButton = document.querySelector('.play');
const timerDisplay = document.querySelector('.timer');
const scoreResult = document.querySelector('.score-result');
timerDisplay.textContent = 60;
scoreResult.textContent = 0;


let guessButton;
let answerButtons;

initGame();
function initGame() {

    //RAND MUSIC
    for (let i = 0; i < amountOfSongs; i++) {
        const randomIndex = Math.floor(Math.random() * listOfSongs.length);
        randomSongs.push(listOfSongs[randomIndex]);
        listOfSongs = listOfSongs.filter((song, index) => index != randomIndex);
    }
    //ADD EVENT LISTENERS
    playButton.addEventListener("click", () => playSong());

    //FUNCTIONS
    function playSong() {
        
        roundReset();
        guessButton = document.querySelector('.dot');
        answerButtons = document.querySelectorAll('.answer');
        let activeSong = randomSongs.shift();
        const audio = new Audio(`${activeSong.url}`);
        audio.play();
        timer(audio);
        playButton.disabled = true;
        loadAnswers(activeSong.name);
        guessButton.addEventListener('click', () => stopSong(audio, activeSong.name));
    }
    function stopSong(audio, activeSongName) {
        audio.pause();
        clearInterval(keyInterval);
        guessButton.disabled = true;
        enableAnswerButtons();
        answerButtons.forEach((answer) => {
            answer.classList.add('answer-show');
            answer.addEventListener('click', function () {
                checkCorrectAnswer.bind(this)(activeSongName);
            })
        });
    }
    function loadAnswers(correctAnswer) {
        const answers = randAnswers(correctAnswer);
        answerButtons.forEach((answer, index) => {
            answer.textContent = answers[index];
        });
        console.log(correctAnswer);
    }
    function randAnswers(correctAnswer) {
        let randomAnswers = [];
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * listOfSongs.length);
            randomAnswers.push(listOfSongs[randomIndex].name);
            listOfSongs = listOfSongs.filter((song, index) => index != randomIndex);
        }
        randomAnswers.push(correctAnswer);
        randomAnswers.sort(() => Math.random() - 0.5);
        return randomAnswers;

    }
    function timer(audio) 
    {
        keyInterval = setInterval(() => {
            if(!Number(timerDisplay.textContent))
        {   clearInterval(keyInterval);
            playButton.disabled = true;
            guessButton.disabled = true;
            disableAnswerButtons();
            audio.pause();
            timerDisplay.textContent = '0';
            alert("Sorry ! Time runs out");
            return;
        }
        else
        {
            timerDisplay.textContent = `${(parseInt(timerDisplay.textContent)-1)}`;
        }
            
        }, 1000);
    }
    function checkCorrectAnswer(correctAnswer) {
        if (this.textContent == correctAnswer) {
            this.classList.add('answer-correct');
            score();
        } else {
            this.classList.add('answer-incorrect');
            showCorrectAnswer(correctAnswer);
        };
        disableAnswerButtons();
        playButton.disabled = false;
        if (!randomSongs.length) {
            alert("end");
            return;
        }
    }
    function showCorrectAnswer(correctAnswer) {
        answerButtons.forEach(answer => { answer.textContent == correctAnswer ? answer.classList.add('answer-correct') : null })
    }
    function disableAnswerButtons() {
        answerButtons.forEach(answer => {
            answer.disabled = true;
        });
    }
    function enableAnswerButtons() {
        answerButtons.forEach(answer => {
            answer.disabled = false;
        });
    }
    function roundReset() {
        if(typeof(guessButton)!="undefined")
        {
            guessButton.disabled = false;
            removeListeners(guessButton);
            answerButtons.forEach(answer => {
                answer.classList.remove('answer-correct');
                answer.classList.remove('answer-incorrect');
                answer.classList.remove('answer-show');
                removeListeners(answer);
            });
        }
      
    }
    function score()
    {
        scoreResult.textContent = `${(parseInt(scoreResult.textContent)+1)}`;
    }
    function removeListeners(selector) {
        selectorClone = selector.cloneNode(true);
        selector.parentNode.replaceChild(selectorClone, selector);
    }

}


