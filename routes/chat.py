import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from utils.auth import role_required
from google import genai
from ai.rag import retrieve_context

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

chat_bp = Blueprint("chat", __name__, url_prefix="/chat")

@chat_bp.route("", methods=["POST"])
@jwt_required()
@role_required("student")
def chat():
    question = request.json.get("question")
    if not question:
        return jsonify({"msg": "Question required"}), 400

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

    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents=prompt
    )

    return jsonify({"answer": response.text}), 200
