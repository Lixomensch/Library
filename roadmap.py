from flask import Flask, render_template, jsonify, request, make_response
import requests
import sqlite3

app = Flask(__name__)

def db_connection():
    return sqlite3.connect('bancos.db')

# COMEÇO DAS FUNÇÕES DOS LIVROS  
def id_book(titulo):
    with db_connection() as connection:
        cursor = connection.cursor()
        consulta = "SELECT id FROM livros WHERE titulo=?"
        cursor.execute(consulta,(titulo))
        resultados = cursor.fetchall()
        if resultados:
            return resultados[0][0]
        return -1

def title_exists(titulo):
    with db_connection() as connection:
        cursor = connection.cursor()
        consulta = "SELECT * FROM livros WHERE titulo=?;"
        cursor.execute(consulta, (titulo,))
        resultados = cursor.fetchall()
        return len(resultados) > 0    

def include_book(titulo,capa):
    if title_exists(titulo):
        return False
    else:
        with db_connection() as connection:
            cursor = connection.cursor()
            consulta = "INSERT INTO livros (titulo,capa) VALUES (?, ?);"
            cursor.execute(consulta,(titulo,capa))
            connection.commit()
            return True
        
#def update_book(titulo,autor,new_titulo,new_autor):
#     with db_connection() as connection:
#        cursor = connection.cursor()
#
#        # Verificar se o livro existe
#        consulta_existencia = "SELECT id FROM livros WHERE titulo=? AND autor=?"
#        cursor.execute(consulta_existencia, (titulo, autor))
#        resultado = cursor.fetchone()
#
#        if resultado:
#            # O livro existe, então podemos atualizar
#            book_id = resultado[0]
#            consulta_atualizacao = "UPDATE livros SET titulo=?, autor=? WHERE id=?"
#            cursor.execute(consulta_atualizacao, (new_titulo, new_autor, book_id))
#            connection.commit()
#            return True
#        else:
#            return False
            
    
        
#def delete_book(titulo):
#    with db_connection() as connection:
#        cursor = connection.cursor()
#        resultado = cursor.fetchone()
#        consulta = "DELETE FROM livros WHERE id IN (SELECT id FROM livros WHERE titulo=?);"
#        cursor.execute(consulta,(titulo))
#        connection.commit()
       
# FIM DAS FUNÇÕES DOS LIVROS

# COMEÇO FUNÇÕES USUÁRIO  
def username_exists(username):
    with db_connection() as connection:
        cursor = connection.cursor()
        consulta = "SELECT * FROM usuario WHERE username=?;"
        cursor.execute(consulta, (username,))
        resultados = cursor.fetchall()
        return len(resultados) > 0

def id_username(username):
    with db_connection() as connection:
        cursor = connection.cursor()
        consulta = "SELECT id FROM usuario WHERE username=?"
        cursor.execute(consulta,(username))
        resultados = cursor.fetchall()
        if resultados:
            return resultados[0][0]
        return -1

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

def get_update_from_database(username,password,new_password):
    if username_exists(username):
        with db_connection() as connection:
            cursor = connection.cursor()
            resultado = cursor.fetchone()
            if resultado is not None:
                consulta = "UPDATE usuario SET password=? WHERE username=?;"
                cursor.execute(consulta,(new_password))
                connection.commit()
                return True
            else:
                return False

def delete_user_from_database(username,password):
    with db_connection() as connection:
        cursor = connection.cursor()
        resultado = cursor.fetchone()
        if resultado is not None:
            consulta2 = "DELETE FROM usuario WHERE username=? AND password=?;"
            cursor.execute(consulta2,(username,password))
            connection.commit()
            return True
        else:
            return False
# FIM DAS FUNÇÕES USUÁRIO

#COMEÇO DAS FUNÇÕES BIBLIOTECA

#funções da tabela livros_lidos:
def select_in_livros_lidos(username):
    user_id = id_username(username)
    if user_id != -1:
        with db_connection() as connection:
            cursor = connection.cursor()
            consulta = "SELECT * livros.titulo FROM livros_lidos JOIN livros ON livros_lidos.id_livro = livros.id WHERE livros_lidos.id_usuario = ?;"
            cursor.execute(consulta, (user_id))
            resultados = cursor.fetchall()
            if resultados:
                return resultados[0][0]
    return False

def add_livros_lidos(username, titulo,capa):
    if title_exists(titulo) == False:
        include_book(titulo,capa)
    user_id = id_username(username)
    livro_id = id_book(titulo)
    if user_id == -1:
        with db_connection() as connection:
            cursor = connection.cursor()
            consulta = "INSERT INTO livros_lidos (id_usuario,id_livro) VALUES (?, ?);"
            cursor.execute(consulta, (user_id, livro_id))
            connection.commit()
        return True
    return False

def remove_livros_lidos(username, titulo):
    user_id = id_username(username)
    livro_id = id_book(titulo)
    if user_id == -1:
        with db_connection() as connection:
            cursor = connection.cursor()
            consulta = "DELETE FROM livros_lidos WHERE id_usuario=? AND id_livro=?;"
            cursor.execute(consulta, (user_id, livro_id))
            connection.commit()
            return True
    else:
        return False      

#funções da tabela livros_lendo:
def select_in_livros_lendo(username):
    user_id = id_username(username)
    if user_id != -1:
        with db_connection() as connection:
            cursor = connection.cursor()
            consulta = "SELECT * livros.titulo FROM livros_lendo JOIN livros ON livros_lendo.id_livro = livros.id WHERE livros_lendo.id_usuario = ?;"
            cursor.execute(consulta, (user_id))
            resultados = cursor.fetchall()
            if resultados:
                return resultados[0][0]
    return False

def add_livros_lendo(username, titulo,capa):
    if title_exists(titulo) == False:
        include_book(titulo,capa)
    user_id = id_username(username)
    livro_id = id_book(titulo)
    if user_id == -1:
        with db_connection() as connection:
            cursor = connection.cursor()
            consulta = "INSERT INTO livros_lendo (id_usuario,id_livro) VALUES (?, ?);"
            cursor.execute(consulta, (user_id, livro_id))
            connection.commit()
        return True
    return False
        

def remove_livros_lendo(username, titulo):
    user_id = id_username(username)
    livro_id = id_book(titulo)
    if user_id == -1:
        with db_connection() as connection:
            cursor = connection.cursor()
            consulta = "DELETE FROM livros_lendo WHERE id_usuario=? AND id_livro=?;"
            cursor.execute(consulta, (user_id, livro_id))
            connection.commit()
            return True
    else:
        return False    

#funções livro_a_ler:
def select_in_livros_a_ler(username):
    user_id = id_username(username)
    if user_id != -1:
        with db_connection() as connection:
            cursor = connection.cursor()
            consulta = "SELECT * livros.titulo FROM livros_a_ler JOIN livros ON livros_a_ler.id_livro = livros.id WHERE livros_a_ler.id_usuario = ?;"
            cursor.execute(consulta, (user_id))
            resultados = cursor.fetchall()
            if resultados:
                return resultados[0][0]
    return False         

def add_livros_a_ler(username, titulo,capa):
    if title_exists(titulo) == False:
        include_book(titulo,capa)
    user_id = id_username(username)
    livro_id = id_book(titulo)
    if user_id == -1:
        with db_connection() as connection:
            cursor = connection.cursor()
            consulta = "INSERT INTO livros_a_ler (id_usuario,id_livro) VALUES (?, ?);"
            cursor.execute(consulta, (user_id, livro_id))
            connection.commit()
        return True
    return False
        
def remove_livros_a_ler(username, titulo):
    user_id = id_username(username)
    livro_id = id_book(titulo)
    if user_id == -1:
        with db_connection() as connection:
            cursor = connection.cursor()
            consulta = "DELETE FROM livros_a_ler WHERE id_usuario=? AND id_livro=?;"
            cursor.execute(consulta, (user_id, livro_id))
            connection.commit()
            return True
    else:
        return False           

#FINAL FUNÇÕES BIBLIOTECA


@app.route('/')
def homepage():
    return render_template('index.html')

@app.route('/main')
def main():
    html_content = render_template('main.html')

    response = make_response(html_content)
    response.mimetype = 'text/html'

    return response
           
@app.route('/login-usuario', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    username = username.lower()
    try:
        # Login com o banco
        if get_login_from_database(username, password):
            # login bem-sucedido
            return jsonify({'success': True, 'message': 'Sign in successful'})
        else:
            # login falhou
            return jsonify({'success': False, 'message': 'Sign in failed'})
    except Exception as e:
        app.logger.error(f"An error occurred during signup: {e}")



@app.route('/cadastrar-usuario', methods=['POST'])
def cadastrar():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    username = username.lower()
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



@app.route('/alterar-usuario', methods=['POST'])
def mudar():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    new_password = data.get('new_password')
    username = username.lower()
    try:
            if username_exists(username):
                get_update_from_database(username,password,new_password)
                return jsonify({'success': True, 'message': 'Update successful'})
            else:
                return jsonify({'success': False, 'message': 'User not found'})
    except Exception as e:
        app.logger.error(f"An error occurred during user update: {e}")
       


@app.route('/deletar-usuario', methods=['POST'])
def deletar():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    username = username.lower()
    try:
            if username_exists(username):
                delete_user_from_database(username,password)
                return jsonify({'success': True, 'message': 'Deletion successful'})
            else:
                return jsonify({'success': False, 'message': 'User not found'})
    except Exception as e:
        app.logger.error(f"An error occurred during user deletion: {e}")

@app.route('/set-Lendo',methods=['POST'])
def addLendo():
    data = request.get_json()



    
@app.route('/get-livros', methods=['POST'])
def all_livros():
    data = request.get_json()
    username = data.get('username')
    try:
        select_in_livros_a_ler(username)
        select_in_livros_lendo(username)
        select_in_livros_lidos(username)     
        return jsonify({'success': True,'message' : 'Book found'})
    except:
        return jsonify({'success': False, 'message': 'Books not found'})


if __name__ == '__main__':
    app.run(debug=True)
