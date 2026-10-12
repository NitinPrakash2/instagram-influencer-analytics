"""
Automation Tool Adoption Predictor (Classification)
Predicts the likelihood of an Instagram creator adopting automation tools (ManyChat, automated DMs, bots)
based on posting frequency, bio trigger keywords, follower tier, and niche category.
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
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score, accuracy_score

from src.preprocessing.feature_engineering import FeatureEngineeringPipeline

class AutomationAdoptionPredictor:
    def __init__(self):
        self.feat_pipeline = FeatureEngineeringPipeline()
        self.pipeline = None
        self.metrics = {}
        self.model_dir = os.path.join(os.path.dirname(__file__), "saved_models")
        os.makedirs(self.model_dir, exist_ok=True)
        
    def train(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Train classifier to predict automation tool adoption."""
        X, _, y_auto, _ = self.feat_pipeline.prepare_ml_data(df)
        
        num_features = [
            "log_followers",
            "posting_frequency_monthly",
            "bio_length",
            "hashtag_count",
            "hashtag_diversity_score",
            "comment_to_like_ratio"
        ]
        cat_features = ["category"]
        
        preprocessor = ColumnTransformer(
            transformers=[
                ("num", StandardScaler(), num_features),
                ("cat", OneHotEncoder(drop="first", sparse_output=False), cat_features)
            ]
        )
        
        classifier = RandomForestClassifier(
            n_estimators=100,
            max_depth=5,
            random_state=42
        )
        
        self.pipeline = Pipeline(steps=[
            ("preprocessor", preprocessor),
            ("classifier", classifier)
        ])
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y_auto, test_size=0.2, random_state=42, stratify=y_auto
        )
        
        self.pipeline.fit(X_train, y_train)
        
        # Predictions & Metrics
        y_pred = self.pipeline.predict(X_test)
        y_prob = self.pipeline.predict_proba(X_test)[:, 1]
        
        acc = accuracy_score(y_test, y_pred)
        roc_auc = roc_auc_score(y_test, y_prob)
        report = classification_report(y_test, y_pred, output_dict=True)
        
        self.metrics = {
            "accuracy": round(float(acc), 4),
            "roc_auc": round(float(roc_auc), 4),
            "precision": round(float(report["1"]["precision"]), 4),
            "recall": round(float(report["1"]["recall"]), 4),
            "f1_score": round(float(report["1"]["f1-score"]), 4)
        }
        
        # Save model
        joblib.dump(self.pipeline, os.path.join(self.model_dir, "automation_detector.joblib"))
        
        return self.metrics

    def predict_likelihood(self, followers: int, posting_freq: int, category: str, bio: str = "", hashtags: str = "") -> float:
        """Predict automation adoption probability (0 - 100%) for a creator."""
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
        prob = self.pipeline.predict_proba(X_sample)[0][1]
        return round(float(prob * 100), 1)

    def load(self):
        """Load trained pipeline from disk."""
        model_path = os.path.join(self.model_dir, "automation_detector.joblib")
        if os.path.exists(model_path):
            self.pipeline = joblib.load(model_path)


if __name__ == "__main__":
    df = pd.read_csv("data/processed/influencers_dataset.csv")
    detector = AutomationAdoptionPredictor()
    results = detector.train(df)
    print(f"Automation Model Metrics: Accuracy={results['accuracy']*100:.2f}%, ROC-AUC={results['roc_auc']:.3f}, F1={results['f1_score']:.3f}")
    sample_prob = detector.predict_likelihood(followers=35000, posting_freq=28, category="Business & Finance")
    print(f"Predicted Automation Adoption for 35k Business creator: {sample_prob}%")
