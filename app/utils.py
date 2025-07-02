from openai import OpenAI
from sqlalchemy.orm import Session
from crud import update_translation_task
from dotenv import load_dotenv
import os

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

def perform_translation(task_id: int, text: str, Languages: list, db: Session):
    translations = {}
    for lang in Languages:
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo-1106",
                messages=[
                    {"role": "system", "content": f"You are a helpful assistant that translates text into {lang}. Give back only the translated text."},
                    {"role": "user", "content": text}
                ],
                max_tokens=1000
            )
            translated_text = response.choices[0].message.content.strip()
            translations[lang] = translated_text
        except Exception as e:
            print(f"Error translating to {lang}: {e}")
            translations[lang] = f"Error: {e}"

    update_translation_task(db, task_id, translations)
