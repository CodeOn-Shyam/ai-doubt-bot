from extensions import db
from models import student_course

class Course(db.Model):
    __tablebname__ = "courses"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)

    teacher_id = db.Column(db.Integer, db.ForeignKey("teachers.id"),nullable = False)

    students = db.relationship("Student", secondary=student_course, back_populates="courses")
    documents = db.relationship("Document", backref="course", lazy=True)

    def __reper__(self):
        return f"<Course {self.title}>"