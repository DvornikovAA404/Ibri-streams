from flask import Blueprint, send_from_directory

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return send_from_directory('../frontend', 'index.html')

@main.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('../frontend', filename)
