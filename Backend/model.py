from flask_sqlalchemy import SQLAlchemy
from datetime import datetime , timezone
import json
db = SQLAlchemy()

class Submission(db.Model):
    __tablename__ ="Submissions"

    id = db.Column(db.Integer,primary_key = True)
    code_text = db.Column(db.Text,nullable = False)
    language = db.Column(db.String(50),default = "Python")
    source = db.Column(db.String(10),nullable = False)
    file_name = db.Column(db.String(255),nullable = True)
    created_at = db.Column(db.DateTime,default = lambda: datetime.now(timezone.utc))

    review = db.relationship("ReviewTable",backref="Submission",uselist=False)

    def to_dict(self):
        return{
            "id": self.id,
            "language":self.language,
            "source":self.source,
            "filename": self.file_name,
            "created_at": self.created_at
        }

class ReviewTable(db.Model):
    __tablename__ ="Review"


    id = db.Column(db.Integer,primary_key = True)
    submission_id = db.Column(db.Integer,db.ForeignKey("Submissions.id"), nullable=False)
    complexity_score  = db.Column(db.Integer, nullable=True)   
    structure_score   = db.Column(db.Integer, nullable=True)   
    readability_score = db.Column(db.Integer, nullable=True)   
    summary           = db.Column(db.Text, nullable=True)
    issues            = db.Column(db.Text, nullable=True)
    suggestions       = db.Column(db.Text, nullable=True)
    optimized_code    = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime,default = lambda: datetime.now(timezone.utc))


    def to_dict(self):
        return {
            "id":                self.id,
            "submission_id":     self.submission_id,
            "complexity_score":  self.complexity_score,
            "structure_score":   self.structure_score,
            "readability_score": self.readability_score,
            "summary":           self.summary,
            "issues":            json.loads(self.issues or "[]"),
            "suggestions":       json.loads(self.suggestions or "[]"),
            "optimized_code":    self.optimized_code,
            "created_at":        self.created_at.isoformat()
        }

