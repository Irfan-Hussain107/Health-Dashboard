from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ComplaintData(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"status": "Python ML Service is running"}

@app.post("/categorize")
def categorize_complaint(data: ComplaintData):
    print(f"Received text to categorize: '{data.text}'")

    return {"category": "Waste Management"}