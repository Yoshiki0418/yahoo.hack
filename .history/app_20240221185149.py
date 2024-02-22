from flask import Flask,redirect,render_template,request,session,url_for,jsonify,send_file
from Forms import login,sinUp
from  FirebasePackage.Firebase import firebase
import os
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
from werkzeug.utils import secure_filename #新たに追加
from transparency import transparency
import json
from image_cut import detect_and_crop_items


app = Flask(__name__)

app.config['SECRET_KEY'] = os.urandom(24)
base_dir = os.path.dirname(__file__)
database = "sqlite:///" + os.path.join(base_dir, "mainData.sqlite")
app.config["SQLALCHEMY_DATABASE_URI"] = database
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
Migrate(app, db)

FB = firebase()

#None判定
def changeNone(e):
    if e == 'none':
        return None
    return e

# ルーティング
@app.route('/',methods=['GET'])
def welcome():
    #スタイルの初期化用
    """create_style("ストリート系")
    create_style("カジュアル系")
    create_style("スポーツ系")"""
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
            session["usr"] = usr.uid
            create_user(usr.uid, "藤季光樹" , _username)
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
            session['usr'] = usr['localId']
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
    if "usr" not in session:
        return redirect(url_for('welcome'))
    return render_template('Introduction.html')

@app.route('/introduction2')
def introduction2():
    if "usr" not in session:
        return redirect(url_for('welcome'))
    return render_template('Introduction2.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')  

@app.route('/save-preference', methods=['POST'])
def save_preference():
    if "usr" not in session:
        return redirect(url_for('welcome'))
    data = request.get_json()
    category = data['category']
    preference = data['preference']
    # ユーザーの好みを保存
    if preference == "LIKE":
        add_user_style_link(session['usr'], category)
        return jsonify({'status': 'successLike'})
    return jsonify({'status': 'success'})

@app.route('/remove-background', methods=['POST'])
def remove_background():
    if 'image' not in request.files:
        return 'No file part', 400
    file = request.files['image']
    filename = secure_filename(file.filename)

    UPLOAD_FOLDER = 'static/upload_image'

    # アップロードされた画像を指定したディレクトリに保存
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    # 背景削除処理
    processed_image_path = transparency(file_path,file_path)
    
     # 処理結果をクライアントに返す
    response_data = {
        'message': 'File uploaded successfully',
        'file_path': file_path
    }

    return jsonify(response_data), 200

@app.route('/save-image', methods=['POST'])
def upload():
    if "usr" not in session:
        return redirect(url_for('welcome'))
    if 'image' not in request.files or 'info' not in request.form:
        print("ファイルがありません")
        return 'No file part', 400
    
    file = request.files['image']
    filename = secure_filename(file.filename)
    info = request.form.get('info')
    info_dict = json.loads(info)
    UPLOAD_FOLDER = 'static/post_image'
    # アップロードされた画像を指定したディレクトリに保存
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    
    # データベースに保存
    create_closet(user_uid=session['usr'], category=info_dict['系統'], brand=info_dict['ブランド'],style_id= info_dict['カテゴリー'] ,image=file_path, size=changeNone(info_dict['サイズ']), price=changeNone(info_dict['価格']),purchase_date=changeNone(info_dict['購入日']), note=changeNone(info_dict['思い出メモ']))
    print("ファイルが正常にアップロードされました")
    return jsonify({'message': 'ファイルが正常にアップロードされました','info': info}), 200


#データベース
@app.route('/upload', methods=['POST'])
def upload_file():
    image = request.files['image']  # 画像データの受け取り
    print(image)
    # 入力フィールドのデータを受け取る
    field_data = {key: request.form[key] for key in request.form.keys()}
    # ここでファイルの保存やデータの処理を行う
    # 処理結果をJSONで返す
    return jsonify({'message': 'ファイルを受け取りました', 'field_data': field_data})

def changeNone(e):
    if e == 'none':
        return None
    return e



# ユーザーテーブル
class User(db.Model):
    __tablename__ = 'user'
    uid = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    closet_items = db.relationship('Closet', backref='owner', lazy='dynamic')
    favorite_styles = db.relationship('Style', secondary='user_style_link', back_populates='users')

# クローゼットテーブル
class Closet(db.Model):
    __tablename__ = 'closet'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(50), db.ForeignKey('user.uid'), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    brand = db.Column(db.String(50))
    image = db.Column(db.String(100), nullable=False)
    style_id = db.Column(db.Integer, db.ForeignKey('style.id'), nullable=True)
    style = db.relationship('Style', backref='closets')
    #オプションのカラム
    size = db.Column(db.String(50))
    price = db.Column(db.Float)
    purchase_date = db.Column(db.DateTime)
    note = db.Column(db.Text)

# フォロワーテーブル
class Follower(db.Model):
    __tablename__ = 'follower'
    id = db.Column(db.Integer, primary_key=True)
    follower_uid = db.Column(db.String(50), db.ForeignKey('user.uid'), nullable=False)
    followed_uid = db.Column(db.String(50), db.ForeignKey('user.uid'), nullable=False)

# スタイルテーブル
class Style(db.Model):
    __tablename__ = 'style'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    style_name = db.Column(db.String(50), nullable=False, unique=True)
    # User との多対多のリレーションシップはそのまま維持
    users = db.relationship('User', secondary='user_style_link', back_populates='favorite_styles')
    # Closet とのリレーションシップを直接の1対多の関係に変更
    closet_items = db.relationship('Closet', back_populates = 'style', lazy='dynamic')

# ユーザーとスタイルの中間テーブル
user_style_link = db.Table('user_style_link',
    db.Column('user_id', db.String(50), db.ForeignKey('user.uid', name='fk_user_style_user_id'), primary_key=True),
    db.Column('style_id', db.String(50), db.ForeignKey('style.id', name='fk_user_style_style_id'), primary_key=True)
)
    
def create_user(uid, name, email):
    with app.app_context():
        user = User(uid=uid, name=name, email=email)
        db.session.add(user)
        db.session.commit()
    print("成功: create_user")

def create_closet(user_uid, category, brand, style_id,image, size, price, purchase_date, note):
    with app.app_context():
        if purchase_date != None:
            purchase_date = datetime.strptime(purchase_date, '%Y-%m-%d')
        closet = Closet(uid=user_uid, category=category,style_id = style_id, brand=brand, image=image, size=size, price=price, purchase_date=purchase_date, note=note)
        db.session.add(closet)
        db.session.commit()
        closet_id = closet.id
    return 

def create_follower(follower_uid, followed_uid):

    with app.app_context():
        follower = Follower(follower_uid=follower_uid, followed_uid=followed_uid)
        db.session.add(follower)
        db.session.commit()
    print("成功: create_follower")
    
def create_style(style_name):
    with app.app_context():
        style = Style(style_name=style_name)
        db.session.add(style)
        db.session.commit()
    print("成功: create_style")

def add_user_style_link(user_id, style_name):
    with app.app_context():
        style = Style.query.filter_by(style_name=style_name).first()
        stmt = user_style_link.insert().values(user_id=user_id, style_id=style.id)
        db.session.execute(stmt)
        db.session.commit()
    print("成功: add_user_style_link")

def find_style_id(style_name):
    with app.app_context():
        style = Style.query.filter_by(style_name=style_name).first()
        print(style)
    return style.id


def myCloset(uid):
    with app.app_context():
        print("自分の服を取得する")
        closet = Closet.query.filter_by(uid=uid).all()
    return closet

def myFavoriteStyle(uid):
    with app.app_context():
        print("自分の好きなスタイルを取得する")
        style = User.query.filter_by(uid=uid).first().favorite_styles
    return style


# アップロードした画像・動画を自動で切り取る関数
@app.route('/ai-cuter', methods=['POST'])
def ai_cuter():
    # リクエストからデータを取得
    media_type = request.form.get('mediaType')
    media_src = request.form.get('mediaSrc')
    UPLOAD_FOLDER = 'static/post_image'

    # ここでAI処理など、必要な処理を実行
    # 例として、単に受け取ったデータをそのまま返す
    response_data = {
        'message': 'メディアを受け取りました',
        'mediaType': media_type,
        'mediaSrc': media_src
    }

    return jsonify(response_data)







if __name__ == '__main__':
    app.run(debug=True)