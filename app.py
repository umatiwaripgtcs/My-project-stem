# app.py
# FastAPI backend for Iris Flower Prediction

import os
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model_train import train_model

# Define the input data model
class IrisInput(BaseModel):
    sepal_length: float
    sepal_width: float
    petal_length: float
    petal_width: float

app = FastAPI(title="Iris Flower Classifier API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model on startup
model_data = None

@app.on_event("startup")
def load_model():
    global model_data
    if not os.path.exists("model.pkl"):
        print("model.pkl not found. Training model...")
        train_model()
    
    try:
        model_data = joblib.load("model.pkl")
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Iris Flower Classifier API"}

@app.post("/predict")
def predict(data: IrisInput):
    if model_data is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Prepare the input for the model
        features = [[
            data.sepal_length,
            data.sepal_width,
            data.petal_length,
            data.petal_width
        ]]
        
        # Make prediction
        prediction_idx = model_data['model'].predict(features)[0]
        prediction_label = model_data['target_names'][prediction_idx]
        
        # Get probabilities for confidence
        probabilities = model_data['model'].predict_proba(features)[0]
        confidence = float(probabilities[prediction_idx])
        
        return {
            "prediction": prediction_label,
            "confidence": confidence
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Use environment variable for port if available, default to 3000
    port = int(os.environ.get("PORT", 3000))
    uvicorn.run(app, host="0.0.0.0", port=port)
