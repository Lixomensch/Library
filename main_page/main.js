document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const coverResult = document.getElementById("coverResult");
    const cover = document.getElementById("modalcover");
    const insertBookButton = document.getElementById("insertBookButton");

    let livro = {};

    searchButton.addEventListener("click", function() {
        const bookTitle = searchInput.value;
        if (bookTitle.trim() !== "") {
            search(bookTitle, "AIzaSyC_1Dck7BnjXJT7flc6XbHKg4pJz34amGc")
                .then(ret => {
                    livro = {
                        title: ret.title,
                        coverUrl: ret.coverUrl,
                    }
                    if (ret.coverUrl) {
                        coverResult.innerHTML = `<img src="${ret.coverUrl}" alt="Capa do Livro">`;
                        coverResult.innerHTML += `<p>${ret.title}</p>`;
                        
                    } else {
                        coverResult.innerHTML = "Capa não encontrada";
                    }
                    cover.style.display = "flex"
                });
        }
    });

    document.addEventListener("click", function(event) {
        // Verifica se o elemento clicado não está dentro do modal
        if (!cover.contains(event.target)) {
            cover.style.display = "none";
        }
    });

    insertBookButton.addEventListener("click", function() {

        // Exemplo usando fetch (substitua a URL pelo seu endpoint)
        fetch("/api/inserirLivro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(livro),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Livro inserido com sucesso:", data);
            // Aqui você pode realizar outras ações após a inserção
        })
        .catch(error => {
            console.error("Erro ao inserir livro:", error);
        });
    });
});



async function search(bookTitle, apiKey) {
    const baseUrl = "https://www.googleapis.com/books/v1/volumes";
    const params = {
        q: bookTitle,
        key: apiKey,
    };

    try {
        const response = await fetch(`${baseUrl}?${new URLSearchParams(params)}`);
        const data = await response.json();

        if ('items' in data && data['items'].length > 0) {
            const book = data['items'][0]['volumeInfo'];
            const title = book.title || 'Título não disponível';
            const coverUrl = book.imageLinks?.thumbnail || '';
            return { title, coverUrl };
        } else {
            return { title: 'Título não encontrado', coverUrl: null };
        }
    } catch (error) {
        console.error("Erro ao obter dados:", error);
        throw error;
    }
}



// Funções para abrir e fechar a tela de perfil
document.getElementById('openProfileBtn').addEventListener('click', openProfile);
document.getElementById('fechar').addEventListener('click', closeProfile);

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
document.getElementById("btnCarregarLivros").addEventListener("click", function() {
    exibirLivros();
});
function exibirLivros() {
    const livros = [
        { titulo: "Lifsdg fjhgd sgj fgdskgsdhgk hdskgjhkds jhgkds jhgkj dshkj", capa: "/images/anão_home.jpg" },
        { titulo: "Livro 2", capa: "/images/anão_home.jpg"  },
        { titulo: "Livro 3", capa: "/images/anão_home.jpg"  },
        // Adicione mais livros conforme necessário
    ];
 
    const livroLista = document.getElementById("bliblioteca");
    livroLista.innerHTML = "";

    if (livroLista) {
        livros.forEach(livro => {
            const livroElemento = document.createElement("button");
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
            
            livroElemento.onclick = function () {
                descrição(livro);
            };

            livroLista.appendChild(livroElemento);
        });
    } else {
        console.error("Elemento com ID 'bliblioteca' não encontrado.");
    }
    
}

function descrição(livro){
    const modal = document.getElementById("modaldes");
    modal.style.display = "flex";

    const livroElemento = document.getElementById("des-capa");
    livroElemento.innerHTML = "";
    const capaElemento = document.createElement("img");
    capaElemento.style.width = "200px";
    capaElemento.style.height = "250px";
    capaElemento.src = livro.capa;

    const tituloElemento = document.createElement("p");
    tituloElemento.textContent = livro.titulo;
    tituloElemento.style.margin = "0";

    livroElemento.appendChild(capaElemento);
    livroElemento.appendChild(tituloElemento);

    document.addEventListener("mousedown", fecharModalFora);

    // Função para fechar o modal se o clique ocorrer fora dele
    function fecharModalFora(event) {
        if (!modal.contains(event.target)) {
            // O clique ocorreu fora do modal, então fecha o modal
            modal.style.display = "none";
            // Remove o evento de clique do documento para evitar interferências
            document.removeEventListener("mousedown", fecharModalFora);
        }
    }

    const button = document.getElementById("removeBookButton");
    button.addEventListener("click", removerLivroDoBanco);

    function removerLivroDoBanco(livro) {
        // Lógica para remover o livro do banco de dados
        // Substitua o conteúdo desta função com a lógica real de remoção
        console.log("Removendo livro do banco de dados:", livro.titulo);
        // Aqui você pode enviar uma solicitação para o servidor para remover o livro, por exemplo
    }
}
