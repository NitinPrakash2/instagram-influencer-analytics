"""
NLP Caption, Bio & Content Classification Model
Classifies influencer category/niche from textual bios and hashtags using TF-IDF and Logistic Regression / Naive Bayes.
Extracts key content themes and keywords per category.
"""

import os
import joblib
import pandas as pd
import numpy as np
from typing import Dict, List, Any, Tuple
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score

class InfluencerNLPClassifier:
    def __init__(self, max_features: int = 1500):
        self.vectorizer = TfidfVectorizer(
            max_features=max_features,
            stop_words="english",
            ngram_range=(1, 2)
        )
        self.classifier = LogisticRegression(max_iter=1000, C=1.0)
        self.is_trained = False
        self.model_dir = os.path.join(os.path.dirname(__file__), "saved_models")
        os.makedirs(self.model_dir, exist_ok=True)
        
    def combine_text_features(self, df: pd.DataFrame) -> pd.Series:
        """Combine bio and hashtags into a single text corpus."""
        bio = df["bio"].fillna("")
        hashtags = df["hashtags"].fillna("")
        return bio + " " + hashtags

    def train(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Train the NLP text classification model."""
        texts = self.combine_text_features(df)
        labels = df["category"]
        
        X_train, X_test, y_train, y_test = train_test_split(
            texts, labels, test_size=0.2, random_state=42, stratify=labels
        )
        
        # Fit TF-IDF Vectorizer
        X_train_vec = self.vectorizer.fit_transform(X_train)
        X_test_vec = self.vectorizer.transform(X_test)
        
        # Fit Classifier
        self.classifier.fit(X_train_vec, y_train)
        self.is_trained = True
        
        # Evaluate
        y_pred = self.classifier.predict(X_test_vec)
        acc = accuracy_score(y_test, y_pred)
        report = classification_report(y_test, y_pred, output_dict=True)
        
        # Save model artifacts
        joblib.dump(self.vectorizer, os.path.join(self.model_dir, "tfidf_vectorizer.joblib"))
        joblib.dump(self.classifier, os.path.join(self.model_dir, "nlp_classifier.joblib"))
        
        return {
            "accuracy": round(float(acc), 4),
            "report": report
        }

    def predict_category(self, text: str) -> Tuple[str, float]:
        """Predict category and confidence score for a new text/bio."""
        if not self.is_trained:
            self.load()
            
        vec = self.vectorizer.transform([text])
        pred = self.classifier.predict(vec)[0]
        probs = self.classifier.predict_proba(vec)[0]
        confidence = float(np.max(probs))
        return pred, round(confidence, 3)

    def extract_top_keywords_per_category(self, df: pd.DataFrame, top_n: int = 6) -> Dict[str, List[str]]:
        """Extract the most prominent keywords characterizing each category."""
        keywords_by_cat = {}
        for cat in df["category"].unique():
            cat_texts = self.combine_text_features(df[df["category"] == cat])
            vec = TfidfVectorizer(max_features=25, stop_words="english")
            try:
                tfidf_mat = vec.fit_transform(cat_texts)
                scores = np.asarray(tfidf_mat.sum(axis=0)).flatten()
                top_indices = scores.argsort()[::-1][:top_n]
                feature_names = np.array(vec.get_feature_names_out())
                keywords_by_cat[cat] = list(feature_names[top_indices])
            except Exception:
                keywords_by_cat[cat] = []
        return keywords_by_cat

    def load(self):
        """Load saved models from disk."""
        vec_path = os.path.join(self.model_dir, "tfidf_vectorizer.joblib")
        clf_path = os.path.join(self.model_dir, "nlp_classifier.joblib")
        if os.path.exists(vec_path) and os.path.exists(clf_path):
            self.vectorizer = joblib.load(vec_path)
            self.classifier = joblib.load(clf_path)
            self.is_trained = True


if __name__ == "__main__":
    df = pd.read_csv("data/processed/influencers_dataset.csv")
    nlp_model = InfluencerNLPClassifier()
    results = nlp_model.train(df)
    print(f"NLP Model Training Accuracy: {results['accuracy'] * 100:.2f}%")
    sample_text = "Senior software engineer building deep learning models in Python. DM for tutorials."
    pred_cat, conf = nlp_model.predict_category(sample_text)
    print(f"Sample Prediction for '{sample_text}': {pred_cat} (Confidence: {conf*100:.1f}%)")
