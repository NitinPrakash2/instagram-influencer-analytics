"""
Engagement Rate Prediction Model (Regression)
Predicts an influencer's expected engagement rate based on followers, posting frequency,
niche category, bio length, hashtag diversity, and interaction ratios.
"""

import os
import sys

# Ensure root directory is in python path
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, Tuple
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

from src.preprocessing.feature_engineering import FeatureEngineeringPipeline

class EngagementRatePredictor:
    def __init__(self):
        self.feat_pipeline = FeatureEngineeringPipeline()
        self.model = None
        self.pipeline = None
        self.metrics = {}
        self.feature_names = []
        self.feature_importances_ = {}
        self.model_dir = os.path.join(os.path.dirname(__file__), "saved_models")
        os.makedirs(self.model_dir, exist_ok=True)
        
    def train(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Train regression pipeline and evaluate metrics."""
        X, y_eng, _, _ = self.feat_pipeline.prepare_ml_data(df)
        
        num_features = [
            "log_followers",
            "posting_frequency_monthly",
            "bio_length",
            "hashtag_count",
            "hashtag_diversity_score",
            "comment_to_like_ratio"
        ]
        cat_features = ["category"]
        
        # Build Preprocessor
        preprocessor = ColumnTransformer(
            transformers=[
                ("num", StandardScaler(), num_features),
                ("cat", OneHotEncoder(drop="first", sparse_output=False), cat_features)
            ]
        )
        
        # Base Regressor (Gradient Boosting for robust non-linear fitting)
        regressor = GradientBoostingRegressor(
            n_estimators=120,
            learning_rate=0.08,
            max_depth=4,
            random_state=42
        )
        
        self.pipeline = Pipeline(steps=[
            ("preprocessor", preprocessor),
            ("regressor", regressor)
        ])
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y_eng, test_size=0.2, random_state=42
        )
        
        self.pipeline.fit(X_train, y_train)
        
        # Predictions & Metrics
        y_pred = self.pipeline.predict(X_test)
        
        r2 = r2_score(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        
        self.metrics = {
            "r2_score": round(float(r2), 4),
            "mae": round(float(mae), 4),
            "rmse": round(float(rmse), 4)
        }
        
        # Extract feature importances
        cat_encoder = preprocessor.named_transformers_["cat"]
        encoded_cats = list(cat_encoder.get_feature_names_out(cat_features))
        all_features = num_features + encoded_cats
        self.feature_names = all_features
        importances = regressor.feature_importances_
        self.feature_importances_ = {
            name: round(float(imp), 4) for name, imp in zip(all_features, importances)
        }
        
        # Save model
        joblib.dump(self.pipeline, os.path.join(self.model_dir, "engagement_predictor.joblib"))
        
        return self.metrics

    def predict_single(self, followers: int, posting_freq: int, category: str, bio: str = "", hashtags: str = "") -> float:
        """Predict engagement rate for user-specified input parameters."""
        if self.pipeline is None:
            self.load()
            
        sample_df = pd.DataFrame([{
            "followers": followers,
            "posting_frequency_monthly": posting_freq,
            "category": category,
            "bio": bio if bio else f"Creator in {category}",
            "hashtags": hashtags if hashtags else "#creator #content",
            "avg_likes_per_post": max(10, int(followers * 0.03)),
            "avg_comments_per_post": max(2, int(followers * 0.001)),
            "contact_available": "Yes",
            "uses_automation": "No",
            "engagement_rate_pct": 3.0
        }])
        
        X_sample, _, _, _ = self.feat_pipeline.prepare_ml_data(sample_df)
        pred = self.pipeline.predict(X_sample)[0]
        return round(float(np.clip(pred, 0.3, 20.0)), 2)

    def load(self):
        """Load trained pipeline from disk."""
        model_path = os.path.join(self.model_dir, "engagement_predictor.joblib")
        if os.path.exists(model_path):
            self.pipeline = joblib.load(model_path)


if __name__ == "__main__":
    df = pd.read_csv("data/processed/influencers_dataset.csv")
    predictor = EngagementRatePredictor()
    results = predictor.train(df)
    print(f"Engagement Model Metrics: R2={results['r2_score']}, MAE={results['mae']}%, RMSE={results['rmse']}%")
    print("\nTop 5 Feature Importances:")
    sorted_imps = sorted(predictor.feature_importances_.items(), key=lambda x: x[1], reverse=True)[:5]
    for feat, val in sorted_imps:
        print(f"  {feat}: {val*100:.1f}%")
    test_pred = predictor.predict_single(followers=45000, posting_freq=18, category="Tech & AI")
    print(f"\nPredicted ER for 45k Tech creator: {test_pred}%")
