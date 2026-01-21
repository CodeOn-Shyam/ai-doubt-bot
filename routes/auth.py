from flask import Blueprint, request, jsonify
from extensions import db
from models.teacher import Teacher
from models.student import Student
from flask_jwt_extended import create_access_token
from utils.security import hash_password, verify_password

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/register/teacher", methods=["POST"])
def register_teacher():
    data = request.json

    if Teacher.query.filter_by(email=data["email"]).first():
        return jsonify({"msg": "Teacher already exists"}), 409

    teacher = Teacher(
        name=data["name"],
        email=data["email"],
        password=hash_password(data["password"])
    )

    db.session.add(teacher)
    db.session.commit()

    return jsonify({"msg": "Teacher registered successfully"}), 201

@auth_bp.route("/register/student", methods=["POST"])
def register_student():
    data = request.json

    if Student.query.filter_by(email=data["email"]).first():
        return jsonify({"msg": "Student already exists"}), 409

    student = Student(
        name=data["name"],
        email=data["email"],
        password=hash_password(data["password"])
    )

    db.session.add(student)
    db.session.commit()

    return jsonify({"msg": "Student registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data["email"]
    password = data["password"]
    role = data["role"]

    user = None

    if role == "teacher":
        user = Teacher.query.filter_by(email=email).first()
    elif role == "student":
        user = Student.query.filter_by(email=email).first()
    else:
        return jsonify({"msg": "Invalid role"}), 400

    if not user or not verify_password(user.password, password):
        return jsonify({"msg": "Invalid credentials"}), 401

    token = create_access_token(
        identity={
            "id": user.id,
            "role": role
        }
    )

    return jsonify({
        "access_token": token,
        "role": role
    }), 200
