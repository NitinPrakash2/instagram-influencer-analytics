"""
Influencer Ranking Engine
Combines actual engagement, audience reach, posting consistency, and AI model predictions
into a unified composite influence score, assigning global and category-wise ranks.
"""

import os
import sys

# Ensure root directory is in python path
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

import pandas as pd
import numpy as np
from typing import Dict, Any

from src.models.nlp_classifier import InfluencerNLPClassifier
from src.models.engagement_predictor import EngagementRatePredictor
from src.models.automation_detector import AutomationAdoptionPredictor

class InfluencerRankingEngine:
    def __init__(self, data_path: str = "data/processed/influencers_dataset.csv"):
        self.data_path = data_path
        self.nlp_model = InfluencerNLPClassifier()
        self.eng_model = EngagementRatePredictor()
        self.auto_model = AutomationAdoptionPredictor()
        
    def train_all_models(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Train all three models before executing the ranking pipeline."""
        print("[*] Training NLP Caption & Bio Classifier...")
        nlp_res = self.nlp_model.train(df)
        
        print("[*] Training Engagement Prediction Regressor...")
        eng_res = self.eng_model.train(df)
        
        print("[*] Training Automation Adoption Classifier...")
        auto_res = self.auto_model.train(df)
        
        return {
            "nlp": nlp_res,
            "engagement": eng_res,
            "automation": auto_res
        }

    def compute_rankings(self, output_dir: str = "data/final") -> pd.DataFrame:
        """Calculate composite scores, rank influencers globally and per category, and export deliverables."""
        df = pd.read_csv(self.data_path)
        metrics = self.train_all_models(df)
        
        print("[*] Computing AI predictions for all 2,200+ creators...")
        
        # 1. Feature Engineering inputs
        from src.preprocessing.feature_engineering import FeatureEngineeringPipeline
        feat_pipe = FeatureEngineeringPipeline()
        X, _, _, _ = feat_pipe.prepare_ml_data(df)
        
        # 2. Model Predictions
        predicted_er = self.eng_model.pipeline.predict(X)
        predicted_er = np.clip(predicted_er, 0.4, 18.0)
        df["predicted_engagement_rate"] = np.round(predicted_er, 2)
        
        automation_probs = self.auto_model.pipeline.predict_proba(X)[:, 1]
        df["automation_adoption_likelihood_pct"] = np.round(automation_probs * 100, 1)
        
        # 3. Composite Multi-Factor Scoring (0 - 100 Scale)
        # Factor A: Actual Engagement Performance (35% weight)
        eng_norm = np.clip(df["engagement_rate_pct"] / 8.0, 0, 1.0) * 100
        
        # Factor B: Reach / Follower Capital (30% weight) - Logarithmic scale (1k - 1M)
        log_followers = np.log10(df["followers"].clip(lower=1000))
        reach_norm = np.clip((log_followers - 3.0) / 3.0, 0, 1.0) * 100
        
        # Factor C: AI Model Potential / Expected Performance (20% weight)
        pred_norm = np.clip(df["predicted_engagement_rate"] / 8.0, 0, 1.0) * 100
        
        # Factor D: Consistency & Activity (15% weight)
        freq_norm = np.clip(df["posting_frequency_monthly"] / 30.0, 0, 1.0) * 100
        
        composite_score = (
            eng_norm * 0.35 +
            reach_norm * 0.30 +
            pred_norm * 0.20 +
            freq_norm * 0.15
        )
        
        df["composite_influence_score"] = np.round(composite_score, 1)
        
        # 4. Global Ranking
        df = df.sort_values(by="composite_influence_score", ascending=False).reset_index(drop=True)
        df["global_rank"] = df.index + 1
        
        # 5. Category-wise Ranking
        df["category_rank"] = df.groupby("category")["composite_influence_score"].rank(ascending=False, method="min").astype(int)
        
        # 6. Assign Tier Badges
        def assign_tier(score):
            if score >= 80:
                return "Elite (S-Tier)"
            elif score >= 65:
                return "High-Impact (A-Tier)"
            elif score >= 50:
                return "Rising Star (B-Tier)"
            else:
                return "Emerging (C-Tier)"
                
        df["influencer_tier"] = df["composite_influence_score"].apply(assign_tier)
        
        # 7. Save Final Deliverables
        os.makedirs(output_dir, exist_ok=True)
        csv_path = os.path.join(output_dir, "ranked_influencers.csv")
        excel_path = os.path.join(output_dir, "ranked_influencers.xlsx")
        
        df.to_csv(csv_path, index=False, encoding="utf-8")
        df.to_excel(excel_path, index=False, engine="openpyxl")
        
        print(f"[+] Final Ranked CSV saved to: {csv_path}")
        print(f"[+] Final Ranked Excel saved to: {excel_path}")
        
        return df, metrics


if __name__ == "__main__":
    engine = InfluencerRankingEngine()
    ranked_df, metrics = engine.compute_rankings()
    print("\n--- Top 5 Global Influencers ---")
    cols_to_show = ["global_rank", "category_rank", "name", "instagram_handle", "category", "followers", "engagement_rate_pct", "composite_influence_score", "influencer_tier"]
    print(ranked_df[cols_to_show].head(5).to_string(index=False))
