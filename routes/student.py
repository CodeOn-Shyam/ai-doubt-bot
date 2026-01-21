from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.auth import role_required
from models import Course, Student
from extensions import db

student_bp = Blueprint("student", __name__, url_prefix="/student")
@student_bp.route("/me", methods=["GET"])
@jwt_required()
@role_required("student")
def me():
    user = get_jwt_identity()
    return jsonify({
        "msg": "Welcome Student",
        "student_id": user["id"]
    }), 200


@student_bp.route("/courses/<int:course_id>/enroll", methods=["POST"])
@jwt_required()
@role_required("student")
def enroll_course(course_id):
    identity = get_jwt_identity()
    student_id = identity["id"]

    student = Student.query.get(student_id)
    course = Course.query.get(course_id)

    if not course:
        return jsonify({"msg": "Course not found"}), 404

    if course in student.courses:
        return jsonify({"msg": "Already enrolled"}), 409

    student.courses.append(course)
    db.session.commit()

    return jsonify({"msg": "Enrolled successfully"}), 200


@student_bp.route("/courses", methods=["GET"])
@jwt_required()
@role_required("student")
def enrolled_courses():
    identity = get_jwt_identity()
    student = Student.query.get(identity["id"])

    return jsonify([
        {
            "id": c.id,
            "title": c.title,
            "description": c.description
        } for c in student.courses
    ]), 200
