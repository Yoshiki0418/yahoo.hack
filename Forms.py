from flask_wtf import FlaskForm
from wtforms import StringField,EmailField,PasswordField,SubmitField
from wtforms.validators import DataRequired,Email,EqualTo,Length

class sinUp(FlaskForm):
    name = StringField('名前:',
                       validators=[DataRequired('必須入力です')])
    email = EmailField('メールアドレス:',
                       validators=[DataRequired('必須入力です'),
                                   Email('正しいメールアドレスではありません')])
    password = PasswordField('パスワード:',
                             validators=[DataRequired('必須入力です'),
                                         Length(8,20,'パスワードの長さは8文字以上20文字以下です'),
                                         EqualTo('confirm_password','パスワードが一致しません')])
    confirm_password = PasswordField('確認パスワード:',validators=[DataRequired('必須入力です')])
    submit = SubmitField('ユーザー作成')


class login(FlaskForm):
    email = EmailField('メールアドレス:',
                       validators=[DataRequired('必須入力です'),
                                   Email('正しいメールアドレスではありません')])
    password = PasswordField('パスワード:',
                             validators=[DataRequired('必須入力です'),
                                         Length(8,20,'パスワードの長さは8文字以上20文字以下です')])
    submit = SubmitField('ログイン')
    
