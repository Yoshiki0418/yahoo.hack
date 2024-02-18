import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime


class create():
    base_dir = os.path.dirname(__file__)
    database = "sqlite:///" + os.path.join(base_dir, "data.sqlite")
    app.config["SQLALCHEMY_DATABASE_URI"] = database
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db = SQLAlchemy(app)
    Migrate(app, db)


class User(db.Model):
    __tablename__ = 'user'
    uid = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    closet_items = db.relationship('Closet', backref='owner', lazy=True)
    followers = db.relationship('Follower', foreign_keys='Follower.follower_uid', backref='follower', lazy=True)
    followed = db.relationship('Follower', foreign_keys='Follower.followed_uid', backref='followed', lazy=True)
    def __str__(self):
        return f'uif:{self.uid},User:{self.name},Email:{self.email},Closet:{self.closet_items},Followers:{self.followers},Followed:{self.followed}'

class Closet(db.Model):
    __tablename__ = 'closet'
    #必須のカラム
    id = db.Column(db.Integer, primary_key=True)
    user_uid = db.Column(db.Integer, db.ForeignKey('user.uid'), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    brand = db.Column(db.String(50))
    image = db.Column(db.String(100), nullable=False)
    style = db.Column(db.String(50), nullable=False)

    #オプションのカラム
    size = db.Column(db.String(50))
    price = db.Column(db.Float)
    purchase_date = db.Column(db.DateTime)
    note = db.Column(db.Text)

    def __str__(self):
        return f'id:{self.id},User:{self.user_uid},Category:{self.category},Color:{self.color},Brand:{self.brand},Season:{self.season},Size:{self.size},Price:{self.price},Purchase_date:{self.purchase_date},Image:{self.image},Note:{self.note}'

class Follower(db.Model):
    __tablename__ = 'follower'
    id = db.Column(db.Integer, primary_key=True)
    follower_uid = db.Column(db.Integer, db.ForeignKey('user.uid'), nullable=False)
    followed_uid = db.Column(db.Integer, db.ForeignKey('user.uid'), nullable=False)
    def __str__(self):
        return f'id:{self.id},Follower:{self.follower_uid},Followed:{self.followed_uid}'
    
def create_user(uid,name, email):
    with app.app_context():
        user = User(uid=uid, name=name, email=email)
        db.session.add(user)
        db.session.commit()
        return user

def create_closet(user_uid, category, brand, image, style, size=None, price=None, purchase_date=None, note=None):
    with app.app_context():
        closet = Closet(user_uid=user_uid, category=category, brand=brand, image=image, style=style, size=size, price=price, purchase_date=purchase_date, note=note)
        db.session.add(closet)
        db.session.commit()
        return closet

def create_follower(follower_uid, followed_uid):
    with app.app_context():
        follower = Follower(follower_uid=follower_uid, followed_uid=followed_uid)
        db.session.add(follower)
        db.session.commit()
        return follower







