document.addEventListener("DOMContentLoaded", async function () {
    document.getElementById("nome_user").textContent = localStorage.getItem("username").toUpperCase()

    document.addEventListener("click", function (event) {
        // Verifica se o elemento clicado não está dentro do modal
        if (!document.getElementById("modalcover").contains(event.target)) {
            document.getElementById("modalcover").style.display = "none";
        }
    });

    await fetch('/get-livros', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            // Verifique se a solicitação foi bem-sucedida
            if (data) {
                exibirLivros("biblioteca_lendo", data.success.lendo);
                exibirLivros("biblioteca_vouler", data.success.livros_a_ler);
                exibirLivros("biblioteca_terminei", data.success.lidos);
            } else {
                // Trate o caso em que não há livros encontrados
                console.error('Erro ao obter livros:', data.message);
            }
        })
        .catch(error => {
            console.error('Erro na solicitação:', error);
        });
});


// Barra de pesquisa

function separaStrignarry(inputString) { //transforma uma string em um array de palavras
    const processedString = inputString.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/[^a-z\s]/g, ' ');

    // Utiliza o método split para dividir a string em palavras
    const wordsArray = processedString.split(/\s+/);

    return wordsArray;
}

function temItemIgual(array1, array2) { //Função que verifica se tem um elemento igual nos dois arrays
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

async function bt_pesquisar(event) {
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
                    bookElement.addEventListener("click", async function () {
                        cover.style.display = "none";
                        const livro = { capa: book.coverUrl, titulo: book.title, descricao: book.description };
                        descrição(livro, "basic_op");
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

document.getElementById('openProfileBtn').addEventListener('click', openProfile);
document.getElementById('fechar').addEventListener('click', closeProfile);

function openProfile() {
    document.getElementById('profileModal').style.display = 'block';
}

function closeProfile() {
    document.getElementById('profileModal').style.display = 'none';
}

async function changePassword() {


    if(document.getElementById("input_senha_new").value =="" ||  document.getElementById("input_senha_old").value=="")
    {
        alert("Os campos devem ser preenchidos.");
        return true;
    }

    await fetch('/alterar-usuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            password: document.getElementById("input_senha_old").value,
            new_password:  document.getElementById("input_senha_new").value,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Senha trocada com sucesso!");
            window.location.reload();
        } else {
            alert(data.success);
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
    });
       
}

function deleteAccount() {
    fetch('/deletar-usuario');
    sairdaAccount();
}

function sairdaAccount(){
    localStorage.removeItem("username")
    fetch('/')
      .then(response => response.text())
      .then(html => {
        window.history.replaceState({}, document.title, '/');
        window.location.href = '/';
        window.location.reload();
      })
      .catch(error => console.error('Erro na solicitação:', error));
}

function setar_livro_database(rota, livro) {
    console.log(rota, " ", livro);
    fetch(rota, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            titulo: livro.titulo,
            capa: livro.capa,
            description: livro.descricao
        }),
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Erro na requisição:', error);
        });

    window.location.reload();
}

async function remover_livro_database(livro){
    await fetch('/deletar_livro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            titulo: livro.titulo,
        }),
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Erro na requisição:', error);
        });

    window.location.reload();
}

async function set_livro(livro) {
    var selectElement = document.getElementById("select_modaldes");
    var selectedValue = selectElement.value;


    switch (selectedValue) 
    {
        case "Lendo_op":
            await setar_livro_database('/set_Lendo', livro);
            break;
        case "Quero_ler_op":
            await setar_livro_database('/set_Quero_ler', livro);
            break;
        case "Terminei_op":
            await setar_livro_database('/set_Terminei', livro);
            break;
        default:
            await remover_livro_database(livro);
            break;
    }

}

function exibirLivros(categoria, livros) {
    const livroLista = document.getElementById(categoria);
    livroLista.innerHTML = "";

    if (livroLista) {
        livros.forEach(livro => {

            const capaElemento = document.createElement("img");
            capaElemento.setAttribute("id", "img_capas_livro");
            capaElemento.src = livro[2];

            livroLista.appendChild(capaElemento);

            capaElemento.addEventListener("click", async function () {
                const book = { capa: livro[2], titulo: livro[1], descricao: livro[3] };
                descrição(book, categoria);
            });

        });
    } else {
        console.error("Elemento com ID 'bliblioteca' não encontrado.");
    }

}

async function descrição(livro, opcao) {
    const modal = document.getElementById("modaldes");
    modal.style.display = "flex";

    const inferior_modaldes = document.getElementById("inferior_modaldes");
    inferior_modaldes.innerHTML = "";
    const superior_modaldes = document.getElementById("superior_modaldes");
    superior_modaldes.innerHTML = "";

    const selectbox_modaldes = document.createElement("select");
    selectbox_modaldes.setAttribute("id", "select_modaldes");
    selectbox_modaldes.classList.add("select_modaldes")
    selectbox_modaldes.innerHTML += `<option value="basic_op">-</option>`;
    selectbox_modaldes.innerHTML += `<option value="Lendo_op">Lendo</option>`;
    selectbox_modaldes.innerHTML += `<option value="Quero_ler_op">Quero ler</option>`;
    selectbox_modaldes.innerHTML += `<option value="Terminei_op">Terminei</option>`;

    if (opcao === "biblioteca_lendo") opcao = "Lendo_op";
    else if (opcao === "biblioteca_vouler") opcao = "Quero_ler_op"
    else if (opcao === "biblioteca_terminei") opcao = "Terminei_op"
    selectbox_modaldes.value = opcao;

    const capaElemento = document.createElement("img");
    capaElemento.setAttribute("id", "capa_modaldes");
    capaElemento.classList.add("capa_modaldes")
    capaElemento.src = livro.capa;

    const tituloElemento = document.createElement("h2");
    tituloElemento.setAttribute("id", "titulo_modaldes");
    tituloElemento.classList.add("titulo_modaldes")
    tituloElemento.textContent = livro.titulo;

    const description = document.createElement("h2");
    description.textContent = livro.descricao;
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
            set_livro(livro)
            document.removeEventListener("mousedown", fecharModalFora);
        }
    }
}
