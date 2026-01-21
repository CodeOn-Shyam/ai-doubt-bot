from flask import Flask
from extensions import db

def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///ai_doubt.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    with app.app_context():
        from models.teacher import Teacher
        from models.student import Student
        from models.course import Course
        from models.document import Document
        db.create_all()

    @app.route("/")
    def home():
        return "Flask + SQLAlchemy Backend Running"

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
