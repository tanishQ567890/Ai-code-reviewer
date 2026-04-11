from google import genai
import json
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def review_code(code:str,language:str="python"):
    prompt = f"""
    You are an expert code reviewer. Review the following {language} code carefully.
    Return ONLY a valid JSON object with no extra text, no markdown, no code fences.
    {{
        "complexity_score": <integer 1-10, where 10 is most complex>,
        "structure_score": <integer 1-10, where 10 is best structured>,
        "readability_score": <integer 1-10, where 10 is most readable>,
        "summary": "<2-3 sentence overall assessment>",
        "issues": [
        "<specific issue 1>",
        "<specific issue 2>"
         ],
        "suggestions": [
        "<actionable suggestion 1>",
        "<actionable suggestion 2>"
        ],
        "optimized_code": "<complete rewritten and improved version of the code>"
    }}

Code to review:
```{language}
{code}
```
"""
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        raw_text = response.text.strip()
        
        print(raw_text)
        
        if "optimized_code" in result:
            result["optimized_code"] = (result["optimized_code"].replace("\\n", "\n").replace("\\t", "\t"))

        if raw_text.startswith("```"):
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
            raw_text = raw_text.strip()

        result = json.loads(raw_text)
        if "optimized_code" in result:
              result["optimized_code"] = result["optimized_code"].replace("\\n", "\n")
              return {"success": True, "data": result}
        return {"success": True, "data": result}

    except json.JSONDecodeError:
        return {"success": False, "error": "please enter correct output", "raw": raw_text}
    except Exception as e:
        return {"success": False, "error": str(e)}


