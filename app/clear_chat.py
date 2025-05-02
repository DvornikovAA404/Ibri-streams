from app import create_app, db
from app.models import ChatMessage

app = create_app()
app.app_context().push()

def clear_chat_for_video(video_id):
    deleted = ChatMessage.query.filter_by(video_id=video_id).delete()
    db.session.commit()
    print(f"Удалено сообщений: {deleted}")

if __name__ == "__main__":
    video_id = int(input("ID видео для очистки чата: "))
    clear_chat_for_video(video_id)
