// Firebase modüllerini import et
import { 
  auth, 
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  ref,
  set,
  update,
  push,
  onValue,
  serverTimestamp
} from './firebase-config.js';

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
      const email = loginForm.querySelector('input[type="email"]').value;
      const password = loginForm.querySelector('input[type="password"]').value;
      
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          
          // E-posta doğrulama kontrolü
          if (!user.emailVerified) {
            alert('Lütfen e-posta adresinizi doğrulayın.');
            signOut(auth);
          } else {
            // Kullanıcıyı yönlendir (demo için alert)
            alert('Giriş başarılı! Gerçek uygulamada sohbet sayfasına yönlendirileceksiniz.');
          }
        })
        .catch((error) => {
          let errorMessage = 'Giriş sırasında bir hata oluştu.';
          
          if (error.code === 'auth/wrong-password') {
            errorMessage = 'Yanlış şifre!';
          } else if (error.code === 'auth/user-not-found') {
            errorMessage = 'Kullanıcı bulunamadı!';
          }
          
          alert(errorMessage);
        });
    });
    
    // Google ile giriş
    const googleLoginBtn = document.querySelector('.google-btn');
    if (googleLoginBtn) {
      googleLoginBtn.addEventListener('click', () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
          .then((result) => {
            const user = result.user;
            alert('Google ile giriş başarılı! Gerçek uygulamada sohbet sayfasına yönlendirileceksiniz.');
          })
          .catch((error) => {
            alert('Google ile giriş yapılamadı.');
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
      
      // Şifre doğrulama
      if (password !== confirmPassword) {
        alert('Şifreler eşleşmiyor!');
        return;
      }
      
      // Kullanıcı oluştur
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          
          // Profil güncelleme
          // Not: Firebase v9'da updateProfile ayrı import edilmeli
          // Bu demo için basitleştirildi
          
          // E-posta doğrulama gönder
          sendEmailVerification(user)
            .then(() => {
              alert('Kayıt başarılı! Lütfen e-posta adresinize gönderilen doğrulama linkine tıklayın.');
              
              // Kullanıcı verilerini veritabanına kaydet
              saveUserToDatabase(user, fullName);
            });
        })
        .catch((error) => {
          let errorMessage = 'Kayıt sırasında bir hata oluştu.';
          
          if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Bu e-posta adresi zaten kullanımda!';
          } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Şifre çok zayıf! En az 6 karakter olmalı.';
          }
          
          alert(errorMessage);
        });
    });
  }
  
  // Kullanıcıyı veritabanına kaydet
  function saveUserToDatabase(user, fullName) {
    const userId = user.uid;
    const username = user.email.split('@')[0];
    
    const userData = {
      uid: userId,
      email: user.email,
      displayName: fullName,
      photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${username}`,
      emailVerified: user.emailVerified,
      provider: 'email',
      lastLogin: serverTimestamp(),
      status: 'online',
      createdAt: serverTimestamp()
    };
    
    // Veritabanına kaydet
    set(ref(db, 'users/' + userId), userData)
      .then(() => {
        console.log('Kullanıcı veritabanına kaydedildi');
      })
      .catch((error) => {
        console.error('Kullanıcı kaydedilemedi:', error);
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
      aiResponse.textContent = 'Size nasıl yardımcı olabilirim? Bu demo sürümde AI entegrasyonu yoktur.';
      document.querySelector('.chat-bubble').parentNode.insertBefore(aiResponse, document.querySelector('.chat-bubble').nextSibling);
    }, 1000);
  }
});
