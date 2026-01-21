from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

def role_required(role):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            identity = get_jwt_identity()

            if not identity or identity.get("role") != role:
                return jsonify({"msg": "Access forbidden: incorrect role"}), 403

            return fn(*args, **kwargs)
        return wrapper
    return decorator
