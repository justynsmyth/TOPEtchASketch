const DEFAULT_SIZE = 16;
const DEFAULT_MODE = "color";
const DEFAULT_COLOR = "rgb(85, 106, 241)";

let currentMode = DEFAULT_MODE;
let currentColor = DEFAULT_COLOR;

// settings for slider

const grid = document.querySelector(".grid");
let slider = document.getElementById("slider");
const sliderContainer = document.getElementById("slidecontainer");
const output = document.querySelector(".textInfo");
// initial value of sliderText
output.textContent = `${slider.value} x ${slider.value}`;

slider.oninput = () => {
  output.textContent = `${slider.value} x ${slider.value}`;
  emptyGrid();
  alterGrid(slider.value);
};

function emptyGrid() {
  // this is the same way as making a while loop and emptying manually
  grid.innerHTML = "";
}

// REQUIRES: numbers between 1 thru 64
function alterGrid(num) {
  // utilizes CSS grid
  grid.style.gridTemplateColumns = `repeat(${num}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${num}. 1fr)`;
  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      const box = document.createElement("div");
      box.classList.add("box");
      box.addEventListener("click", handleClick);
      box.addEventListener("mouseenter", changeColor);
      grid.appendChild(box);
    }
  }
}

let hoveredOption = false;

function handleClick() {
  if (!hoveredOption) {
    if (currentMode === "color") {
      this.style.backgroundColor = currentColor;
    } else if (currentMode === "eraser") {
      this.style.backgroundColor = "rgb(255,255,255)";
    } else if (currentMode === "random") {
      this.style.backgroundColor = randomColors();
    } else if (currentMode === "darken") {
      if (!this.style.backgroundColor) {
        this.style.backgroundColor = "rgb(255, 255, 255)";
        this.style.backgroundColor = darken(this.style.backgroundColor);
      } else {
        this.style.backgroundColor = darken(this.style.backgroundColor);
      }
    }
    hoveredOption = true;
  } else {
    hoveredOption = false;
  }
}

function changeColor() {
  if (hoveredOption && !this.classList.contains("hovered")) {
    if (currentMode === "color") {
      this.style.backgroundColor = currentColor;
    } else if (currentMode === "eraser") {
      this.style.backgroundColor = "rgb(255, 255, 255)";
    } else if (currentMode === "random") {
        console.log(randomColors)
        this.style.backgroundColor = randomColors();
    } else if (currentMode === "darken") {
      if (!this.style.backgroundColor) {
        this.style.backgroundColor = "rgb(255,255,255)";
        this.style.backgroundColor = darken(this.style.backgroundColor);
      } else {
        this.style.backgroundColor = darken(this.style.backgroundColor);
      }
    }
  }
}

const resetButton = document.querySelector(".reset");
resetButton.addEventListener("click", () => {
  emptyGrid();
  alterGrid(slider.value);
  hoveredOption = false;
});

function checkModes() {
  const modePicker = document.querySelectorAll(".modePicker button");
  for (const button of modePicker) {
    if (button.classList.contains("blacked")) {
      return button.innerText;
    }
  }
}

// Darken BUTTON FUNCTION
function darken(e) {
  const colorRegex = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/; // Regex to match the RGB color string

  // Extract the RGB color values from the background color string
  const [, red, green, blue] = colorRegex.exec(e);

  const darkeningFactor = 0.7; // Reduce the intensity by 10%

  const newRed = Math.floor(red * darkeningFactor);
  const newGreen = Math.floor(green * darkeningFactor);
  const newBlue = Math.floor(blue * darkeningFactor);

  const newColor = `rgb(${newRed}, ${newGreen}, ${newBlue})`;
  return newColor;
}

// change current color of document
const color = document.getElementById("colorPicker");
color.oninput = (e) => {
  currentColor = e.target.value;
  hoveredOption = false;
};

// when eraser is pressed, we want to toggle ERASER MODE
// Darken Button when pressed to indicate mode
// while in erase mode, color becomes white
const eraser = document.querySelector(".eraser");
eraser.addEventListener("click", () => {
  eraser.classList.toggle("blacked");
  if (eraser.classList.contains("blacked")) {
    currentMode = "eraser";
    hoveredOption = false;
  } else {
    hoveredOption = false;
    currentMode = checkModes();
  }
});

// CHOOSE MODE: Rainbow, darken, color
// color will be darked by default
const modePicker = document.querySelectorAll(".modePicker button");
console.log(modePicker);

modePicker.forEach((button) => {
  button.addEventListener("click", disableButton);
});

function disableButton(e) {
  modePicker.forEach((button) => button.classList.remove("blacked"));
  e.target.classList.add("blacked");
  if (currentMode === "eraser") {
    return;
  }
  hoveredOption = false;
  currentMode = e.target.innerText;
}

function randomColors() {
  let red = Math.floor(Math.random() * 150);
  let green = Math.floor(Math.random() * 220);
  let blue = Math.floor(Math.random() * 135) + 120;
  let alpha = 0.5 * Math.random() + 0.5;
  const newColor = `rgb(${red}, ${green}, ${blue})`;
  return newColor;
}

// MODIFY SLIDER BY USER
const sliderButtons = document.querySelectorAll(".options");
sliderButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.textContent == "Minimum") {
      emptyGrid();
      alterGrid(1);
      output.textContent = `1 x 1`;
      slider.value = slider.min;
      resetWarning();
    }
  });
  button.addEventListener("click", () => {
    if (button.textContent == "Maximum") {
      emptyGrid();
      alterGrid(64);
      output.textContent = `64 x 64`;
      slider.value = slider.max;
      resetWarning();
    }
  });
});

function checkContent(text) {
  return !isNaN(+text);
}

function outputWarning() {
  const paragraph = document.querySelector(".warning");
  if (paragraph) {
    return;
  }
  const warning = document.createElement("p");
  warning.classList.add("warning");
  sliderContainer.appendChild(warning);
  warning.textContent = "Boundaries are limited to 1 through 64!";
}

function resetWarning() {
  const warning = document.querySelector(".warning");
  if (!warning) {
    return;
  }
  warning.remove();
}
// Modify slider by text
const inputText = document.getElementById("input");
inputText.addEventListener("input", () => {
  console.log(inputText.value);
  if (checkContent(inputText.value)) {
    if (inputText.value > 64) {
      outputWarning();
      inputText.value = 64;
    } else if (inputText.value === null) {
      const paragraph = document.querySelector(".warning");
      if (paragraph) {
        resetWarning();
      }
    } else if (inputText.value < 1) {
      outputWarning();
    } else {
      const paragraph = document.querySelector(".warning");
      if (paragraph) {
        resetWarning();
      }
    }
    emptyGrid();
    alterGrid(inputText.value);
    output.textContent = `${inputText.value} x ${inputText.value}`;
    slider.value = inputText.value;
  } else {
  }
});

window.onload = () => {
  alterGrid(DEFAULT_SIZE);
  // default color to grey
  const choice = document.querySelector(".color");
  choice.classList.add("blacked");
};
