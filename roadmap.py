from flask import Flask, render_template, jsonify, request
import sqlite3

app = Flask(__name__)

def db_connection():
    return sqlite3.connect('bancos.db')

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
        raise  # Adicione 'raise' para que o Flask imprima o traceback completo no console

if __name__ == '__main__':
    app.run(debug=True)
