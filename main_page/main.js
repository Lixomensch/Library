function search() {
    // Obter o valor do campo de pesquisa
    var searchTerm = document.getElementById('searchInput').value.toLowerCase();

    // Lógica de pesquisa (substitua isso com a sua lógica de busca real)
    alert('Você pesquisou por: ' + searchTerm);
    // Aqui você pode redirecionar para uma página de resultados, atualizar a página com os resultados, etc.
}

// Funções para abrir e fechar a tela de perfil
document.getElementById('openProfileBtn').addEventListener('click', openProfile);
document.getElementById('closeProfileBtn').addEventListener('click', closeProfile);

function openProfile() {
    document.getElementById('profileModal').style.display = 'block';
}

function closeProfile() {
    document.getElementById('profileModal').style.display = 'none';
}

function changePassword() {
    // Lógica para a troca de senha
    alert('Implemente a lógica para trocar a senha aqui.');
}

function deleteAccount() {
    // Lógica para excluir a conta
    alert('Implemente a lógica para deletar a conta aqui.');
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btnCarregarLivros").addEventListener("click", function() {
        exibirLivros();
    });
    Lendo();
});

function Terminei(){
    fetch("backend/Terminei.py")
    .then(response => response.json())
    .then(data => exibirLivros(data))
    .catch(error => console.error("Erro ao obter dados:", error));
}
function vouler(){
    fetch("backend/vouler.py")
    .then(response => response.json())
    .then(data => exibirLivros(data))
    .catch(error => console.error("Erro ao obter dados:", error));
}

function Lendo(){
    fetch("backend/Lendo.py")
    .then(response => response.json())
    .then(data => exibirLivros(data))
    .catch(error => console.error("Erro ao obter dados:", error));
}

function exibirLivros() {
    const livros = [
        { titulo: "Lifsdg fjhgd sgj fgdskgsdhgk hdskgjhkds jhgkds jhgkj dshkj", capa: "/images/anão_home.jpg" },
        { titulo: "Livro 2", capa: "/images/anão_home.jpg"  },
        { titulo: "Livro 3", capa: "/images/anão_home.jpg"  },
        // Adicione mais livros conforme necessário
    ];
 
    const livroLista = document.getElementById("bliblioteca");

    if (livroLista) {
        livros.forEach(livro => {
            const livroElemento = document.createElement("div");
            livroElemento.className = "livro";
    
            const capaElemento = document.createElement("img");
            capaElemento.style.width = "70px";
            capaElemento.style.height = "80px";
            capaElemento.src = livro.capa;
            
            const tituloElemento = document.createElement("p");
            tituloElemento.textContent = livro.titulo;
            tituloElemento.style.margin = "0";

            livroElemento.appendChild(capaElemento);
            livroElemento.appendChild(tituloElemento);
            
            livroLista.appendChild(livroElemento);
        });
    } else {
        console.error("Elemento com ID 'bliblioteca' não encontrado.");
    }
    
}
