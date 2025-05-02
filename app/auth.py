from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
from .models import db, User

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    name = data.get('name')
    surname = data.get('surname')

    if not email or not name or not surname:
        return jsonify(message="Не все поля заполнены"), 400

    if User.query.filter_by(email=email).first():
        return jsonify(message="Пользователь с такой почтой уже существует"), 400

    hashed_password = generate_password_hash("IKS431")
    new_user = User(email=email, name=name, surname=surname, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=email)
    return jsonify(message="Регистрация успешна", access_token=access_token), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        token = create_access_token(identity=email)
        return jsonify(access_token=token), 200
    return jsonify(message="Неверные данные"), 401


