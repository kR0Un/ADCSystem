from flask import request, jsonify
from datetime import datetime
from dbTables import db, DocFirst, DocFirstVersion
from flask_login import current_user
from checkingLogicText import check_text_consciousness

def save_document1_route():
    data = request.json
    errors = []

    # Проверка текста на осознанность и сбор ошибок, если таковые имеются
    if not check_text_consciousness(data['content_lawsuit']):
        errors.append({'error': 'Неверный формат текста', 'field': 'content_lawsuit'})
    if not check_text_consciousness(data['judge_request']):
        errors.append({'error': 'Неверный формат текста', 'field': 'judge_request'})
    if not check_text_consciousness(data['application']):
        errors.append({'error': 'Неверный формат текста', 'field': 'application'})

    # Если есть ошибки, возвращаем их клиенту
    if errors:
        return jsonify(errors), 404
    else:
        document = DocFirst(
            document_name=data['document_name'],
            user_id=current_user.id,
            judge=data['judge'],
            fio_applicant=data['fio_applicant'],
            address_applicant=data['address_applicant'],
            phone_applicant=data['phone_applicant'],
            fio_defendant=data['fio_defendant'],
            address_defendant=data['address_defendant'],
            phone_defendant=data['phone_defendant'],
            fio_representative=data['fio_representative'],
            address_representative=data['address_representative'],
            phone_representative=data['phone_representative'],
            cost_lawsuit=data['cost_lawsuit'],
            about_lawsuit=data['about_lawsuit'],
            content_lawsuit=data['content_lawsuit'],
            judge_request=data['judge_request'],
            application=data['application'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date()  # Преобразование строки даты в объект datetime
        )
        db.session.add(document)
        db.session.commit()

        version = DocFirstVersion(
            document_id=document.id,
            user_id=current_user.id,
            version=1,  # Увеличиваем номер версии на 1
            version_date=datetime.now(),  # Устанавливаем текущую дату
            document_name=document.document_name,
            judge=document.judge,
            fio_applicant=document.fio_applicant,
            address_applicant=document.address_applicant,
            phone_applicant=document.phone_applicant,
            fio_defendant=document.fio_defendant,
            address_defendant=document.address_defendant,
            phone_defendant=document.phone_defendant,
            fio_representative=document.fio_representative,
            address_representative=document.address_representative,
            phone_representative=document.phone_representative,
            cost_lawsuit=document.cost_lawsuit,
            about_lawsuit=document.about_lawsuit,
            content_lawsuit=document.content_lawsuit,
            judge_request=document.judge_request,
            application=document.application,
            date=document.date
        )
        db.session.add(version)
        db.session.commit()

        # Перенаправление на страницу с id только что созданного документа
        return jsonify({"document_id": document.id})

def update_document1_route(document_id):
    data = request.json
    errors = []

    # Проверка текста на осознанность и сбор ошибок, если таковые имеются
    if not check_text_consciousness(data['content_lawsuit']):
        errors.append({'error': 'Неверный формат текста', 'field': 'content_lawsuit'})
    if not check_text_consciousness(data['judge_request']):
        errors.append({'error': 'Неверный формат текста', 'field': 'judge_request'})
    if not check_text_consciousness(data['application']):
        errors.append({'error': 'Неверный формат текста', 'field': 'application'})

    # Если есть ошибки, возвращаем их клиенту
    if errors:
        return jsonify(errors), 404
    else:
        document = DocFirst.query.get_or_404(document_id)

        document.user_id=current_user.id
        document.document_name = data.get('document_name')
        document.judge = data.get('judge')
        document.fio_applicant = data.get('fio_applicant')
        document.address_applicant = data.get('address_applicant')
        document.phone_applicant = data.get('phone_applicant')
        document.fio_defendant = data.get('fio_defendant')
        document.address_defendant = data.get('address_defendant')
        document.phone_defendant = data.get('phone_defendant')
        document.fio_representative = data.get('fio_representative')
        document.address_representative = data.get('address_representative')
        document.phone_representative = data.get('phone_representative')
        document.cost_lawsuit = data.get('cost_lawsuit')
        document.about_lawsuit = data.get('about_lawsuit')
        document.content_lawsuit = data.get('content_lawsuit')
        document.judge_request = data.get('judge_request')
        document.application = data.get('application')
        document.date = datetime.strptime(data.get('date'), '%Y-%m-%d').date()

        db.session.commit()

        version_number = DocFirstVersion.query.filter_by(document_id=document.id).count() + 1

        version = DocFirstVersion(
            document_id=document.id,
            user_id=current_user.id,
            version=version_number,  # Увеличиваем номер версии на 1
            version_date=datetime.now(),  # Устанавливаем текущую дату
            document_name=document.document_name,
            judge=document.judge,
            fio_applicant=document.fio_applicant,
            address_applicant=document.address_applicant,
            phone_applicant=document.phone_applicant,
            fio_defendant=document.fio_defendant,
            address_defendant=document.address_defendant,
            phone_defendant=document.phone_defendant,
            fio_representative=document.fio_representative,
            address_representative=document.address_representative,
            phone_representative=document.phone_representative,
            cost_lawsuit=document.cost_lawsuit,
            about_lawsuit=document.about_lawsuit,
            content_lawsuit=document.content_lawsuit,
            judge_request=document.judge_request,
            application=document.application,
            date=document.date
        )
        db.session.add(version)  # Добавляем новую версию в сессию
        db.session.commit()
        return jsonify({"document_id": document.id})