document.addEventListener('DOMContentLoaded', () => {
  // Sekme geçişleri
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Aktif butonu güncelle
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Panel göster/gizle
      const tabName = btn.getAttribute('data-tab');
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `${tabName}-panel`) {
          panel.classList.add('active');
        }
      });
    });
  });
  
  // Giriş formu
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Giriş işlemi için Firebase entegrasyonu gereklidir. Bu demo sürümde çalışmayacaktır.');
    });
  }
  
  // Kayıt formu
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Kayıt işlemi için Firebase entegrasyonu gereklidir. Bu demo sürümde çalışmayacaktır.');
    });
  }
  
  // AI Asistan
  const assistantIcon = document.querySelector('.assistant-icon');
  const assistantChat = document.querySelector('.assistant-chat');
  const chatInput = document.querySelector('.chat-input input');
  const chatSendBtn = document.querySelector('.chat-input button');
  
  if (assistantIcon && assistantChat) {
    assistantIcon.addEventListener('click', () => {
      assistantChat.style.display = assistantChat.style.display === 'block' ? 'none' : 'block';
    });
    
    // Enter tuşu ile mesaj gönderme
    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          handleAIChat();
        }
      });
    }
    
    // Gönder butonu
    if (chatSendBtn) {
      chatSendBtn.addEventListener('click', handleAIChat);
    }
  }
  
  // AI Sohbet işleme
  function handleAIChat() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Kullanıcı mesajını ekle
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-bubble';
    userMessage.style.textAlign = 'right';
    userMessage.style.borderRadius = '18px 18px 0 18px';
    userMessage.style.marginLeft = 'auto';
    userMessage.style.backgroundColor = '#DCF8C6';
    userMessage.textContent = message;
    document.querySelector('.chat-bubble').parentNode.insertBefore(userMessage, document.querySelector('.chat-bubble').nextSibling);
    
    // Giriş alanını temizle
    chatInput.value = '';
    
    // AI Yanıtı
    setTimeout(() => {
      const aiResponse = document.createElement('div');
      aiResponse.className = 'chat-bubble';
      aiResponse.textContent = 'Size nasıl yardımcı olabilirim? Bu demo sürümde gerçek AI entegrasyonu yoktur.';
      document.querySelector('.chat-bubble').parentNode.insertBefore(aiResponse, document.querySelector('.chat-bubble').nextSibling);
    }, 1000);
  }
});
