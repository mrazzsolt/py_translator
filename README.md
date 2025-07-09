# py_translator

**py_translator** is a simple FastAPI-based text translation service written in Python. It provides a REST API to translate texts between different languages. It uses OPENAI api to translate the text.

---

## Features

- REST API for text translation
- FastAPI backend with Uvicorn server
- Easy to start and extend
- Virtual environment support

---

## How to Run (Windows / PowerShell)

```powershell
./.venv/Scripts/Activate.ps1
cd app
uvicorn main:app
The app will be available at:
http://127.0.0.1:8000/index
```
---
## Installation
If the virtual environment is not set up yet:
```powershell
python -m venv .venv
Activate it:
.\.venv\Scripts\Activate.ps1
Install dependencies:
pip install -r requirements.txt
