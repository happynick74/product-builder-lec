document.addEventListener('DOMContentLoaded', () => {
  const lottoNumbersContainer = document.getElementById('lotto-numbers');
  const generateBtn = document.getElementById('generate-btn');
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // --- Theme Logic ---
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
    themeToggle.textContent = theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환';
  }

  // --- Lotto Logic ---
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
    
    numbers.forEach((number, index) => {
      const numberElement = document.createElement('div');
      numberElement.classList.add('lotto-number');
      numberElement.textContent = number;
      
      // Staggered animation effect
      numberElement.style.opacity = '0';
      numberElement.style.transform = 'translateY(20px)';
      
      lottoNumbersContainer.appendChild(numberElement);
      
      setTimeout(() => {
        numberElement.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        numberElement.style.opacity = '1';
        numberElement.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  generateBtn.addEventListener('click', () => {
    const numbers = generateLottoNumbers();
    displayNumbers(numbers);
  });

  // Initialize with numbers
  displayNumbers(generateLottoNumbers());
});
