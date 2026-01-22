from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.auth import role_required
from models.course import Course
from extensions import db

teacher_bp = Blueprint("teacher", __name__, url_prefix="/teacher")

@teacher_bp.route("/courses", methods=["POST"])
@jwt_required()
@role_required("teacher")
def create_course():
    print("RAW BODY:", request.data)
    print("PARSED JSON:", request.get_json())

    data = request.get_json()

    if not data:
        return jsonify({"msg": "Invalid JSON body"}), 400

    title = data.get("title")
    description = data.get("description")

    if not isinstance(title, str) or not isinstance(description, str):
        return jsonify({"msg": "Title and description must be strings"}), 400

    teacher_id = int(get_jwt_identity())   # ✅ FIXED

    course = Course(
        title=title,
        description=description,
        teacher_id=teacher_id
    )

    db.session.add(course)
    db.session.commit()

    return jsonify({
        "msg": "Course created successfully",
        "course_id": course.id
    }), 201


@teacher_bp.route("/courses", methods=["GET"])
@jwt_required()
@role_required("teacher")
def my_courses():
    teacher_id = int(get_jwt_identity())

    courses = Course.query.filter_by(
        teacher_id=teacher_id
    ).all()

    return jsonify([
        {
            "id": c.id,
            "title": c.title,
            "description": c.description
        }
        for c in courses
    ]), 200
