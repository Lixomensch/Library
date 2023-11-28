from flask import Flask, render_template, jsonify, request
import requests
import sqlite3

app = Flask(__name__)

def db_connection():
    return sqlite3.connect('bancos.db')

# COMEÇO DAS FUNÇÕES DOS LIVROS
def search_book_cover(book_title, api_key):
    base_url = "https://www.googleapis.com/books/v1/volumes"
    params = {
        'q': book_title,
        'key': api_key,
    }

    response = requests.get(base_url, params=params)
    data = response.json()

    if 'items' in data and len(data['items']) > 0:
        cover_url = data['items'][0]['volumeInfo'].get('imageLinks', {}).get('thumbnail', '')
        return cover_url
    else:
        return None
    
def title_exists(titulo):
    with db_connection() as connection:
        cursor = connection.cursor()
        consulta = "SELECT * FROM livros WHERE titulo=?;"
        cursor.execute(consulta, (titulo,))
        resultados = cursor.fetchall()
        return len(resultados) > 0    

def include_book(titulo,autor):
    if title_exists(titulo):
        return False
    else:
        with db_connection() as connection:
            cursor = connection.cursor()
            consulta = "INSERT INTO livros (titulo,autor) VALUES (?, ?);"
            cursor.execute(consulta,(titulo,autor))
            connection.commit()
            return True
        
def update_book(titulo,autor,new_titulo,new_autor):
    with db_connection() as connection:
        #! try:
        cursor = connection.cursor()
        #book_id = resultado[0]
        # consulta = "UPDATE livros SET titulo=?, autor=? WHERE id IN (SELECT id FROM livros WHERE titulo=? AND autor=?);"
        #cursor.execute(consulta,(new_titulo,new_autor,titulo,autor))
        #connection.commit()
            
    
        
def delete_book(titulo):
    with db_connection() as connection:
        cursor = connection.cursor()
        resultado = cursor.fetchone()
        consulta = "DELETE FROM livros WHERE id IN (SELECT id FROM livros WHERE titulo=?);"
        cursor.execute(consulta,(titulo))
        connection.commit()
       
# FIM DAS FUNÇÕES DOS LIVROS

# COMEÇO FUNÇÕES USUÁRIO  
def username_exists(username):
    with db_connection() as connection:
        cursor = connection.cursor()
        consulta = "SELECT * FROM usuario WHERE username=?;"
        cursor.execute(consulta, (username,))
        resultados = cursor.fetchall()
        return len(resultados) > 0

def get_login_from_database(username, password):
    with db_connection() as connection:
        cursor = connection.cursor()
        consulta = "SELECT COUNT(*) FROM usuario WHERE username=? AND password=?;"
        cursor.execute(consulta, (username, password))
        resultados = cursor.fetchall()
        return resultados[0][0]
    
def get_signup_from_database(username, password):
    if username_exists(username):
        return -1  # Nome de usuário já existe, cadastro falhado
    else:
        with db_connection() as connection:
            cursor = connection.cursor()
            consulta = "INSERT INTO usuario (username,password) VALUES (?, ?);"
            cursor.execute(consulta, (username, password))
            connection.commit()
            return 1  # Cadastro bem-sucedido
    return 0 # erro com database        

def get_update_from_database(username,password,new_username,new_password):
    with db_connection() as connection:
        cursor = connection.cursor()
        resultado = cursor.fetchone()
        if resultado is not None:
            consulta = "UPDATE usuario SET username=?, password=? WHERE username=?;"
            cursor.execute(consulta,(new_username,new_password))
            connection.commit()
            return True
        else:
            return False

def delete_user_from_database(username,password):
    with db_connection() as connection:
        cursor = connection.cursor()
        consulta1 = "SELECT id FROM usuario WHERE username=? AND password=?;"
        cursor.execute(consulta1,(username,password))
        resultado = cursor.fetchone()
        if resultado is not None:
            user_id = resultado[0]
            consulta2 = "DELETE FROM usuario WHERE id=?;"
            cursor.execute(consulta2,(user_id))
            connection.commit()
            return True
        else:
            return False
# FIM DAS FUNÇÕES USUÁRIO

#COMEÇO DAS FUNÇÕES BIBLIOTECA
def get_user_id_by_username(username):
    with db_connection() as connection:
        cursor = connection.cursor()
        consulta = "SELECT id FROM usuario WHERE username=?;"
        cursor.execute(consulta, (username,))
        user_id = cursor.fetchone()
        return user_id[0] if user_id else None
    
def get_book_id_by_title(book_title):
    with db_connection() as connection:
        cursor = connection.cursor()
        consulta = "SELECT id FROM livro WHERE titulo=?;"
        cursor.execute(consulta, (book_title,))
        book_id = cursor.fetchone()
        return book_id[0] if book_id else None

def create_library_entry(username, book_title,avaliacao, status):
    try:
        user_id = get_user_id_by_username(username)
        book_id = get_book_id_by_title(book_title)

        if user_id is not None and book_id is not None:
            with db_connection() as connection:
                cursor = connection.cursor()
                consulta = "INSERT INTO biblioteca (usuario_id, livro_id,avaliacao, status) VALUES (?, ?, ?, ?);"
                cursor.execute(consulta, (username, book_title,avaliacao, status))
                connection.commit()
                return True
        else:
            app.logger.warning("Usuário ou livro não encontrado.")
            return False
    except Exception as e:
        app.logger.error(f"Erro durante a criação do registro na biblioteca: {e}")
        return False
    



def get_library_entry(username):
    with db_connection() as connection:
        user_id = get_user_id_by_username(username)
        cursor = connection.cursor()
        consulta = "SELECT * FROM biblioteca WHERE usuario_id=?;"
        cursor.execute(consulta, (user_id,))
        resultado = cursor.fetchone()
        return resultado


@app.route('/')
def homepage():
    return render_template('index.html')
           
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    try:
        # Login com o banco
        if get_login_from_database(username, password) == 1:
            # login bem-sucedido
            return jsonify({'success': True, 'message': 'Sign in successful'})
        else:
            # login falhou
            return jsonify({'success': False, 'message': 'Sign in failed'})
    except Exception as e:
        app.logger.error(f"An error occurred during signup: {e}")



@app.route('/cadastrar', methods=['POST'])
def cadastrar():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    try:
        # Cadastro no banco de dados
        if username_exists(username):
            return jsonify({'success': True, 'message' : 'Username ja cadastrado'})
        
        else:
            if get_signup_from_database(username, password):
                # Cadastro bem-sucedido
                return jsonify({'success': True, 'message': 'Signup successful'})
            else:
                # Cadastro falhou
                return jsonify({'success': False, 'message': 'Signup failed'})
    except Exception as e:
        app.logger.error(f"An error occurred during signup: {e}")



@app.route('/alterar', methods=['POST'])
def mudar():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    new_username = data.get('new_username')
    new_password = data.get('new_password')

    try:
            if username_exists(username):
                if get_update_from_database(username,password,new_username,new_password):
                    return jsonify({'success': True, 'message': 'Update successful'})
            else:
                return jsonify({'success': False, 'message': 'User not found'})
    except Exception as e:
        app.logger.error(f"An error occurred during user update: {e}")
       


@app.route('/deletar', methods=['POST'])
def deletar():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    try:
        # Verificar se o usuário existe
        with db_connection() as connection:
            cursor = connection.cursor()

            consulta1 = "SELECT id FROM usuario WHERE username=? AND password=?;"
            cursor.execute(consulta1, (username, password))
            result = cursor.fetchone()

            if result is not None:
                user_id = result[0]

                # Excluir o usuário com base no user_id
                consulta2 = "DELETE FROM usuario WHERE id=?;"
                cursor.execute(consulta2, (user_id,))

                connection.commit()
                app.logger.info(f"Deletion successful for username: {username}")
                return jsonify({'success': True, 'message': 'Deletion successful'})
            else:
                app.logger.warning(f"User not found for username: {username}")
                return jsonify({'success': False, 'message': 'User not found'})
    except Exception as e:
        app.logger.error(f"An error occurred during user deletion: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'})
    
@app.route('/pesquisar-capa', methods=['POST'])
def pesquisar_capa():
    data = request.get_json()
    book_title = data.get('book_title')
    api_key = "AIzaSyAUL35_JQ0zRA2Mk7sJ_i69WOOou20UDwo"

    cover_url = search_book_cover(book_title, api_key)

    if cover_url:
        return jsonify({'success': True, 'cover_url': cover_url})
    else:
        return jsonify({'success': False, 'message': f'Capa do livro "{book_title}" não encontrada.'})





if __name__ == '__main__':
    app.run(debug=True)
