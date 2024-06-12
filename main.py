from flask import Flask, render_template, request, send_file,jsonify,redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required,login_manager
from flask_migrate import Migrate
from datetime import datetime
from doument1Routes import save_document1_route, update_document1_route
import audio
import os
import io
from docxtpl import DocxTemplate
from flask_cors import CORS
import webbrowser

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///docs.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key'

from dbTables import db, DocFirst, DocFirstVersion, Users, Actions

def addAction(userName,userSecondName,actionDescription):
    action = Actions(
        user_name=userName,
        user_secondname=userSecondName,
        date=datetime.now(),
        action=actionDescription
    )
    db.session.add(action)
    db.session.commit()

db.init_app(app)
migrate = Migrate(app, db)

login_manager = LoginManager(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))

@app.template_filter('format_datetime')
def format_datetime(value):
    if isinstance(value, datetime):
        return value.strftime('%Y-%m-%d %H:%M:%S')
    return value

# Маршрут для главной страницы
@app.route('/main')
@app.route('/')
@login_required  # Защита маршрута
def main():
    addAction(current_user.user_name,current_user.user_secondname,'Перешёл на главную страницу')
    return render_template('main.html',user=current_user)

@app.route('/admin')
@login_required  # Защита маршрута
def admin():
    if current_user.position == "admin":
        actions = Actions.query.all()
        return render_template('admin.html',user=current_user, actions=actions)
    else:
        return render_template('main.html', user=current_user)

@app.route('/create_doc1')
@login_required  # Защита маршрута
def create_doc1():
    addAction(current_user.user_name, current_user.user_secondname, 'Перешёл на страницу создания документа')
    return render_template('create_doc1.html',user=current_user)


@app.route('/logout')
@login_required
def logout():
    addAction(current_user.user_name, current_user.user_secondname, 'Вышел из аккаунта')
    logout_user()
    return redirect(url_for('main'))

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/login_user', methods=['POST'])
def login_user_route():
    data = request.json
    user = Users.query.filter_by(login=data['login'], password=data['password']).first()
    if user:
        if user.first_time:
            return jsonify({'redirect': url_for('setup_login', user_id=user.id)})
        else:
            login_user(user)
            addAction(current_user.user_name, current_user.user_secondname, 'Вошёл из аккаунта')
            return jsonify({'redirect': url_for('main')})
    else:
        return 'Invalid credentials', 401

@app.route('/setup_login/<int:user_id>', methods=['GET', 'POST'])
def setup_login(user_id):
    # Используйте user_id для получения информации о пользователе и работы с ним
    user = Users.query.get(user_id)
    if user:
        # Действия с пользователем
        return render_template('setup_login.html', user=user)
    else:
        return 'User not found', 404

@app.route('/setup_login_btn', methods=['POST'])
def setup_login_btn():
    data = request.json
    user = Users.query.filter_by(login=data['login'], password=data['password']).first()
    if user:
        return 'Invalid credentials', 401
    else:
        new_user = Users.query.filter_by(id=data['id']).first()
        new_user.login = data['login']
        new_user.password = data['password']
        new_user.first_time = False  # Пользователь больше не находится в режиме первого входа
        db.session.commit()

        login_user(new_user)  # Логин пользователя после успешного обновления
        addAction(current_user.user_name, current_user.user_secondname, 'Вошёл из аккаунта')
        return jsonify({'redirect': url_for('main')})

#start speech recognition
@app.route('/process', methods=['POST'])
@login_required
def process():
    audio.start_listening()
    return jsonify({'status': 'Listening started'})

@app.route('/status', methods=['GET'])
@login_required
def status_route():
    return jsonify({"status": audio.get_audio_recognition_status()})

@app.route('/start_listening', methods=['POST'])
@login_required
def start_listening_route():
    audio.start_listening()
    return jsonify({"status": "started"})

@app.route('/stop_listening', methods=['POST'])
@login_required
def stop_listening_route():
    audio.stop_listen()
    return jsonify({"status": "stopped"})

@app.route('/get_recognized_text', methods=['GET'])
@login_required
def get_recognized_text():
    return jsonify({"recognized_text": audio.recognized_text})
#end speech recognition

@app.route('/all_documents', methods=['GET','POST'])
@login_required
def all_documents():
    addAction(current_user.user_name, current_user.user_secondname, 'Перешёл на страницу все документы')
    all_docs = DocFirst.query.filter_by(user_id=current_user.id).all()
    return render_template('all_documents.html', all_docs=all_docs, user=current_user)

@app.route('/get_version/<int:document_id>/<int:version_number>', methods=['GET'])
@login_required
def get_version(document_id, version_number):
    # Ищем версию документа в базе данных
    versions = DocFirstVersion.query.filter_by(document_id=document_id).all()
    version = DocFirstVersion.query.filter_by(document_id=document_id, version=version_number).first()
    if version:
        addAction(current_user.user_name, current_user.user_secondname, 'Перешёл на страницу просмотра версии документа')
        return render_template('all_version.html', versions=versions, version=version,user=current_user)
    else:
        # Если версия документа не найдена, возвращаем ошибку 404
        return jsonify({'error': 'Version not found'}), 404

#start create document
@app.route('/generate_doc', methods=['POST'])
@login_required
def generate_doc():
    data = request.json
    print('Полученные данные:', data)  # Логирование полученных данных

    # Получаем данные из запроса
    judge = data.get('judge')
    fio_applicant = data.get('fio_applicant')
    address_applicant = data.get('address_applicant')
    phone_applicant = data.get('phone_applicant')
    fio_defendant = data.get('fio_defendant')
    address_defendant = data.get('address_defendant')
    phone_defendant = data.get('phone_defendant')
    fio_representative = data.get('fio_representative')
    address_representative = data.get('address_representative')
    phone_representative = data.get('phone_representative')
    cost_lawsuit = data.get('cost_lawsuit')
    about_lawsuit = data.get('about_lawsuit')
    content_lawsuit = data.get('content_lawsuit')
    judge_request = data.get('judge_request')
    application = data.get('application')
    date = data.get('date')

    context = {
        'judge': judge,
        'fio_applicant': fio_applicant,
        'address_applicant': address_applicant,
        'phone_applicant': phone_applicant,
        'fio_defendant': fio_defendant,
        'address_defendant': address_defendant,
        'phone_defendant': phone_defendant,
        'fio_representative': fio_representative,
        'address_representative': address_representative,
        'phone_representative': phone_representative,
        'cost_lawsuit': cost_lawsuit,
        'about_lawsuit': about_lawsuit,
        'content_lawsuit': content_lawsuit,
        'request': judge_request,
        'application': application,
        'date': date
    }

    # Создание документа
    script_dir = os.path.dirname(os.path.abspath(__file__))
    template_path = os.path.join(script_dir, 'templates/documents-template/doc1.docx')
    doc = DocxTemplate(template_path)
    doc.render(context)

    # Сохранение документа во временный буфер
    file_stream = io.BytesIO()
    doc.save(file_stream)
    file_stream.seek(0)

    print('Документ создан')  # Логирование создания документа
    addAction(current_user.user_name, current_user.user_secondname, 'Скачал документ')
    return send_file(file_stream, as_attachment=True, download_name='document.docx',
                     mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
#end create document

#start save document
@app.route('/save_document1', methods=['POST','GET'])
@login_required
def save_document1():
    return save_document1_route()

@app.route('/document1/<int:document_id>/update', methods=['POST','GET'])
@login_required
def update_document1(document_id):
    return update_document1_route(document_id)


@app.route('/document1/<int:document_id>', methods=['GET'])
@login_required
def document1_detail(document_id):
    document = DocFirst.query.get_or_404(document_id)
    print(document)
    addAction(current_user.user_name, current_user.user_secondname, 'Открыл страницу редактирования документа ' + document.document_name)
    return render_template('edit_doc1.html', document=document, user=current_user)


@app.route('/document1_delete/<int:document_id>', methods=['POST'])
@login_required
def document1_delete(document_id):
    data = request.json
    if data['password'] == current_user.password:
        document = DocFirst.query.get_or_404(document_id)
        documents_version = DocFirstVersion.query.filter_by(document_id=document_id, user_id=current_user.id).all()

        addAction(current_user.user_name, current_user.user_secondname,
                  'Удалил документ' + document.document_name)
        # Удаление версий документа
        for version in documents_version:
            db.session.delete(version)

        db.session.delete(document)
        db.session.commit()
        return jsonify({'redirect': url_for('all_documents')})
    else:
        return jsonify({'error': 'Invalid password'}), 404


if __name__ == '__main__':
    app.run(debug=True)
