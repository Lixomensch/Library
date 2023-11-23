document.getElementById('login').addEventListener('click', function() {
  // Redireciona para a página desejada
  window.location.href = 'login.html';
});

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
