document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const disqusThread = document.getElementById('disqus_thread');
  const commentsStatus = document.getElementById('comments-status');

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

  function showCommentsStatus(message) {
    if (!commentsStatus) {
      return;
    }

    commentsStatus.hidden = false;
    commentsStatus.textContent = message;
  }

  function getCanonicalPageUrl() {
    if (!disqusThread) {
      return '';
    }

    const explicitUrl = disqusThread.dataset.disqusUrl?.trim();

    if (explicitUrl) {
      return explicitUrl;
    }

    const url = new URL(window.location.href);
    url.hash = '';
    url.search = '';
    return url.toString();
  }

  function initDisqus() {
    if (!disqusThread) {
      return;
    }

    const shortname = disqusThread.dataset.disqusShortname?.trim();
    const identifier = disqusThread.dataset.disqusIdentifier?.trim() || window.location.pathname || 'home';
    const title = disqusThread.dataset.disqusTitle?.trim() || document.title;
    const canonicalUrl = getCanonicalPageUrl();
    const { protocol, hostname } = window.location;
    const isLocalPreview = protocol === 'file:' || ['localhost', '127.0.0.1', '::1'].includes(hostname) || hostname.endsWith('.local');

    if (!shortname) {
      showCommentsStatus('Disqus shortname이 설정되지 않아 댓글을 불러올 수 없습니다.');
      return;
    }

    if (isLocalPreview) {
      disqusThread.innerHTML = '';
      showCommentsStatus('Disqus 댓글은 로컬 주소에서는 표시되지 않을 수 있습니다. 배포된 공개 URL에서 확인해 주세요.');
      return;
    }

    window.disqus_config = function () {
      this.page.url = canonicalUrl;
      this.page.identifier = identifier;
      this.page.title = title;
    };

    const existingScript = document.querySelector('script[data-disqus-embed="true"]');

    if (existingScript) {
      return;
    }

    const script = document.createElement('script');
    script.src = `https://${shortname}.disqus.com/embed.js`;
    script.async = true;
    script.dataset.timestamp = String(Date.now());
    script.dataset.disqusEmbed = 'true';
    script.addEventListener('error', () => {
      disqusThread.innerHTML = '';
      showCommentsStatus('Disqus 스크립트를 불러오지 못했습니다. shortname 또는 도메인 설정을 확인해 주세요.');
    });

    document.body.appendChild(script);
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
          submitBtn.style.backgroundColor = '#3fa463';
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
        submitBtn.style.backgroundColor = '#d45555';
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = '';
        }, 3000);
      }
    });
  }

  initDisqus();
});
