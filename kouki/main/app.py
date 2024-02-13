from flask import Flask,redirect,render_template,request,session,url_for,jsonify
import pyrebase
import json, os
from Forms import login,sinUp
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import auth


with open("firebaseConfig.json") as f:
    firebaseConfig = json.loads(f.read())
firebase = pyrebase.initialize_app(firebaseConfig)
auth1 = firebase.auth()

## Firebase Admin SDKの初期化
cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred)

#firestore
db = firestore.client()




app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)

@app.route('/sinUp',methods=['GET','POST'])
def sinup_t():
    form = sinUp()
    #POST
    if form.validate_on_submit():
        name = form.name.data
        email = form.email.data
        password = form.password.data
        try:
            user = auth.create_user(email=email,email_verified=False,password=password,display_name=name,disabled=False)
            data = {"name": user.display_name, "email": user.email,"post":0,"follow":"","follower":""}
            db.collection("account_information").document(user.uid).set(data)
            db.collection("follow_information").document(user.uid).set({'follow_list':[],'follower_list':[]})
            return redirect(url_for('login_t'))
        except Exception as e:
            return render_template("sinup.html", msg=e,form=form)
    #GET
    else:
        if 'usr' in session:
            return redirect(url_for('index'))
        return render_template("sinup.html", msg="",form=form)
    
    
@app.route('/login',methods=['GET','POST'])
def login_t():
    form = login()
    if form.validate_on_submit():
        email = form.email.data
        password = form.password.data
    else:
        return render_template("login.html",msg="",form=form)
    try:
        user = auth1.sign_in_with_email_and_password(email, password)
        data = user
        local_id = data['localId']
        display_name = data['displayName']
        session['usr'] = local_id
        print(session['usr'])
        session['name'] = display_name
        return redirect(url_for('index'))
    except Exception as e:
        print(e)
        return render_template("login.html", msg = e,form=form)
    
@app.route('/',methods=['GET'])
def index():
    if ('usr' not in session):
        return redirect(url_for('login_t'))
    return render_template('index.html',usr= session['usr'],msg=session['name'])


@app.route('/logout')
def logout():
    session.pop('usr', None)
    return redirect(url_for('login_t'))

@app.route('/list',methods=['GET','POST'])
def show_list():
    if ('usr' not in session):
        return redirect(url_for('login_t'))
    data = db.collection('account_information')
    docs = data.stream()
    doc_data_dict = {}
    for doc in docs:
        doc_data_dict[doc.id] = doc.to_dict()
    return render_template('list.html',list=doc_data_dict)


def follow(my_uuid,you_uuid):
    try:
        doc_ref = db.collection("follow_information").document(my_uuid)
        doc_ref.update({'follow_list':firestore.ArrayUnion([you_uuid])})
        return 
    except Exception as e:
        return print(e)

def follower(my_uuid,you_uuid):
    try:
        doc_ref = db.collection("follow_information").document(my_uuid)
        doc_ref.update({'follower_list':firestore.ArrayUnion([you_uuid])})
        return 
    except Exception as e:
        return print(e)
    return

follow('rsDZqa6BMFb35Lk34Hwic5qufS13','WUBkXL1zH7QxllFoxTjK850dyym')

# run the app.
if __name__ == "__main__":
    app.debug = True
    app.run(port=8080)