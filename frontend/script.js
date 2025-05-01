function register() {
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email').value;
  
    const username = name + "_" + surname;
    const password = "123456"; // временно, пока нет поля для пароля
  
    fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || "Регистрация прошла");
      })
      .catch(err => {
        alert("Ошибка запроса: " + err);
      });
  }
  
  
  function login() {
    const accessCode = document.getElementById('accessCode').value;
    fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: accessCode, password: '123456' })
    }).then(res => res.json())
      .then(data => {
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
          window.location.href = '/index.html';
        } else {
          alert("Ошибка входа");
        }
      });
  }
  
  function sendMessage() {
    const text = document.getElementById('messageText').value;
    const container = document.getElementById('chat-messages');
  
    const msg = document.createElement('div');
    msg.className = 'chat-message';
    msg.innerHTML = `<b>Вы</b><br>${text}<div class="likes">❤️ 0</div>`;
    container.appendChild(msg);
    document.getElementById('messageText').value = '';
  }
  
  function switchTab(tab) {
    alert("Переход во вкладку: " + tab); // можно заменить отображением разных div
  }
  
  function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
  }
  