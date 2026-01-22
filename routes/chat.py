import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from utils.auth import role_required
from google import genai
from ai.rag import retrieve_context

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set")

client = genai.Client(api_key=API_KEY)

chat_bp = Blueprint("chat", __name__, url_prefix="/chat")


@chat_bp.route("", methods=["POST"])
@jwt_required()
@role_required("student")
def chat():
    data = request.get_json()
    if not data or "question" not in data:
        return jsonify({"msg": "Question required"}), 400

    question = data["question"]

    context = retrieve_context(question)

    prompt = f"""
Answer ONLY using the context below.
If the answer is not found, say:
"Not covered in uploaded material."

Context:
{context}

Question:
{question}
"""

    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )
    except Exception as e:
        return jsonify({
            "msg": "AI service unavailable",
            "error": str(e)
        }), 503

    return jsonify({
        "answer": response.text
    }), 200
