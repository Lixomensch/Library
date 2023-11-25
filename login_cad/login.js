function submitForm() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var loginMessage = document.getElementById('loginMessage');

  // Simulação de verificação de login (substitua com lógica real)
  if (username === 'user' && password === 'pass') {
      loginMessage.innerHTML = 'Login successful!';
      loginMessage.style.color = 'green';
      window.location.href = 'main.html';
  } else {
      loginMessage.innerHTML = 'Invalid username or password';
      loginMessage.style.color = 'red';
  }
}

function Cadsuccessful() {
  window.location.href = "main_page/main.html";
  return false;
}