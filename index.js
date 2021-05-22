const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const highscores = JSON.parse(localStorage.getItem('highscore')) || [];
const scoreList = document.querySelector('.scoretable');
let lastHole;
let timeUp = false;
let score = 0;

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    const index = Math.floor(Math.random() * holes.length);
    const hole = holes[index];
    if (hole === lastHole) {
        return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

function peep() {
    const time = randomTime(200, 1000);
    const hole = randomHole(holes);
    hole.classList.add('up');
    setTimeout(() => {
        hole.classList.remove('up');
        if (!timeUp) {
            peep();
        } else {
            checkScore();
        }
    }, time);
}

function startGame() {
    score = 0;
    scoreBoard.textContent = 0;
    timeUp = false;
    peep();
    setTimeout(() => timeUp = true, 10000);
}

function bonk(e) {
    if (!e.isTrusted) return; // cheater!
    score++;
    this.classList.remove('up');
    scoreBoard.textContent = score;
}

function populateTable() {
    scoreList.innerHTML = highscores.map((row) => {
        return `<tr><td>${row.clicker}</td><td>${row.score}</tr>`;
    }).join('');
}

function checkScore() {
    let worstScore = 0;
    if (highscores.length > 4) {
        worstScore = highscores[highscores.length - 1].score;
    }

    if (score > worstScore) {
        const clicker = window.prompt(`${score} – Top score! What's your name?`);
        highscores.push({ score, clicker });
    }

    highscores.sort((a, b) => a.score > b.score ? -1 : 1);

    // Remove the worst score when table too long
    if (highscores.length > 5) {
        highscores.pop();
    }

    populateTable();
    localStorage.setItem('highscores', JSON.stringify(highscores));
}

function clearScores() {
    highscores.splice(0, highscores.length);
    localStorage.setItem('highscores', JSON.stringify(highscores));
    populateTable(highscores, scoreList);
}

moles.forEach(mole => mole.addEventListener('click', bonk));

populateTable();