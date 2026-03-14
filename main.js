const lottoNumbersContainer = document.getElementById('lotto-numbers');
const generateBtn = document.getElementById('generate-btn');

function generateLottoNumbers() {
  const numbers = new Set();
  while (numbers.size < 6) {
    const randomNumber = Math.floor(Math.random() * 45) + 1;
    numbers.add(randomNumber);
  }
  return Array.from(numbers);
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
