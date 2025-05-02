function register() {
  const name = document.getElementById('name').value;
  const surname = document.getElementById('surname').value;
  const email = document.getElementById('email').value;

  fetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, surname, email })
  })
    .then(res => res.json())
    .then(data => {
      if (data.access_token) {
        alert("Регистрация прошла успешно. Теперь войдите.");
        window.location.href = '/login.html'; // ⬅ переход на страницу входа
      } else {
        alert(data.message || 'Ошибка регистрации');
      }
    });
}


function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        window.location.href = '/index.html';
      } else {
        alert(data.message || 'Ошибка входа');
      }
    });
}

function sendMessage() {
  const text = document.getElementById('messageText').value;
  const container = document.getElementById('chat-messages');

  if (!text.trim()) return;

  const msg = document.createElement('div');
  msg.className = 'chat-message';
  msg.innerHTML = `<b>Вы</b><br>${text}<div class="likes">❤️ 0</div>`;
  container.appendChild(msg);
  document.getElementById('messageText').value = '';
}

function switchTab(tab) {
  alert("Переключение на: " + tab);
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login.html';
}

// Автоинициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const chatInput = document.getElementById("chatInputArea");
  const userPanel = document.getElementById("user-panel");

  if (token) {
    // Авторизован
    const userName = "Пользователь"; // можно получить из токена при декодировании

    // Поле чата
    chatInput.innerHTML = `
      <input type="text" id="messageText" placeholder="Введите сообщение...">
      <button onclick="sendMessage()">Отправить</button>
      <p id="chatName">Имя в чате: ${userName}</p>
    `;

    // Панель пользователя
    userPanel.innerHTML = `
      <span>${userName}</span>
      <img src="assets/profile.png" class="icon">
      <img src="assets/logout.png" class="icon" onclick="logout()">
    `;
  } else {
    // Неавторизован
    chatInput.innerHTML = `
      <button onclick="window.location.href='/register.html'">
        Хотите отправлять сообщения? Нажмите эту кнопку
      </button>
    `;

    userPanel.innerHTML = `
      <button onclick="window.location.href='/login.html'">Вход</button>
      <button onclick="window.location.href='/register.html'">Регистрация</button>
    `;
  }
  const videoId = 1; // Пока 1 видео — можно динамически передавать позже

  fetch(`/chat/${videoId}`)
    .then(res => res.json())
    .then(messages => {
      const container = document.getElementById('chat-messages');
      container.innerHTML = '';
      messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'chat-message';
        div.innerHTML = `<b>${msg.user}</b><br>${msg.content}<div class="likes">❤️</div>`;
        container.appendChild(div);
      });
    });

  if (token) {
    fetch('/me', { // создадим маршрут ниже
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json())
      .then(user => {
        document.getElementById("chatName").innerText = `Имя в чате: ${user.name}`;
        userPanel.innerHTML = `
          <span>${user.name} ${user.surname}</span>
          <img src="assets/profile.png" class="icon">
          <img src="assets/logout.png" class="icon" onclick="logout()">
        `;
      });
  }

  window.sendMessage = function () {
    const text = document.getElementById('messageText').value;
    if (!text.trim()) return;

    fetch(`/chat/${videoId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: text })
    }).then(() => location.reload());
  };

});
