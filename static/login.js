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

async function submitLogin() {
  var username = document.getElementById('loginusername').value;
  var password = document.getElementById('loginpassword').value;
  var loginMessage = document.getElementById('loginMessage');

  document.getElementById('loginusername').value = "";
  document.getElementById('loginpassword').value = "";


  
  await fetch('/login',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  }) 
  .then(Response => Response.json())
  .then(data =>{
      if (data.success === false)
      {
        loginMessage.innerHTML = 'Invalid username or password';
        loginMessage.style.color = 'red';
      }
      alert(data.message);
  })
  .catch(error => {
      console.error("Erro ao enviar solicitação: ", error);
  })
  
}

async function submitCad() {
  var username = document.getElementById('signupusername').value;
  var password = document.getElementById('signuppassword').value;

  var loginMessage = document.getElementById('cadMessage');

  document.getElementById('signupusername').value = "";
  document.getElementById('signuppassword').value = "";

  await fetch('/cadastrar',{
    method: 'POST',
    headers:{
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify({
      username:username,
      password:password,
    }),
})
  .then(Response=> Response.json())
  .then(data=>{
    if(data.success===false){
      loginMessage.innerHTML = 'Invalid username or password';
      loginMessage.style.color = 'red';
    }
    alert(data.message);
  })
  .catch(error => {
    console.error("Erro ao enviar solicitação: ", error);
})
  
}
