"""
Feature Engineering and Preprocessing Pipeline
Prepares tabular and text features for AI/ML modeling and ranking.
"""

import re
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from typing import Tuple, Dict, Any

class FeatureEngineeringPipeline:
    def __init__(self):
        self.scaler = StandardScaler()
        self.num_cols = [
            "followers", 
            "posting_frequency_monthly", 
            "avg_likes_per_post", 
            "avg_comments_per_post",
            "bio_length",
            "hashtag_count",
            "hashtag_diversity_score"
        ]
        
    def extract_engineered_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add derived analytical features from existing columns."""
        df_feat = df.copy()
        
        # 1. Text-based features
        df_feat["bio_length"] = df_feat["bio"].fillna("").apply(len)
        df_feat["bio_word_count"] = df_feat["bio"].fillna("").apply(lambda x: len(x.split()))
        
        # 2. Hashtag features
        def parse_hashtags(text: str):
            if not isinstance(text, str):
                return []
            return [tag.strip().lower() for tag in text.split() if tag.startswith("#")]
            
        df_feat["parsed_hashtags"] = df_feat["hashtags"].apply(parse_hashtags)
        df_feat["hashtag_count"] = df_feat["parsed_hashtags"].apply(len)
        
        # Hashtag diversity score (unique character entropy & tag length variation)
        def calc_hashtag_diversity(tags):
            if not tags:
                return 0.0
            unique_tags = len(set(tags))
            avg_len = sum(len(t) for t in tags) / len(tags)
            return round((unique_tags / max(1, len(tags))) * min(1.0, avg_len / 12.0), 3)
            
        df_feat["hashtag_diversity_score"] = df_feat["parsed_hashtags"].apply(calc_hashtag_diversity)
        
        # 3. Interaction Ratios
        df_feat["comment_to_like_ratio"] = (
            df_feat["avg_comments_per_post"] / df_feat["avg_likes_per_post"].replace(0, 1)
        ).round(4)
        
        # 4. Binary targets/flags
        df_feat["has_email"] = (df_feat["contact_available"] == "Yes").astype(int)
        df_feat["automation_binary"] = (df_feat["uses_automation"] == "Yes").astype(int)
        
        # 5. Log-scale followers for stable regression modeling
        df_feat["log_followers"] = np.log10(df_feat["followers"].clip(lower=100))
        
        return df_feat

    def prepare_ml_data(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series, pd.Series, pd.DataFrame]:
        """
        Prepare features (X), engagement target (y_engagement), automation target (y_automation), and full processed dataframe.
        """
        df_processed = self.extract_engineered_features(df)
        
        # Features for models
        feature_cols = [
            "log_followers",
            "posting_frequency_monthly",
            "bio_length",
            "hashtag_count",
            "hashtag_diversity_score",
            "comment_to_like_ratio",
            "category"
        ]
        
        X = df_processed[feature_cols].copy()
        y_engagement = df_processed["engagement_rate_pct"].copy()
        y_automation = df_processed["automation_binary"].copy()
        
        return X, y_engagement, y_automation, df_processed


if __name__ == "__main__":
    df = pd.read_csv("data/processed/influencers_dataset.csv")
    pipeline = FeatureEngineeringPipeline()
    X, y_eng, y_auto, df_full = pipeline.prepare_ml_data(df)
    print("Features shape:", X.shape)
    print("Engagement Target summary:\n", y_eng.describe())
    print("Automation Target distribution:\n", y_auto.value_counts(normalize=True))
