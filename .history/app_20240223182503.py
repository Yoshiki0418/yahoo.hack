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
from video_cut import detect_and_crop_items_from_video
import re
from PIL import Image
from io import BytesIO
import requests



app = Flask(__name__)

app.config['SECRET_KEY'] = os.urandom(24)
base_dir = os.path.dirname(__file__)
database = "sqlite:///" + os.path.join(base_dir, "mainData.sqlite")
app.config["SQLALCHEMY_DATABASE_URI"] = database
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['UPLOAD_FOLDER'] = 'static/post_image/'
app.config['MAX_CONTENT_LENGTH'] = 64 * 1024 * 1024  # 16MB limit
db = SQLAlchemy(app)
Migrate(app, db)


FB = firebase()

#None判定
def changeNone(e):
    if e == 'none':
        return None
    return e

def initialize_styles():
    styles = ["ストリート系", "カジュアル系", "スポーツ系"]
    if Style.query.count() == 0:  # Style テーブルが空の場合のみ実行
        for style_name in styles:
            create_style(style_name)
    print("成功: initialize_styles")

# ルーティング
@app.route('/',methods=['GET'])
def welcome():
    initialize_styles()
    if 'usr' in session:
        closet = myCloset(session['usr'])
        # 他の情報と一緒にmy_closetも渡す
        return render_template('home.html', closet=closet)
    else:
        return render_template('welcome.html')
    
@app.route('/sinup', methods=['POST'])
def sinup():
    if request.method == "POST":
        _name = request.form['name']
        _username = request.form['username']
        _password = request.form['password']
        isFlag, usr = FB.Signup(name=_name, email=_username, password=_password)
        if isFlag:
            session["usr"] = usr.uid
            create_user(usr.uid, _name , _username,image='static/icon/default_icon.jpeg')
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
        mycloset = myCloset(session['usr'])
        similarStyle = SimilarStyle(session['usr'])
        like_style = myFavoriteStyle(session['usr'])
        postCloset = SimilarStylePostCloset(session['usr'])
        posts = SimilarStylePost(session['usr'])
        data = {}
        data['closet'] = mycloset

        


        post_details = []
        for post in posts:
            user = User.query.filter_by(uid=post.uid).first()
            if not user:
                continue  # ユーザーが見つからなければ次の投稿へ

            icon_image = user.iconImage  # ユーザーのアイコン画像を取得
            items_for_post = []
            total_price = 0

            post_closets = post.post_closet_items.all()  # この投稿に関連する全てのアイテムを取得
            for pc in post_closets:
                # スタイルIDを使ってスタイルの名前を取得
                style = Style.query.get(pc.style_id)
                style_name = style.style_name if style else 'Unknown Style'

                item_info = {
                    'image': pc.image,
                    'price': int(pc.price),
                    'style_name': style_name,
                    'brand': pc.brand,
                    'category': pc.category,
                    'url': pc.url
                }
                items_for_post.append(item_info)
                total_price += pc.price  # 合計価格にこのアイテムの価格を加算

            # 投稿の詳細情報をpost_detailsに追加
            post_details.append({
                'post_id': post.id,
                'icon': icon_image,  # ユーザーのアイコン画像
                'post_image': post.image,
                'items10': items_for_post,
                'style_name': style_name,
                'total_price': int(total_price)
            })

        print(f"私の好み:{posts}")
        
        return render_template('home.html', closet=mycloset,post_details=post_details) 
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
    if "usr" not in session:
        return redirect(url_for('welcome'))
    my_closet = myCloset(session['usr'])
    my_info = find_user(session['usr'])
    my_post = myPost(session["usr"])
    my_coordinate_list = []
    my_coordinate = myCoordinate(session['usr'])
    for coordinate in my_coordinate:
        items = coordinateItem(coordinate.id)
        my_coordinate_list.append(items)
    print(my_coordinate_list)
    return render_template('profile.html', my_closet=my_closet, my_info=my_info, my_post=my_post, iconImage=my_info.iconImage,my_coordinate_list=my_coordinate_list)  

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
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    user_id = session['usr']
    original_filename = secure_filename(file.filename)
    filename = f"{user_id}_{timestamp}_{original_filename}"
    
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

@app.route('/save-coordinate', methods=['POST'])
def save_coordinate():
    items = request.form.get('items')
    if items:
        items = json.loads(items)
        if not items:
            return jsonify({'status': 'error', 'message': 'No items received'})
        print(items)
        coordinate_id = create_coordinate(session['usr'], "テスト名", "テスト説明")
        for item in items:
            item_id = item['id']
            add_coordinate_item(coordinate_id=coordinate_id, closet_item_id=item_id)
        return jsonify({'status': 'success', 'message': 'Items added to coordinate'})
    else:
        return jsonify({'status': 'error', 'message': 'No items received'})



@app.route('/save-all-images', methods=['POST'])
def upload_all():
    if "usr" not in session:
        return redirect(url_for('welcome'))


    # 複数の画像と情報を処理
    files = request.files.to_dict(flat=False)  # ファイルを辞書形式で取得
    print(files)
    infos = request.form.to_dict(flat=False)  # 情報を辞書形式で取得
    print(infos)

    # filesとinfosからキーを取得し、それらが一致するか確認
    file_keys = [key for key in files if key.startswith('images[')]
    info_keys = [key for key in infos if key.startswith('infos[')]

    if not file_keys or not info_keys or len(file_keys) != len(info_keys):
        print("ファイルまたは情報が不足しています")
        return 'Invalid request', 400

    UPLOAD_FOLDER = 'static/post_image'

    for key in file_keys:
        file = request.files[key]  # 複数ファイル対応のための[0]
        filename = secure_filename(file.filename)
        info = request.form[key.replace('images', 'infos')]
        info_dict = json.loads(info)
        
        if('image-url'  not in info_dict):
            # アップロードされた画像を指定したディレクトリに保存
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)
            print("背景消去前の画像を使用します")
        else:
            file_path = info_dict['image-url']
            print("背景消去済みの画像を使用します")

        # データベースに保存する処理を呼び出す
        create_closet(user_uid=session['usr'], category=info_dict['系統'], brand=info_dict['ブランド'],style_id=info_dict['カテゴリー'], image=file_path, size=changeNone(info_dict['サイズ']), price=changeNone(info_dict['価格']), purchase_date=changeNone(info_dict['購入日']), note=changeNone(info_dict['思い出メモ']))

    print("全てのファイルが正常にアップロードされました")
    return jsonify({"message": "Files uploaded successfully"}), 200

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


def allowed_file(filename):
    # 許可するファイルの拡張子を定義
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# ユーザーテーブル
class User(db.Model):
    __tablename__ = 'user'
    uid = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    iconImage = db.Column(db.String(100), nullable=True)
    closet_items = db.relationship('Closet', backref='owner', lazy='dynamic')
    favorite_styles = db.relationship('Style', secondary='user_style_link', back_populates='users')
    post_closet_items = db.relationship('PsotCloset', backref='owner', lazy='dynamic')
    posts = db.relationship('Post', backref='owner', lazy='dynamic')
    coordinates = db.relationship('Coordinate', backref='owner', lazy='dynamic')
    
#Iconを変更する
@app.route('/upload-icon', methods=['POST'])
def changeIcon():
    if request.method == "POST":
        image = request.files['iconImage']
        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            UPLOAD_FOLDER = 'static/icon'
            image.save(os.path.join(UPLOAD_FOLDER, filename))
            add_imageIcon(session['usr'], f'static/icon/{filename}')
            return redirect(url_for('profile'))
    return redirect(url_for('profile'))
    

# 投稿テーブル
class Post(db.Model):
    __tablename__ = 'post'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(50), db.ForeignKey('user.uid'), nullable=False)
    image = db.Column(db.String(100), nullable=False)
    post_closet_items = db.relationship('PsotCloset', backref='post', lazy='dynamic')
    
   
# クローゼットテーブル
class Closet(db.Model):
    __tablename__ = 'closet'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(50), db.ForeignKey('user.uid'), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    brand = db.Column(db.String(50))
    image = db.Column(db.String(100), nullable=False)
    style_id = db.Column(db.Integer, db.ForeignKey('style.id'), nullable=True)
    style = db.relationship('Style', back_populates='closet_items',uselist=False)
    #オプションのカラム
    size = db.Column(db.String(50))
    price = db.Column(db.Float)
    purchase_date = db.Column(db.DateTime)
    note = db.Column(db.Text)
    coordinates = db.relationship('Coordinate', secondary='coordinate_items', back_populates='items')


# 投稿クローゼットテーブル
class PsotCloset(db.Model):
    __tablename__ = 'post_closet'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(50), db.ForeignKey('user.uid'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    image = db.Column(db.String(100), nullable=False)
    url = db.Column(db.String(100))
    style_id = db.Column(db.Integer, db.ForeignKey('style.id'), nullable=True)
    style = db.relationship('Style', back_populates='post_closet_items',uselist=False)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50))
    brand = db.Column(db.String(50))
    

#コーディネートテーブル
class Coordinate(db.Model):
    __tablename__ = 'coordinate'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(50), db.ForeignKey('user.uid'), nullable=False)
    continue_name = db.Column(db.String(50))
    description = db.Column(db.Text)
    items = db.relationship('Closet', secondary='coordinate_items', back_populates='coordinates')
    
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
    # PostCloset とのリレーションシップを直接の1対多の関係に変更
    post_closet_items = db.relationship('PsotCloset', back_populates = 'style', lazy='dynamic')

# ユーザーとスタイルの中間テーブル
user_style_link = db.Table('user_style_link',
    db.Column('user_id', db.String(50), db.ForeignKey('user.uid', name='fk_user_style_user_id'), primary_key=True),
    db.Column('style_id', db.String(50), db.ForeignKey('style.id', name='fk_user_style_style_id'), primary_key=True)
)

# クローゼットとコーディネートの中間テーブル
coordinate_items = db.Table('coordinate_items',
    db.Column('coordinate_id', db.Integer, db.ForeignKey('coordinate.id'), primary_key=True),
    db.Column('closet_item_id', db.Integer, db.ForeignKey('closet.id'), primary_key=True)
)


#ユーザーの作成    
def create_user(uid, name, email, image):
    with app.app_context():
        user = User(uid=uid, name=name, email=email, iconImage=image)
        db.session.add(user)
        db.session.commit()
    print("成功: create_user")
    

#ユーザーのIconを変更
def add_imageIcon(uid, image):
    with app.app_context():
        user = User.query.filter_by(uid=uid).first()
        user.iconImage = image
        db.session.commit()
    print("成功: add_imageIcon")

#クローゼットの作成
def create_closet(user_uid, category, brand, style_id,image, size, price, purchase_date, note):
    with app.app_context():
        if purchase_date != None:
            purchase_date = datetime.strptime(purchase_date, '%Y-%m-%d')
        closet = Closet(uid=user_uid, category=category,style_id = style_id, brand=brand, image=image, size=size, price=price, purchase_date=purchase_date, note=note)
        db.session.add(closet)
        db.session.commit()
        print("成功: create_closet")
        return closet.id
    
#投稿の作成      
def create_post(uid, image):
    with app.app_context():
        post = Post(uid=uid, image=image)
        db.session.add(post)
        db.session.commit()
        print("成功: create_post")
        return post.id
    
#投稿クローゼットの作成
def create_post_closet(user_uid, post_id, image, url, style_id, price, brand, category):
    with app.app_context():
        post_closet = PsotCloset(uid=user_uid, post_id=post_id, image=image, url=url, style_id=style_id, price=price, brand=brand, category=category)
        db.session.add(post_closet)
        db.session.commit()
        print("成功: create_post_closet")
        return post_closet.id
    
#コーディネートの作成
def create_coordinate(user_uid, continue_name, description):
    with app.app_context():
        coordinate = Coordinate(uid=user_uid, continue_name=continue_name, description=description)
        db.session.add(coordinate)
        db.session.commit()
        print("成功: create_coordinate")
        return coordinate.id

#コーディネートのアイテムを追加
def add_coordinate_item(coordinate_id, closet_item_id):
    with app.app_context():
        coordinate = Coordinate.query.filter_by(id=coordinate_id).first()
        closet_item = Closet.query.filter_by(id=closet_item_id).first()
        if coordinate and closet_item:
            coordinate.items.append(closet_item)
            try:
                db.session.commit()
                print("成功: add_coordinate_item")
                return True
            except Exception as e:
                db.session.rollback()
                print(e)
                return False
        else:
            return False
    

#フォロワーの作成
def create_follower(follower_uid, followed_uid):
    with app.app_context():
        follower = Follower(follower_uid=follower_uid, followed_uid=followed_uid)
        db.session.add(follower)
        db.session.commit()
    print("成功: create_follower")


#スタイルの作成   
def create_style(style_name):
    with app.app_context():
        style = Style(style_name=style_name)
        db.session.add(style)
        db.session.commit()
    print("成功: create_style")

#ユーザーとスタイルのリンクの作成
def add_user_style_link(user_id, style_name):
    with app.app_context():
        style = Style.query.filter_by(style_name=style_name).first()
        stmt = user_style_link.insert().values(user_id=user_id, style_id=style.id)
        db.session.execute(stmt)
        db.session.commit()
    print("成功: add_user_style_link")

def add_coordinate_item(coordinate_id, closet_item_id):
    coordinate = Coordinate.query.filter_by(id=coordinate_id).first()
    closet_item = Closet.query.filter_by(id=closet_item_id).first()
    if coordinate and closet_item:
        coordinate.items.append(closet_item)
        try:
            db.session.commit()
            print("成功: add_coordinate_item")
            return True
        except Exception as e:
            db.session.rollback()
            print(e)
            return False
    else:
        return False

    
#スタイルのIDを取得
def find_style_id(style_name):
    with app.app_context():
        style = Style.query.filter_by(style_name=style_name).first()
        print(style)
    return style.id

#自分の情報を取得
def find_user(uid):
    with app.app_context():
        user = User.query.filter_by(uid=uid).first()
    return user

#自分のクローゼットを取得
def myCloset(uid):
    with app.app_context():
        print("自分の服を取得する")
        closet = Closet.query.filter_by(uid=uid).all()
        print(closet)
    return closet

#自分の好きなスタイルを取得
def myFavoriteStyle(uid):
    with app.app_context():
        print("自分の好きなスタイルを取得する")
        style = User.query.filter_by(uid=uid).first().favorite_styles
        if style:
            print(style)
            return style
    return "ない"

#自分の投稿を取得
def myPost(uid):
    with app.app_context():
        print("自分の投稿を取得する")
        post = Post.query.filter_by(uid=uid).all()
    return post

#他のユーザーのクローゼットを取得
def atherCloset(uid):
    with app.app_context():
        print("他人の服を取得する")
        closet = Closet.query.filter(Closet.uid != uid).all()
    return closet

#他のユーザーの投稿を取得
def atherPost(uid):
    with app.app_context():
        print("他人の投稿を取得する")
        post = Post.query.filter(Post.uid != uid).all()
    return post

#クローゼットのアイテムを消す
def DeleteCloset(id):
    with app.app_context():
        print("服を削除する")
        closet = Closet.query.filter_by(id=id).first()
        db.session.delete(closet)
        db.session.commit()
    return

#投稿のアイテムを消す
def DeletePost(id):
    with app.app_context():
        print("投稿を削除する")
        post = Post.query.filter_by(id=id).first()
        db.session.delete(post)
        db.session.commit()
    return

# 同じスタイルを共有するユーザーのクローゼットアイテムを取得
def SimilarStyle(current_user_id):
    closet_items_from_similar_style_users = Closet.query.join(User, Closet.uid == User.uid)\
    .join(user_style_link, User.uid == user_style_link.c.user_id)\
    .join(Style, user_style_link.c.style_id == Style.id)\
    .filter(Style.id.in_(
        db.session.query(user_style_link.c.style_id)
        .filter(user_style_link.c.user_id == current_user_id)
    ))\
    .filter(Closet.uid != current_user_id)\
    .all()
    return closet_items_from_similar_style_users


# 同じスタイルを共有するユーザーの投稿したクローゼットを取得
def SimilarStylePostCloset(current_user_id):
    like_style =  myFavoriteStyle(current_user_id)
    postscloset = []
    for style in like_style:
        postscloset += PsotCloset.query.filter_by(style_id=style.id).all()
    return postscloset

#同じスタイルを共有するユーザーの投稿を取得
def SimilarStylePost(current_user_id):
    postscloset = SimilarStylePostCloset(current_user_id)
    posts = set()
    for post_closet in postscloset:
        if Post.query.filter(Post.id==post_closet.post_id).filter(Post.uid != current_user_id).first():
            posts.add(Post.query.filter(Post.id==post_closet.post_id).filter(Post.uid != current_user_id).first())
    return posts

#投稿の詳細を取得
def postDetail(post_id):
    with app.app_context():
        print("投稿の詳細を取得する")
        post_items = PsotCloset.query.filter_by(post_id=post_id).all()
    return post_items

#自分のコーディネートを取得
def myCoordinate(uid):
    with app.app_context():
        print("自分のコーディネートを取得する")
        coordinate = Coordinate.query.filter_by(uid=uid).all()
        return coordinate

#コーディネートのsアイテムを取得
def coordinateItem(coordinate_id):
    with app.app_context():
        print("コーディネートのアイテムを取得する")
        items = Closet.query.join(coordinate_items, Closet.id == coordinate_items.c.closet_item_id)\
        .filter(coordinate_items.c.coordinate_id == coordinate_id).all()
        return items
    

    


# アップロードした画像・動画を自動で切り取る関数
@app.route('/ai-cuter', methods=['POST'])
def ai_cuter():
    # アップロードされたファイルを保存するディレクトリのパス
    UPLOAD_FOLDER_IMAGE = 'static/post_image/image'
    UPLOAD_FOLDER_VIDEO = 'static/post_image/video'
    app.config['UPLOAD_FOLDER_IMAGE'] = UPLOAD_FOLDER_IMAGE
    app.config['UPLOAD_FOLDER_VIDEO'] = UPLOAD_FOLDER_VIDEO
    
    if 'file' not in request.files:
        return jsonify({'error': 'ファイルがありません'}), 400
    
    file = request.files['file']
    media_type = request.form.get('mediaType')
    
    if file.filename == '':
        return jsonify({'error': 'ファイルが選択されていません'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        
        # 画像処理のコード
        if media_type == 'image':
            file.save(os.path.join(app.config['UPLOAD_FOLDER_IMAGE'], filename))
            item_images = detect_and_crop_items(f"static/post_image/image/{filename}", filename)

            # 画像パスをカテゴリごとに整理
            items_dict = {}

            # 送信したくないカテゴリを指定
            excluded_categories = ['skirt.png',"cort.png","one_piece.png"]

            for item_image in item_images:
                # ファイル名とカテゴリを分離
                path, category = item_image.split(':')
                if category not in excluded_categories:
                    items_dict[category] = item_image
            # 処理結果を格納したitems_dictをJSON形式で返す
            return jsonify(items_dict)
        # 動画処理のコード
        elif media_type == 'video':
            file.save(os.path.join(app.config['UPLOAD_FOLDER_VIDEO'], filename))
            item_images = detect_and_crop_items_from_video(f"static/post_image/video/{filename}", filename)

            # 画像パスをカテゴリごとに整理
            items_dict = {}

            # 送信したくないカテゴリを指定
            excluded_categories = ['skirt.png',"cort.png","one_piece.png"]
            
            # カテゴリごとのアイテムカウンターと既に見た画像を保持する辞書とセット
            category_counters = {}
            seen_images = set()

            for item_image in item_images:
                # ファイル名とカテゴリを分離
                path, category = item_image.split(':')
                if category not in excluded_categories and item_image not in seen_images:
                    # 画像が既に処理されていないことを確認
                    seen_images.add(item_image)  # 処理した画像に追加

                    # カテゴリに対するカウンターを取得または初期化
                    if category in category_counters:
                        category_counters[category] += 1
                    else:
                        category_counters[category] = 1

                    # カテゴリ名にカウンターを追加してユニークなキーを生成
                    key_name = f"{category}{'' if category_counters[category] == 1 else category_counters[category]}"
                    items_dict[key_name] = item_image
            # 処理結果を格納したitems_dictをJSON形式で返す
            print(items_dict)
            return jsonify(items_dict)
            
           
        else:
            return jsonify({'error': '不正なメディアタイプです'}), 400
    
    return jsonify({'error': '許可されていないファイルタイプです'}), 400

def allowed_file(filename):
    # 許可するファイルの拡張子を定義
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/post-file', methods=['POST'])
def post_file():
    # コーディネートの画像・動画の処理
    media_type = request.form.get('mediaType')
    uploaded_media = request.files.get('uploadedMedia')

    if uploaded_media:
        filename = uploaded_media.filename
        # 保存先のパスを設定
        save_path = os.path.join('static/post', filename)
        # ファイルを保存
        uploaded_media.save(save_path)
        print(f'Media saved to {save_path}')
    else:
        print('No media uploaded')
          
    post_id =create_post(session['usr'], save_path)

    # 各アイテムの情報の処理
    items_data = []
    item_pattern = re.compile(r'items\[(\d+)\]\[(\w+)\]')
    for key, value in request.form.items():
        match = item_pattern.match(key)
        if match:
            index, field = match.groups()
            index = int(index)  # 文字列から整数へ正しく変換
            if len(items_data) <= index:
                items_data.append({})
            items_data[index][field] = value

    for item in items_data:
        print('Item data:', item)
        create_post_closet(session['usr'], post_id, item['imageSrc'], item['sellerUrl'], item['style'], item['price'], item['brand'],item['category'])
        # ここで各アイテムのデータ（imageSrc, price, style, category, brand, sellerUrl）を処理できます

    return jsonify({'status': 'success', 'message': 'Data uploaded successfully'})

@app.route('/make_code', methods=['POST'])
def make_code():
    # JSONデータを取得
    images_data = request.get_json()

    print(images_data)

    # 処理した画像を保存する配列
    processed_images = []

    for image_data in images_data:
        # URLから画像をダウンロード
        response = requests.get(image_data['path'])
        response.raise_for_status()  # エラーレスポンスがある場合は例外を発生させる

        # ダウンロードした画像データからPillowのImageオブジェクトを作成
        img = Image.open(BytesIO(response.content))

         # 処理した画像をリストに追加
        processed_images.append(img)
    
    # 合成画像を作成する関数を呼び出す
    result_image = compose_images(images_data)
    
    # ここでresult_imageをファイルに保存したり、クライアントに送り返したりする
    # 以下は保存例
    result_image.save('result.png')

    # 応答をクライアントに送信
    return jsonify({'status': 'success', 'message': 'Images composed successfully.'})

def compose_images(images_data):
    # 画像合成のロジックをここに実装
    # 仮の背景画像を作成（実際の環境に応じてサイズは変更する）
    width, height = 800, 600  # このサイズは適宜調整してください。
    background = Image.new('RGBA', (width, height), (255, 255, 255, 0))

    for image_data in images_data:
        # 画像ファイルのパスは、実際の環境に合わせて設定する必要があります。
        img = Image.open(image_data['path'])
        # 画像を正しい位置に配置します
        background.paste(img, (int(image_data['x']), int(image_data['y'])), img)

    return background


    
if __name__ == '__main__':
    app.run(debug=True,port=8080) 