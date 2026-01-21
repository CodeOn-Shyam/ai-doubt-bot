import os
import numpy as np
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def embed_text(text: str):
    result = client.models.embed_content(
        model="text-embedding-004",
        contents=text
    )
    return np.array(result.embeddings[0].values, dtype="float32")
