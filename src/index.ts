let order: number[] = [];
let clickedOrder: number[] = [];
let score: number = 0;
let bestScore = 0;
let level = 0;

// 0 - green
// 1 - red
// 2 - yellow
// 3 - blue

const green = document.querySelector(".btn-green") as HTMLDivElement;
const red = document.querySelector(".btn-red") as HTMLDivElement;
const yellow = document.querySelector(".btn-yellow") as HTMLDivElement;
const blue = document.querySelector(".btn-blue") as HTMLDivElement;

const playButton = document.querySelector("#play") as HTMLButtonElement;
const theBestScore = document.getElementById("best-score");
const currentScore = document.getElementById("current-score");

const currentLevel = document.querySelector("#level") as HTMLDivElement;
const currentLevelValue = document.getElementById("current-level");

let shuffleOrder = async () => {
  let colorOrder = Math.floor(Math.random() * 4);

  order[order.length] = colorOrder;

  for (const i in order) {
    let elementColor = createColorElement(order[i]);
    await lightColor(elementColor, Number(i) + 1);
  }
};

const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

async function lightColor(element: HTMLDivElement, number: number) {
  setTimeout(() => {
    element.classList.add("selected");
  }, 500);
  setTimeout(() => {
    element.classList.remove("selected");
  }, 1000);
  await sleep(1000);
}

async function checkOrder() {
  for (const i in clickedOrder) {
    if (order[i] !== clickedOrder[i]) {
      gameOver();
      break;
    }
  }

  if (clickedOrder.length === order.length) {
    alert(`Pontuação: ${score}\nIniciando próximo nível`);
    await nextLevel();
  }
}

async function clickOrder(colorIndex: number) {
  clickedOrder[clickedOrder.length] = colorIndex;
  createColorElement(colorIndex).classList.add("selected");

  setTimeout(() => {
    createColorElement(colorIndex).classList.remove("selected");
  }, 500);
  await sleep(500);
  checkOrder();
}

function createColorElement(colorIndex: number): HTMLDivElement {
  const mappedColor = {
    0: green,
    1: red,
    2: yellow,
    3: blue,
  };

  const color = mappedColor[colorIndex];

  if (!color) {
    throw new Error("Element color not found");
  }

  return color;
}

async function nextLevel() {
  await sleep(1000);
  level++;
  currentLevelValue.innerHTML = level.toString();
  addScore();
  clickedOrder = [];
  shuffleOrder();
}

function gameOver() {
  alert(
    `YOU LOSE!\nPontuação: ${score}\n Click em "OK" para iniciar um novo jogo.`
  );
  order = [];
  clickedOrder = [];
  if (score > bestScore) {
    bestScore = score;
    theBestScore.innerHTML = score.toString();
  }
  score = 0;
  level = 1;

  currentLevel.classList.add("not-visible");
  playButton.classList.remove("not-visible");
}

function addScore() {
  score++;
  currentScore.innerHTML = score.toString();
}

async function playGame() {
  playButton.classList.add("not-visible");
  currentLevel.classList.remove("not-visible");

  alert("Welcome, to Genesis Game!\n Iniciando nova partida.");
  score = -1;
  level = 0;
  currentScore.innerHTML = score.toString();
  theBestScore.innerHTML = bestScore.toString();
  await nextLevel();
}

green.onclick = () => clickOrder(0);
red.onclick = () => clickOrder(1);
yellow.onclick = () => clickOrder(2);
blue.onclick = () => clickOrder(3);

playButton.onclick = async () => await playGame();
