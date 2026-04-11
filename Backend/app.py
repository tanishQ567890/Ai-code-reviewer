from flask import Flask , request , jsonify
from flask_cors import CORS
from gemini import review_code
from model import db , Submission, ReviewTable
import json


app = Flask(__name__)
CORS(app)


app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///codereview.db"
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route("/")
def home():
    return "Code review API is running"


@app.route("/api/review",methods = ["POST"])
def review():
    data = request.get_json()
    code = data.get("code","").strip()
    language = data.get("language","python")
    source = data.get("source", "manual")
    filename = data.get("filename", "")

    if not code:
        return jsonify({"error":" no code provided"}),400
    result = review_code(code,language)

    if not result["success"]:
        return jsonify({"error":result["error"]}),500
    
    review_data = result["data"]
    submission = Submission(
        code_text=code,
        language=language,
        source=source,
        file_name=filename
    )
    db.session.add(submission)
    db.session.flush()

    review_record = ReviewTable(
        submission_id=submission.id,
        complexity_score=review_data.get("complexity_score"),
        structure_score=review_data.get("structure_score"),
        readability_score=review_data.get("readability_score"),
        summary=review_data.get("summary"),
        issues=json.dumps(review_data.get("issues", [])),
        suggestions=json.dumps(review_data.get("suggestions", [])),
        optimized_code=review_data.get("optimized_code")
    )
    db.session.add(review_record)
    db.session.commit()

    
    return jsonify({
        "submission_id": submission.id,
        **review_data
    }), 200

if __name__ == "__main__":
    app.run(debug=True)

