import pyrebase
import json, os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import auth


class firebase:
    def __init__(self):
        # Firebase API キーの読み込み
        with open("FirebasePackage/firebaseConfig.json") as f:
            firebaseConfig = json.loads(f.read())
        self.firebase = pyrebase.initialize_app(firebaseConfig)
        
        # 認証用インスタンス
        self.auth1 = self.firebase.auth()

        # firebase_admin の初期設定
        cred = credentials.Certificate('FirebasePackage/serviceAccountKey.json')
        firebase_admin.initialize_app(cred)
        
        self.db = firestore.client()

    def Signup(self, name, email, password):
        print(name, email, password)
        try:
            user = auth.create_user(email=email, email_verified=False, password=password, display_name=name, disabled=False)
            data = {"name": user.display_name, "email": user.email, "post": 0, "follow": "", "follower": ""}
            self.db.collection("account_information").document(user.uid).set(data)
            self.db.collection("follow_information").document(user.uid).set({'follow_list': [], 'follower_list': []})
            return True, user
        except Exception as e:
            print(e)
            return False, e
    
    def Login(self, email, password):
        try:
            user = self.auth1.sign_in_with_email_and_password(email, password)
            return True,user
        except Exception as e:
            return False, e

        