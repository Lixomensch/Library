from flask import Flask, render_template, jsonify, request
import requests
import sqlite3

app = Flask(__name__)

def db_connection():
    return sqlite3.connect('bancos.db')


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


def username_exists(username):
    with db_connection() as connection:
        cursor = connection.cursor()
        consulta = "SELECT * FROM usuario WHERE username=?;"
        cursor.execute(consulta, (username,))
        resultados = cursor.fetchall()
        return len(resultados) > 0

def get_login_from_database(username, password):
    app.logger.info(f"Checking login for username: {username}, password: {password}")
    
    with db_connection() as connection:
        cursor = connection.cursor()
        consulta = "SELECT * FROM usuario WHERE username=? AND password=?;"
        cursor.execute(consulta, (username, password))
        resultados = cursor.fetchall()

        if resultados:
            app.logger.info("Login successful")
            return True  # Login bem-sucedido
        else:
            app.logger.warning("Login failed")
            return False  # Login falhou
    
def get_signup_from_database(username, password):
    if username_exists(username):
        return False  # Nome de usuário já existe, cadastro falhado
    else:
        with db_connection() as connection:
            cursor = connection.cursor()
            consulta = "INSERT INTO usuario (username,password) VALUES (?, ?);"
            cursor.execute(consulta, (username, password))
            connection.commit()
            return True  # Cadastro bem-sucedido

def get_update_from_database(username,password,new_username,_new_password):
    with db_connection() as connection:
        cursor = connection.cursor()
        consulta1 = "SELECT id FROM usuario WHERE username=? AND password=?;"
        cursor.execute(consulta1,(username,password))
        resultado = cursor.fetchone()
        if resultado is not None:
            user_id = resultado[0]
            consulta2 = "UPDATE usuario SET username=?, password=? WHERE id=?;"
            cursor.execute(consulta2,(new_username,_new_password,user_id))
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



@app.route('/', methods=['GET', 'POST'])
def homepage():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        app.logger.info(f"Received login request for username: {username}")

        # Verificação real no banco de dados
        if get_login_from_database(username, password):
            # Login bem-sucedido
            app.logger.info(f"Login successful for username: {username}")
            return jsonify({'success': True, 'message': 'Login successful'})
        else:
            # Login falhou
            app.logger.warning(f"Login failed for username: {username}")
            return jsonify({'success': False, 'message': 'Login failed'})
    else:
        return render_template('site.html')
           
    

@app.route('/cadastro')
def cadastro():
    return render_template('cadastro.html')

@app.route('/cadastrar', methods=['POST'])
def cadastrar():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    app.logger.info(f"Received signup request for username: {username}")

    try:
        # Cadastro no banco de dados
        if get_signup_from_database(username, password):
            # Cadastro bem-sucedido
            app.logger.info(f"Signup successful for username: {username}")
            return jsonify({'success': True, 'message': 'Signup successful'})
        else:
            # Cadastro falhou
            app.logger.warning(f"Signup failed for username: {username}")
            return jsonify({'success': False, 'message': 'Signup failed'})
    except Exception as e:
        app.logger.error(f"An error occurred during signup: {e}")

@app.route('/update')
def alterar():
    return render_template('update.html')

@app.route('/alterar', methods=['POST'])
def mudar():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    new_username = data.get('new_username')
    new_password = data.get('new_password')

    app.logger.info(f"Received update request for username: {username}")

    try:
        # Verificar se o usuário existe
        with db_connection() as connection:
            cursor = connection.cursor()
            
            consulta1 = "SELECT id FROM usuario WHERE username=? AND password=?;"
            cursor.execute(consulta1, (username, password))
            result = cursor.fetchone()

            if result is not None:
                user_id = result[0]

                # Atualizar o username e a password para o usuário com o user_id fornecido
                consulta2 = "UPDATE usuario SET username=?, password=? WHERE id=?;"
                cursor.execute(consulta2, (new_username, new_password, user_id))

                connection.commit()
                app.logger.info(f"Update successful for username: {username}")
                return jsonify({'success': True, 'message': 'Update successful'})
            else:
                app.logger.warning(f"User not found for username: {username}")
                return jsonify({'success': False, 'message': 'User not found'})
    except Exception as e:
        app.logger.error(f"An error occurred during user update: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'})
       
@app.route('/delete')
def delete():
    render_template('delete.html')

@app.route('/deletar', methods=['POST'])
def deletar():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    app.logger.info(f"Received delete request for username: {username}")

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
