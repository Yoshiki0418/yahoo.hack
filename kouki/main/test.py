from flask import Flask, redirect, render_template, request, session, url_for, jsonify
import pyrebase
import json, os
from Forms import login, sinUp  # フォームクラス名とモジュール名を修正

with open("firebaseConfig.json") as f:
    firebaseConfig = json.loads(f.read())
firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'  # 本番環境用の固定の秘密キーに変更

@app.route('/signup', methods=['GET', 'POST'])  # ルートのスペルを修正
def signup():
    form = sinUp()
    if form.validate_on_submit():
        email = form.email.data
        password = form.password.data
        try:
            auth.create_user_with_email_and_password(email, password)
            return redirect(url_for('login'))
        except:
            return render_template("signup.html", msg="アカウントの作成に失敗しました。", form=form)
    else:
        return render_template("signup.html", msg="", form=form)

@app.route('/login', methods=['GET', 'POST'])
def login_t():
    form = login()
    if form.validate_on_submit():
        email = form.email.data
        password = form.password.data
        try:
            user = auth.sign_in_with_email_and_password(email, password)
            session['usr'] = email  # セッションキーを 'usr' に統一
            return redirect(url_for('index'))  # 正しいリダイレクト方法に修正
        except:
            return render_template("login.html", msg="メールアドレスまたはパスワードが間違っています。", form=form)
    return render_template("login.html", msg="", form=form)
    
@app.route('/', methods=['GET'])
def index():
    if 'usr' not in session:  # セッションキーのチェックを修正
        return redirect(url_for('login_t'))  # ログインページへのリダイレクトを修正
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True, port=8080)
