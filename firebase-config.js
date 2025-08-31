// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyCICiMDhK5MkQDq4dbV_9jkDMt4n3MUpEg",
  authDomain: "sohbetim-9a9d7.firebaseapp.com",
  databaseURL: "https://sohbetim-9a9d7-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sohbetim-9a9d7",
  storageBucket: "sohbetim-9a9d7.firebasestorage.app",
  messagingSenderId: "277333150871",
  appId: "1:277333150871:web:d923f8cddb19ec2f672dd2"
};

// Firebase'i yükle
document.addEventListener('DOMContentLoaded', () => {
  // Firebase scriptlerini dinamik olarak yükle
  const firebaseScripts = [
    'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js',
    'https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js'
  ];

  firebaseScripts.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  });
  
  console.log('Firebase konfigürasyonu yüklendi');
});
