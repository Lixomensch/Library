

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("nome_user").textContent = localStorage.getItem("username").toUpperCase()

    document.addEventListener("click", function(event) {
        // Verifica se o elemento clicado não está dentro do modal
        if (!document.getElementById("modalcover").contains(event.target)) {
            document.getElementById("modalcover").style.display = "none";
        }
    });
});


// Barra de pesquisa

function separaStrignarry(inputString) 
{ //transforma uma string em um array de palavras
    const processedString = inputString.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/[^a-z\s]/g, ' ');

    // Utiliza o método split para dividir a string em palavras
    const wordsArray = processedString.split(/\s+/);

    return wordsArray;
}

function temItemIgual(array1, array2) 
{ //Função que verifica se tem um elemento igual nos dois arrays
    for (const item1 of array1) {
        if (array2.includes(item1)) {
            return true;
        }
    }
    return false;
}


let isSearching = false; 


document.getElementById("searchInput").addEventListener("keyup", function (event) {
    if (!isSearching) {
        bt_pesquisar(event);
    }
});

document.getElementById("searchButton").addEventListener("click", function (event) {
    if (!isSearching) {
        bt_pesquisar(event);
    }
});

async function bt_pesquisar(event)
{
    //* Botão Pesquisar
    if (event) {
        event.preventDefault();
    }

    if (isSearching) {
        return;
    }

    isSearching = true; 

    const searchInput = document.getElementById("searchInput");
    const coverResult = document.getElementById("coverResult");
    const cover = document.getElementById("modalcover");
    const bookTitle = searchInput.value.toLowerCase();

    // Limpar resultados anteriores
    coverResult.innerHTML = '';

    const booksToPreserve = new Map();

    if (bookTitle.trim() !== "") {
        try {
            const books = await search(bookTitle, "AIzaSyC_1Dck7BnjXJT7flc6XbHKg4pJz34amGc");

            books.forEach(book => {
                if (book.coverUrl) {
                    const bookElement = document.createElement("div");
                    bookElement.classList.add("result_dynamic_books");
                    bookElement.setAttribute("id", "result_dynamic_books");

                    // Adicionar conteúdo ao elemento
                    bookElement.innerHTML = `<img src="${book.coverUrl}" alt="Capa do Livro" id="img_capas_livro"><p id="titlecapaslivro">${book.title}</p>`;

                    // Adicionar o elemento ao conjunto
                    booksToPreserve.set(book.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/[^a-z\s]/g, ''), bookElement);
                
                    // Adicionar evento de clique
                    bookElement.addEventListener("click", function() {
                        cover.style.display="none";
                        const livro = { capa: book.coverUrl, titulo: book.title, description: book.description };
                        descrição(livro);
                    });
                }
            });

            booksToPreserve.forEach((preservedBook) => {
                coverResult.appendChild(preservedBook);
            });

            cover.style.display = "flex";
        } catch (error) {
            console.error("Erro durante a busca:", error);
        } finally {
            isSearching = false; 
        }
    }
}

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
            const books = data['items'].map(item => {
                const bookInfo = item['volumeInfo'];
                const title = bookInfo.title || 'Título não disponível';
                const description = bookInfo.description || 'Descrição não disponível';
                const coverUrl = bookInfo.imageLinks?.thumbnail || '';

                // Verifica se o título ou a descrição contêm qualquer parte da string fornecida
                if (title.toLowerCase().includes(bookTitle.toLowerCase()) || description.toLowerCase().includes(bookTitle.toLowerCase())) {
                    return { title, description, coverUrl };
                }
                return null; // Retorna null para indicar que o livro não corresponde aos critérios
            }).filter(book => book !== null); // Filtra os resultados nulos

            if (books.length > 0) {
                return books;
            } else {
                return [{ title: 'Nenhum livro encontrado', coverUrl: null }];
            }
        } else {
            return [{ title: 'Nenhum livro encontrado', coverUrl: null }];
        }
    } catch (error) {
        console.error("Erro ao obter dados:", error);
        throw error;
    }
}







/*
<div class="inserir">
            <select id="statusSelect">
                <option value="lendo">Lendo</option>
                <option value="vouLer">Vou Ler</option>
                <option value="concluido">Concluído</option>
            </select>
            <button id="insertBookButton">Inserir</button>
        </div>*/

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
/*
function set_livro(){
    fetch("/Terminei")
    .then(response => response.json())
    .then(data => exibirLivros(data))
    .catch(error => console.error("Erro ao obter dados:", error));


    switch (op)
    {
    }
}


function get_livros(){
    fetch("/Terminei")
    .then(response => response.json())
    .then(data => exibirLivros(data))
    .catch(error => console.error("Erro ao obter dados:", error));
}

document.getElementById("btnCarregarLivros").addEventListener("click", function() {
    exibirLivros();
});
*/
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

function descrição(livro)
{
    const modal = document.getElementById("modaldes");
    modal.style.display = "flex";

    const inferior_modaldes = document.getElementById("inferior_modaldes");
    inferior_modaldes.innerHTML = "";
    const superior_modaldes = document.getElementById("superior_modaldes");
    superior_modaldes.innerHTML = "";

    const selectbox_modaldes = document.createElement("select");
    selectbox_modaldes.setAttribute("id", "select_modaldes");
    selectbox_modaldes.classList.add("select_modaldes")
    selectbox_modaldes.innerHTML+=`<option value="basic_op">-</option>`;
    selectbox_modaldes.innerHTML+=`<option value="Lendo_op">Lendo</option>`;
    selectbox_modaldes.innerHTML+=`<option value="Quero_ler_op">Quero ler</option>`;
    selectbox_modaldes.innerHTML+=`<option value="Terminei_op">Terminei</option>`;
    
    const capaElemento = document.createElement("img");
    capaElemento.setAttribute("id", "capa_modaldes");
    capaElemento.classList.add("capa_modaldes")
    capaElemento.src = livro.capa;

    const tituloElemento = document.createElement("h2");
    tituloElemento.setAttribute("id", "titulo_modaldes");
    tituloElemento.classList.add("titulo_modaldes")
    tituloElemento.textContent = livro.titulo;

    const description = document.createElement("h2");
    description.textContent = livro.description;
    description.setAttribute("id", "description_modaldes");
    description.classList.add("description_modaldes")
    
    superior_modaldes.appendChild(capaElemento);
    superior_modaldes.appendChild(tituloElemento);
    inferior_modaldes.appendChild(selectbox_modaldes)
    inferior_modaldes.appendChild(description);

    document.addEventListener("mousedown", fecharModalFora);

    // Função para fechar o modal se o clique ocorrer fora dele
    function fecharModalFora(event) {
        if (!modal.contains(event.target)) {
            // O clique ocorreu fora do modal, então fecha o modal
            modal.style.display = "none";
            
            if ()

            document.removeEventListener("mousedown", fecharModalFora);
        }
    }
}
