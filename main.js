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

  // --- Form Handling ---
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Feedback during submission
      submitBtn.disabled = true;
      submitBtn.textContent = '보내는 중...';
      
      const formData = new FormData(contactForm);
      
      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          submitBtn.textContent = '완료되었습니다!';
          submitBtn.style.backgroundColor = 'oklch(0.7 0.1 140)'; // Success green
          contactForm.reset();
          
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.backgroundColor = '';
          }, 3000);
        } else {
          throw new Error('전송 실패');
        }
      } catch (error) {
        submitBtn.textContent = '오류 발생. 다시 시도해 주세요.';
        submitBtn.style.backgroundColor = 'oklch(0.6 0.15 20)'; // Error red
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = '';
        }, 3000);
      }
    });
  }

  // Initialize with numbers
  displayNumbers(generateLottoNumbers());
});
