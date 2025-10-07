from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
from fuzzywuzzy import process

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AddressRequest(BaseModel):
    address: str

# Load CSV and model/encoders
df = pd.read_csv("delhi_civic_complaints.csv")
model = joblib.load("delhi_civic_complaints_model.pkl")
zone_encoder = joblib.load("zone_encoder.pkl")
area_encoder = joblib.load("area_encoder.pkl")

@app.post("/predict")
def predict_complaints(request: AddressRequest):
    user_input = request.address.strip()

   
    areas = df["Area"].tolist()
    matched_area, score = process.extractOne(user_input, areas)

    if score < 20 or matched_area is None:
      
        matched_area = df.iloc[0]["Area"]

    zone = df[df["Area"] == matched_area].iloc[0]["Zone"]

  
    latest_row = df[df["Area"] == matched_area].sort_values(["Year", "Month"], ascending=False).iloc[0]

 
    X_input = pd.DataFrame([{
        "Zone_enc": zone_encoder.transform([zone])[0],
        "Area_enc": area_encoder.transform([matched_area])[0],
        "Year": latest_row["Year"],
        "Month": latest_row["Month"]
    }])

 
    try:
        total_pred = model.predict(X_input)[0]
        if total_pred <= 0:
            total_pred = 50  # fallback
    except:
        total_pred = 50

    resolved_pred = int(total_pred * 0.9)
    pending_pred = int(total_pred - resolved_pred)

    return {
        "zone": zone,
        "area": matched_area,
        "total_complaints": int(total_pred),
        "resolved_complaints": resolved_pred,
        "pending_complaints": pending_pred,
        "match_score": score
    }








