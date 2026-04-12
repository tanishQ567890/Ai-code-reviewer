# AI Guidance — AI Code Reviewer

This file documents how AI tools were used during the development of this project, including which tools were used, for what purpose, and how they guided the development process.

---

## AI Tools Used

| Tool | Purpose |
|---|---|
| ChatGPT | Ideas, architecture planning, knowledge building |
| Claude API | Error fixing, debugging, code corrections |

---

## ChatGPT Usage — Ideas and Architecture

ChatGPT was used in the **early planning phase** of the project before any code was written.

### What I asked ChatGPT

- What tech stack should I use for a 24-hour AI code review tool?
- How should I structure a Flask + React project?
- What database is best for a quick prototype — SQLite or PostgreSQL?
- How does Google Gemini API work and what model should I use?
- What features should an AI code reviewer have?

### What I got from ChatGPT

ChatGPT helped me understand the high-level architecture before I started building. The key ideas it gave me were:

- Use **Flask** as a lightweight backend — simpler than Django for a 24-hour build
- Use **SQLite** instead of PostgreSQL to avoid setup overhead
- Keep the frontend in **React + Vite** for fast development
- Use a **single Gemini API call** to get both the review and the optimized code together
- Structure the review output as a **JSON object** with scores, issues, suggestions, and optimized code

### Knowledge I gained from ChatGPT

- How Google Gemini API works and how to authenticate with an API key
- The difference between `google-generativeai` (old) and `google-genai` (new) packages
- How SQLAlchemy ORM maps Python classes to database tables
- How CORS works and why Flask needs `flask-cors` to talk to React
- How the `FileReader` API works in the browser for reading uploaded files as text

---

## Claude Usage — Error Fixing and Debugging

Claude was used during the **active development phase** to fix bugs and errors that came up while writing and running the code.

### Errors Claude helped fix

**Error 1 — Wrong JSON parsing function**
```
json.JSONDecodeError
```
I used `json.load(raw_text)` instead of `json.loads(raw_text)`. Claude spotted this immediately and explained that `json.load` reads from a file object while `json.loads` reads from a string.

---

**Error 2 — Duplicate table name in models**
```
sqlalchemy.exc.InvalidRequestError: Table 'Submissions' is already defined
```
I accidentally gave both `Submission` and `ReviewTable` the same `__tablename__ = "Submissions"`. Claude fixed the second table to `__tablename__ = "reviews"`.

---

**Error 3 — Wrong SQLAlchemy relationship argument**
```
TypeError: relationship() got an unexpected keyword argument 'useList'
```
I wrote `useList=False` but the correct argument is `uselist=False` (lowercase L). Claude caught the casing error.

---

**Error 4 — Key casing mismatch between files**
```
KeyError: 'Success'
```
`gemini.py` was returning `{"success": True}` but `app.py` was checking `result["Success"]`. Claude identified the mismatch across two files and fixed both to use lowercase `success`.

---

**Error 5 — Wrong Gemini model name**
```
404 NOT_FOUND: models/gemini-1.5-flash is not found for API version v1beta
```
The model name `gemini-1.5-flash` was not available on the new `google-genai` package. Claude told me to switch to `gemini-2.0-flash` which is supported.

---

**Error 6 — Wrong package import**
```
ImportError: cannot import name 'genai' from 'google'
```
I was using `from google import genai` but the old `google-generativeai` package was installed. Claude told me to uninstall the old package and install `google-genai` instead.

---

**Error 7 — Optimized code displaying in one line**
The `optimized_code` field from Gemini was returning `\n` as a literal escaped string instead of real newlines, so all code appeared on one horizontal line. Claude added a post-processing step:
```python
result["optimized_code"] = result["optimized_code"].replace("\\n", "\n")
```
And fixed the React component to use `whiteSpace: "pre"` in the syntax highlighter.

---

**Error 8 — Missing closing tags in ReviewPanel.jsx**
The Readability score card `</div>` and the `scores-grid` container `</div>` were both missing, causing the summary and issues sections to nest incorrectly inside the score card. Claude identified both missing tags and fixed the structure.

---

**Error 9 — Module not found: flask_cors**
```
ModuleNotFoundError: No module named 'flask_cors'
```
The virtual environment `venv6` did not have the packages installed even though they were installed globally. Claude told me to run `python -m pip install flask-cors` to install into the correct Python environment.

---

**Error 10 — Deprecated datetime.utcnow**
```
DeprecationWarning: datetime.utcnow() is deprecated
```
I used `datetime.utcnow` which is deprecated since Python 3.12. Claude replaced it with:
```python
from datetime import datetime, timezone
default=lambda: datetime.now(timezone.utc)
```

---

## Summary

| Phase | Tool | What it helped with |
|---|---|---|
| Planning | ChatGPT | Architecture, tech stack, feature ideas |
| Knowledge | ChatGPT | Gemini API, SQLAlchemy, CORS, FileReader |
| Development | Claude | Bug fixing, error messages, code corrections |
| Documentation | Claude | README, claude.md, video script |

---

## Reflection

Using two AI tools for different purposes worked well. ChatGPT was better for open-ended exploration and getting ideas before writing any code. Claude was better for precise debugging — pasting an exact error message and getting a targeted fix with a clear explanation of why it happened.

The most important lesson was to always paste the **exact error message** to Claude rather than describing the error. Every time I gave Claude the full traceback it identified the root cause immediately. Every time I described the error loosely it took more back and forth to resolve.
