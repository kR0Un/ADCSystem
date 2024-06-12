from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()

class Users(db.Model,UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(200), nullable=False)
    user_secondname = db.Column(db.String(200), nullable=False)
    position = db.Column(db.String(200), nullable=False)
    first_time = db.Column(db.Boolean, default=True)
    login = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    is_active = db.Column(db.Boolean, default=True)

    def get_id(self):
        return str(self.id)

class Actions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(200))
    user_secondname= db.Column(db.String(200))
    date = db.Column(db.DateTime, nullable=False)
    action= db.Column(db.Text)

    def __repr__(self):
        return f'<User {self.id}>'

class DocFirst(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_name = db.Column(db.String(200))
    user_id=db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    judge = db.Column(db.String(200))
    fio_applicant = db.Column(db.String(250))
    address_applicant = db.Column(db.String(250))
    phone_applicant = db.Column(db.String(250))
    fio_defendant = db.Column(db.String(250))
    address_defendant = db.Column(db.String(250))
    phone_defendant = db.Column(db.String(250))
    fio_representative = db.Column(db.String(250))
    address_representative = db.Column(db.String(250))
    phone_representative = db.Column(db.String(250))
    cost_lawsuit = db.Column(db.Integer)
    about_lawsuit = db.Column(db.String(250))
    content_lawsuit = db.Column(db.Text)
    judge_request = db.Column(db.Text)
    application = db.Column(db.Text)
    date = db.Column(db.Date)

    def __repr__(self):
        return f'<User {self.id}>'

class DocFirstVersion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('doc_first.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    version = db.Column(db.Integer, nullable=False)
    version_date = db.Column(db.DateTime, nullable=False)
    document_name = db.Column(db.String(200))
    judge = db.Column(db.String(200))
    fio_applicant = db.Column(db.String(250))
    address_applicant = db.Column(db.String(250))
    phone_applicant = db.Column(db.String(250))
    fio_defendant = db.Column(db.String(250))
    address_defendant = db.Column(db.String(250))
    phone_defendant = db.Column(db.String(250))
    fio_representative = db.Column(db.String(250))
    address_representative = db.Column(db.String(250))
    phone_representative = db.Column(db.String(250))
    cost_lawsuit = db.Column(db.Integer)
    about_lawsuit = db.Column(db.String(250))
    content_lawsuit = db.Column(db.Text)
    judge_request = db.Column(db.Text)
    application = db.Column(db.Text)
    date = db.Column(db.Date)