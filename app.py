from flask import Flask,redirect,render_template,request,session,url_for,jsonify
from Forms import login,sinUp
from  FirebasePackage.Firebase import firebase
import sqlite3
import os


app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)

FB = firebase()


@app.route('/',methods=['GET'])
def welcome():
    if 'usr' in session:
        return redirect(url_for('home'))
    else:
        return render_template('welcome.html')

@app.route('/sinup', methods=['POST'])
def sinup():
    if request.method == "POST":
        _username = request.form['username']
        _password = request.form['password']
        isFlag, usr = FB.Signup(name="藤季", email=_username, password=_password)
        if isFlag:
            session["usr"] = _username
            return redirect(url_for('Introduction'))
        else:
            return render_template('welcome.html', sinup_failed=not isFlag, sinup_error=usr)
    else:
        return render_template('welcome.html')
    
@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        _username = request.form['username']
        _password = request.form['password']
        isFlag, usr = FB.Login(email=_username, password=_password)
        if isFlag:
            session['usr'] = _username
            return redirect(url_for('home'))
        else:
            return render_template('welcome.html', login_failed = not isFlag ,login_error='ユーザ名またはパスワードが間違っています')
    else:
        return render_template('welcome.html')

@app.route('/logout')
def logout():
    session.pop('usr', None)
    return redirect(url_for('welcome'))

@app.route('/home')
def home():
    if "usr" in session:
        return render_template('home.html')
    else:
        return render_template('welcome.html')

@app.route('/introduction')
def Introduction():
    return render_template('Introduction.html')

@app.route('/introduction2')
def introduction2():
    return render_template('Introduction2.html')

@app.route('/save-preference', methods=['POST'])
def save_preference():
    data = request.get_json()
    category = data['category']
    preference = data['preference']
    
    # ここでデータベースに接続し、データを保存
    conn = sqlite3.connect('preferences.db')
    c = conn.cursor()
    c.execute("CREATE TABLE IF NOT EXISTS preferences (id INTEGER PRIMARY KEY, category TEXT, preference TEXT)")
    c.execute("INSERT INTO preferences (category, preference) VALUES (?, ?)", (category, preference))
    conn.commit()
    conn.close()

    return jsonify({'status': 'success'})



if __name__ == '__main__':
    app.run(debug=True)

