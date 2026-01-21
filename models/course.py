from extensions import db

class Course(db.Model):
    __tablename__ = "course"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)

    teacher_id = db.Column(db.Integer, db.ForeignKey("teachers.id"), nullable=False)

    students = db.relationship(
        "Student",
        secondary="student_course",
        back_populates="courses"
    )

    documents = db.relationship("Document", backref="course", lazy=True)

    def __repr__(self):
        return f"<Course {self.title}>"
