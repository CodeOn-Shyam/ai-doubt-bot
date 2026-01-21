import os
import faiss
import numpy as np
import pickle
from ai.embeddings import embed_text

STORAGE_DIR = "ai/storage"
INDEX_PATH = os.path.join(STORAGE_DIR, "faiss.index")
DOCS_PATH = os.path.join(STORAGE_DIR, "documents.pkl")

os.makedirs(STORAGE_DIR, exist_ok=True)

dimension = 768

documents = []

def create_new_index():
    print("⚠️ Creating new FAISS index")
    return faiss.IndexFlatL2(dimension)

try:
    if os.path.exists(INDEX_PATH) and os.path.getsize(INDEX_PATH) > 0:
        index = faiss.read_index(INDEX_PATH)
        with open(DOCS_PATH, "rb") as f:
            documents = pickle.load(f)
    else:
        index = create_new_index()
except Exception as e:
    print("⚠️ FAISS index corrupted. Recreating.")
    index = create_new_index()
    documents = []


def save_state():
    faiss.write_index(index, INDEX_PATH)
    with open(DOCS_PATH, "wb") as f:
        pickle.dump(documents, f)

def add_document_chunks(text: str):
    chunks = [text[i:i+500] for i in range(0, len(text), 500)]

    for chunk in chunks:
        emb = embed_text(chunk)
        index.add(np.array([emb]))
        documents.append(chunk)

    save_state()


def retrieve_context(question: str, k=3):
    if index.ntotal == 0:
        return ""

    q_emb = embed_text(question)
    _, I = index.search(np.array([q_emb]), k)
    return "\n".join(documents[i] for i in I[0])
