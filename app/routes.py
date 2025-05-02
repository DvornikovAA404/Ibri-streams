from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import db, User, Video, ChatMessage
from flask import Blueprint

main = Blueprint('main', __name__)

@main.route('/chat/<int:video_id>', methods=['GET'])
def get_chat(video_id):
    messages = ChatMessage.query.filter_by(video_id=video_id).order_by(ChatMessage.timestamp).all()
    return jsonify([
        {
            "user": f"{msg.user.name} {msg.user.surname}",
            "content": msg.content,
            "timestamp": msg.timestamp.isoformat()
        } for msg in messages
    ])

@main.route('/chat/<int:video_id>', methods=['POST'])
@jwt_required()
def send_chat(video_id):
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    data = request.get_json()
    content = data.get("message")

    if not content:
        return jsonify({"error": "Пустое сообщение"}), 400

    new_msg = ChatMessage(video_id=video_id, user_id=user.id, content=content)
    db.session.add(new_msg)
    db.session.commit()
    return jsonify({"status": "ok"})

@auth.route('/me')
@jwt_required()
def me():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    return jsonify({
        "email": user.email,
        "name": user.name,
        "surname": user.surname
    })
