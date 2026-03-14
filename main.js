const lottoNumbersContainer = document.getElementById('lotto-numbers');
const generateBtn = document.getElementById('generate-btn');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Theme Logic
const savedTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', savedTheme);
updateToggleText(savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateToggleText(newTheme);
});

function updateToggleText(theme) {
  themeToggle.textContent = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
}

// Lotto Logic
function generateLottoNumbers() {
  const numbers = new Set();
  while (numbers.size < 6) {
    const randomNumber = Math.floor(Math.random() * 45) + 1;
    numbers.add(randomNumber);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

function displayNumbers(numbers) {
  lottoNumbersContainer.innerHTML = '';
  numbers.forEach(number => {
    const numberElement = document.createElement('div');
    numberElement.classList.add('lotto-number');
    numberElement.textContent = number;
    lottoNumbersContainer.appendChild(numberElement);
  });
}

generateBtn.addEventListener('click', () => {
  const numbers = generateLottoNumbers();
  displayNumbers(numbers);
});
