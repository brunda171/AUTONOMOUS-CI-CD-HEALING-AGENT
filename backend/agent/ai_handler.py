import openai
import os
import json

class AIHandler:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.client = openai.OpenAI(api_key=self.api_key)
        
    async def generate_fix(self, logs):
        prompt = f"""
        You are an autonomous CI/CD healing agent.
        The following Pytest logs indicate a failure in the codebase.
        
        LOGS:
        {logs}
        
        Please analyze the error and provide a fix.
        You must return a valid JSON object with the following structure:
        {{
            "file": "filename.py",
            "code": "FULL_FIXED_FILE_CONTENT",
            "message": "[AI-AGENT] Description of fix"
        }}
        
        - The "code" field must contain the COMPLETE content of the file with the fix applied. Do not return diffs.
        - The commit message must start with [AI-AGENT].
        - Only return the JSON object, no other text.
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a helpful coding assistant that outputs only JSON."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            print(f"AI Error: {e}")
            # Fallback for demo if API fails
            return {
                'file': 'error.log',
                'code': '',
                'message': f'[AI-AGENT] Failed to generate fix: {str(e)}'
            }
