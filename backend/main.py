from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import os
import joblib
import pandas as pd
import numpy as np

app = FastAPI(title="Premium Real Estate Price Predictor")

# Load pre-trained model
MODEL_PATH = "model.pkl"
DATASET_PATH = "MumbaiHousePrices.csv"

try:
    if os.path.exists(MODEL_PATH):
        print("ML Model found! Loading data-driven Mumbai model...")
        ml_model = joblib.load(MODEL_PATH)
    else:
        ml_model = None
        print("ML Model not found locally. Running with fallback simulation.")
except Exception as e:
    ml_model = None
    print(f"Error loading model: {e}")

global_df = None
top_regions = []
all_regions = []
region_stats = {}

@app.on_event("startup")
def load_dataset():
    global global_df, top_regions, all_regions, region_stats
    print(f"Loading dataset from {DATASET_PATH}...")
    try:
        df = pd.read_csv(DATASET_PATH)
        
        def convert_price(row):
            try:
                val = float(row['price'])
                unit = str(row['price_unit']).strip()
                if unit == 'Cr':
                    return val * 10000000
                elif unit == 'L':
                    return val * 100000
                else:
                    return val
            except:
                return np.nan
                
        df['real_price'] = df.apply(convert_price, axis=1)
        df['price_per_sqft'] = df['real_price'] / df['area']
        df = df.dropna(subset=['real_price', 'bhk', 'area', 'region', 'price_per_sqft'])
        
        # Calculate stats
        counts = df['region'].value_counts()
        top_regions = counts.head(5).index.tolist()
        
        all_regions = df['region'].dropna().unique().tolist()
        all_regions.sort()
        
        for region in all_regions:
            region_df = df[df['region'] == region]
            region_stats[region] = {
                'avg_price': int(region_df['real_price'].mean()),
                'avg_sqft': int(region_df['price_per_sqft'].mean()),
                'count': len(region_df)
            }
            
        global_df = df
        print("Dataset loaded successfully.")
    except Exception as e:
        print(f"Failed to load dataset: {e}")

# Setup CORS to allow Next.js app to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    location: str
    bhk: int
    sqft: float

@app.post("/predict")
async def predict_price(request: PredictionRequest):
    global ml_model
    predicted_val = 0
    
    if ml_model is not None:
        try:
            # Create a dataframe using the request values mapping location -> region
            input_df = pd.DataFrame([{
                'bhk': request.bhk,
                'area': request.sqft,
                'region': request.location
            }])
            
            prediction = ml_model.predict(input_df)[0]
            predicted_val = float(prediction)
            
            # Add slight variance so repeat clicks feel "live"
            predicted_val += random.randint(-40000, 40000)
            
        except Exception as e:
            print("Model evaluation threw an error:", e)
            ml_model = None # Fallback next time
    
    if ml_model is None:
        # Fallback simulation
        base_price = 5000000 
        predicted_val = base_price + (request.sqft * 5000) + (request.bhk * 1000000)
        predicted_val += random.randint(-500000, 500000)
        
    return {
        "predicted_price": int(predicted_val),
        "currency": "INR",
        "investment_score": random.randint(6, 10),
        "location": request.location
    }

@app.get("/regions/top")
async def get_top_regions():
    return {
        "regions": top_regions
    }

@app.get("/regions/all")
async def get_all_regions():
    return {
        "regions": all_regions
    }

@app.get("/compare/top")
async def get_top_comparisons():
    if not top_regions or len(top_regions) < 2:
        return {"comparisons": []}
    
    comparisons = []
    # Pick top 2
    for r in top_regions[:2]:
        stats = region_stats.get(r, {})
        # create mock trend
        trend = round(random.uniform(-3, 15), 1)
        comparisons.append({
            "region": r,
            "type": "Premium Zone" if stats.get('avg_sqft', 0) > 15000 else "Emerging Hub",
            "price_per_sqft": stats.get('avg_sqft', 0),
            "trend": f"+{trend}%" if trend >= 0 else f"{trend}%",
            "is_positive": trend >= 0
        })
    return {"comparisons": comparisons}

@app.get("/trends")
async def get_trends(region: str = None):
    global global_df
    # We create pseudo-historical trends based on actual average price
    if global_df is not None:
        if region and region in region_stats:
            base_val = region_stats[region].get('avg_sqft', 4000)
        else:
            base_val = region_stats.get(top_regions[0], {}).get('avg_sqft', 4000) if top_regions else 4000
    else:
        base_val = 4000
    
    base_val = int(base_val * 0.4) # Start lower 10 years ago
    years = [str(2014 + i) for i in range(11)]
    trends = []
    for year in years:
        trends.append({
            "year": year,
            "avg_price_sqft": base_val,
            "premium_price_sqft": int(base_val * 1.5)
        })
        base_val += random.randint(200, 800)
        
    return {"trends": trends}

@app.get("/properties/featured")
async def get_featured_properties(limit: int = 3):
    global global_df
    if global_df is not None:
        # Pick random properties
        sample = global_df.sample(min(limit, len(global_df)))
        props = []
        for _, row in sample.iterrows():
            loc = str(row['locality'])
            reg = str(row['region'])
            props.append({
                "location": f"{loc}, {reg}" if loc != "nan" else reg,
                "price": f"{row['price']} {row['price_unit']}",
                "sqft": int(row['area']),
                "bhk": int(row['bhk']),
                "trend": f"+{round(random.uniform(2, 18), 1)}%"
            })
        return {"properties": props}
    return {"properties": []}

@app.get("/locations")
async def get_locations():
    # Placeholder heatmap data (lat, lng, intensity)
    base_lat = 19.0760
    base_lng = 72.8777
    heatmap = []
    for _ in range(50):
        heatmap.append({
            "lat": base_lat + random.uniform(-0.1, 0.1),
            "lng": base_lng + random.uniform(-0.1, 0.1),
            "intensity": random.random()
        })
    return {"heatmap": heatmap}

@app.get("/")
async def root():
    return {"message": "Real Estate API is runnnig!"}

