from flask import Flask
from extensions import db
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv
from flask import render_template
load_dotenv()

jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///ai_doubt.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

    db.init_app(app)
    from routes.auth import auth_bp
    from routes.teacher import teacher_bp
    from routes.student import student_bp
    from routes.document import document_bp
    from routes.chat import chat_bp
    app.register_blueprint(chat_bp)
    app.register_blueprint(auth_bp)
    jwt.init_app(app)
    app.register_blueprint(teacher_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(document_bp)

    with app.app_context():
        import models
        db.create_all()

    @app.route("/")
    def home():
        return "Auth System Running"
    @app.route("/login")
    def login_page():
        return render_template("login.html")
    @app.route("/teacher/dashboard")
    def teacher_dashboard():
        return render_template("teacher.html")
    @app.route("/student/dashboard")
    def student_dashboard():
        return render_template("student.html")
    @app.route("/chat/page")
    def chat_page():
        return render_template("chat.html")
    @app.route("/register")
    def register_page():
        return render_template("register.html")

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
