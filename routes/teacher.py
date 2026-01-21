from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.auth import role_required
from models.course import Course
from extensions import db

teacher_bp = Blueprint("teacher", __name__, url_prefix="/teacher")

@teacher_bp.route("/dashboard")
@jwt_required()
@role_required("teacher")
def dashboard():
    user = get_jwt_identity()
    return {
        "msg": "Welcome Teacher",
        "teacher_id": user["id"]
    }
@teacher_bp.route("/courses")
@jwt_required()
@role_required("teacher")
def create_courses():
    data = request.json
    identity = get_jwt_identity()
    title = data.get("title")
    description = data.get("description")

    if not title or not description:
        return {"msg": "Title and description are required"}, 400
    course = Course(
        title=title,
        description=description,
        teacher_id=identity["id"]
    )
    db.session.add(course)
    db.session.commit()
    return {"msg": "Course created successfully", "course_id": course.id}, 201
@teacher_bp.route("/courses", methods=["GET"])
@jwt_required()
@role_required("teacher")
def my_courses():
    identity = get_jwt_identity()

    courses = Course.query.filter_by(teacher_id=identity["id"]).all()

    result = []
    for c in courses:
        result.append({
            "id": c.id,
            "title": c.title,
            "description": c.description
        })

    return jsonify(result), 200
