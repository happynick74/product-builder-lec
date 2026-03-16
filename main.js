document.addEventListener('DOMContentLoaded', () => {
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
});
