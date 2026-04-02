import pandas as pd
import os
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
import joblib

def train_and_save_model():
    print("Loading dataset...")
    base_dir = os.path.dirname(__file__) or '.'
    csv_path = os.path.join(base_dir, "..", "MumbaiHousePrices.csv")
    df = pd.read_csv(csv_path)
    
    print("Cleaning pricing...")
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
    df = df.dropna(subset=['real_price', 'bhk', 'area', 'region'])
    
    X = df[['bhk', 'area', 'region']]
    y = df['real_price']
    
    print(f"Training on {len(X)} samples...")
    # OHE the 'region' to handle the locations that the user inputs from the UI.
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['region'])
        ],
        remainder='passthrough'
    )
    
    # Fast lightweight model for near-instant training on 76k rows.
    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=15, max_depth=12, random_state=42, n_jobs=-1))
    ])
    
    model.fit(X, y)
    
    print("Model trained! Saving to model.pkl...")
    joblib.dump(model, 'model.pkl')
    print("Saved successfully.")

if __name__ == '__main__':
    train_and_save_model()
