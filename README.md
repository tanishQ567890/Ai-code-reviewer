**AI-CODE-REVIEWER**
An AI-powered code review tool that analyzes code for complexity, structure, and readability — and generates an optimized version using Google Gemini.

**Working**
Accepts code via paste or file upload (.py, .js, .ts, .java, .cpp, .go, .rs)
Sends code to Google Gemini for review
Returns scores for complexity, structure, and readability (1–10)
Lists issues found and suggestions to improve
Generates a complete optimized version of the code
Saves every submission and review to a SQLite database

**Tech Stack**
LayerTechnologyFrontend: React + Vite
Backend: Flask (Python)
Database: SQLite + SQLAlchemy
AI: Google Gemini 2.0 Flash
Styling: Plain CSS(component-scoped)

**Key Technical Decisions**

**1. **Single Gemini prompt for review + optimization****
Rather than making two separate API calls (one for review, one for optimization), a single structured prompt asks Gemini to return everything in one JSON object.
This halves API costs and latency.
**2. SQLite**
PostgreSQL was the original plan but SQLite removes all setup friction — no server, no credentials, no migrations. The SQLAlchemy ORM means switching to PostgreSQL
later only requires changing one line (SQLALCHEMY_DATABASE_URI).

**3. Component-scoped CSS files**
Each React component has its own .css file imported directly. No CSS framework needed — keeps the bundle small and styles easy to find.


**4. FileReader API for file uploads:**
Instead of sending the raw file to Flask as multipart form data, the file is read as text in the browser using the FileReader API and sent as a plain JSON string. 
This means the file upload goes through the exact same /api/review endpoint as paste — no separate upload route needed.

**5. JSON string storage for arrays**
SQLite has no native array type. The issues and suggestions fields are stored as JSON strings (e.g. '["issue 1", "issue 2"]') and parsed back to arrays in the to_dict()
method. The frontend always receives clean arrays.


**AI usage**
Google Gemini 2.0 Flash is used for all code analysis. The prompt instructs Gemini to return a strict JSON object with no markdown, no extra text — just the fields 
needed. A defensive stripping step handles cases where Gemini wraps the response in code fences anyway.


**Risk and limitations**

<img width="784" height="450" alt="Screenshot 2026-04-11 214258" src="https://github.com/user-attachments/assets/84ec5157-691b-4438-b5cf-23a7999917b0" />

**Extension approach**
<img width="810" height="351" alt="Screenshot 2026-04-11 214357" src="https://github.com/user-attachments/assets/e39fed72-a934-4ec0-bc50-a316ea041ce0" />

**Key Results-Images**
1. API initilly tested using POSTMAN
<img width="1123" height="652" alt="postman " src="https://github.com/user-attachments/assets/bb57c909-6733-4dfd-9ab0-b448ab3ba3a3" />

2. AI code Reviewer image
<img width="1797" height="875" alt="res1" src="https://github.com/user-attachments/assets/560317db-0d85-47c9-92ae-57b691e13d60" />
<img width="1692" height="719" alt="res3" src="https://github.com/user-attachments/assets/080003fa-13b6-4356-ad99-038945a64a1b" />
<img width="1751" height="848" alt="res2" src="https://github.com/user-attachments/assets/c68b6d1d-28d2-43a2-a8c5-fe7d0c1b85e4" />

