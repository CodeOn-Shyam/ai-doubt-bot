from extensions import db
from models import student_course

class Student(db.Model):
    __tablename__ = "students"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

    courses = db.relationship("Course", secondary=student_course, back_populates="students")

    def __repr__(self):
        return f"<Student {self.email}>"