// Firebase modüllerini import et
import { 
  auth, 
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signOut,
  ref,
  set,
  update,
  push,
  serverTimestamp
} from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
  // Sekme geçişleri
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `${btn.getAttribute('data-tab')}-panel`) {
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
      const email = loginForm.querySelector('input[type="email"]').value;
      const password = loginForm.querySelector('input[type="password"]').value;
      
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          
          if (!user.emailVerified) {
            alert('Lütfen e-posta adresinizi doğrulayın. Doğrulama e-postası gönderildi.');
            sendEmailVerification(user)
              .then(() => {
                signOut(auth);
              });
          } else {
            // Gerçek uygulamada yönlendirme olur
            alert('Giriş başarılı! Gerçek uygulamada sohbet sayfasına yönlendirileceksiniz.');
          }
        })
        .catch((error) => {
          let errorMessage = 'Giriş hatası: ' + error.message;
          alert(errorMessage);
        });
    });
    
    // Google ile giriş
    const googleLoginBtn = document.querySelector('.google-btn');
    if (googleLoginBtn) {
      googleLoginBtn.addEventListener('click', () => {
        signInWithPopup(auth, googleProvider)
          .then((result) => {
            const user = result.user;
            alert('Google ile giriş başarılı!');
          })
          .catch((error) => {
            alert('Google girişi hatası: ' + error.message);
          });
      });
    }
  }
  
  // Kayıt formu
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const fullName = registerForm.querySelector('input[type="text"]').value;
      const email = registerForm.querySelector('input[type="email"]').value;
      const password = registerForm.querySelector('input[type="password"]:first-of-type').value;
      const confirmPassword = registerForm.querySelector('input[type="password"]:last-of-type').value;
      
      if (password !== confirmPassword) {
        alert('Şifreler eşleşmiyor!');
        return;
      }
      
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          
          // Kullanıcı bilgilerini kaydet
          const userId = user.uid;
          const username = email.split('@')[0];
          
          set(ref(db, 'users/' + userId), {
            uid: userId,
            email: email,
            displayName: fullName,
            photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${username}`,
            emailVerified: false,
            createdAt: serverTimestamp()
          }).then(() => {
            // E-posta doğrulama gönder
            sendEmailVerification(user)
              .then(() => {
                alert('Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.');
                // Giriş ekranına yönlendir
                document.querySelector('[data-tab="login"]').click();
              });
          });
        })
        .catch((error) => {
          alert('Kayıt hatası: ' + error.message);
        });
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
    
    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          handleAIChat();
        }
      });
    }
    
    if (chatSendBtn) {
      chatSendBtn.addEventListener('click', handleAIChat);
    }
  }
  
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
    
    chatInput.value = '';
    
    // AI Yanıtı
    setTimeout(() => {
      const aiResponse = document.createElement('div');
      aiResponse.className = 'chat-bubble';
      aiResponse.textContent = 'Merhaba! Sohbetim uygulamasına hoş geldiniz. Gerçek AI entegrasyonu için lütfen Firebase\'i doğru yapılandırın.';
      document.querySelector('.chat-bubble').parentNode.insertBefore(aiResponse, document.querySelector('.chat-bubble').nextSibling);
    }, 1000);
  }
  
  // Auth durumunu izle
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Kullanıcı giriş yaptı:", user.email);
    } else {
      console.log("Kullanıcı çıkış yaptı");
    }
  });
});
