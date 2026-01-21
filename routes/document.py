import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.auth import role_required
from extensions import db
from models.document import Document
from models.course import Course
from ai.loader import load_pdf, load_docx
from ai.rag import add_document_chunks

document_bp = Blueprint("document", __name__, url_prefix="/documents")

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"pdf", "docx"}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@document_bp.route("/upload", methods=["POST"])
@jwt_required()
@role_required("teacher")
def upload_document():
    identity = get_jwt_identity()
    teacher_id = identity["id"]

    file = request.files.get("file")
    course_id = request.form.get("course_id")

    if not file or not course_id:
        return jsonify({"msg": "File and course_id required"}), 400

    if not allowed_file(file.filename):
        return jsonify({"msg": "Invalid file type"}), 400

    course = Course.query.get(course_id)
    if not course or course.teacher_id != teacher_id:
        return jsonify({"msg": "Unauthorized or course not found"}), 403

    filename = f"{teacher_id}_{course_id}_{file.filename}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    document = Document(
        filename=filename,
        file_type=filename.rsplit(".", 1)[1],
        teacher_id=teacher_id,
        course_id=course_id
    )

    db.session.add(document)
    db.session.commit()

    return jsonify({
        "msg": "Document uploaded successfully",
        "document_id": document.id
    }), 201
