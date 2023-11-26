function abrirTelaFlutuante() {
  // Abre a tela flutuante ao clicar no botão "Abrir Tela Flutuante"
  document.getElementById('login').style.display = 'flex';
}
function abrirTelaCadastro() {
  // Fecha a tela flutuante ao clicar no botão "Fechar"
  document.getElementById('login').style.display = 'none';
  document.getElementById('login2').style.display = 'flex';
}

function fecharTelaFlutuante() {
  // Fecha a tela flutuante ao clicar no botão "Fechar"
  document.getElementById('login').style.display = 'none';
}

function fecharTelaCadastro() {
  // Fecha a tela flutuante ao clicar no botão "Fechar"
  document.getElementById('login2').style.display = 'none';
}

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