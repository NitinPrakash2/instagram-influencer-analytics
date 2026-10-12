# AI-Powered Instagram Influencer Analytics & Automation Insights

## 📌 Project Overview
A comprehensive, end-to-end data analytics and AI/ML project designed to collect, clean, model, rank, and visualize data on 2,000+ Instagram influencers (< 1M followers).

Built for the **SR NEXT Self-Guided Internship Program**.

---

## 🗂️ Project Directory Structure

```text
instagram-influencer-analytics/
├── data/
│   ├── raw/                 # Raw collected data files
│   ├── processed/           # Cleaned and feature-engineered dataset (2000+ rows)
│   └── final/               # Final ranked dataset with AI predictions
├── src/
│   ├── scraper/             # Web scraping and data collection scripts
│   │   ├── __init__.py
│   │   ├── instagram_scraper.py
│   │   └── data_generator.py
│   ├── preprocessing/       # Data cleaning, normalization, and feature engineering
│   │   ├── __init__.py
│   │   ├── cleaner.py
│   │   └── feature_engineering.py
│   ├── models/              # AI/ML & NLP models (scikit-learn + Gemini)
│   │   ├── __init__.py
│   │   ├── nlp_classifier.py
│   │   ├── engagement_predictor.py
│   │   ├── automation_detector.py
│   │   ├── ranking_engine.py
│   │   └── gemini_analyzer.py
│   └── utils/               # Common helper utilities and logging
│       ├── __init__.py
│       └── helpers.py
├── dashboard/               # Interactive Streamlit Web Application
│   ├── app.py
│   └── components/
├── notebooks/               # Jupyter notebooks for EDA and experimentation
├── reports/                 # Project documentation and submission deliverables
│   ├── week1_report.md      # Tools, scraping pipeline, and data sources outline
│   └── week2_report.md      # Cleaned dataset summary, ML results & rankings
├── .env.example             # Environment variable template (Gemini API key)
├── requirements.txt         # Project dependencies
└── README.md                # Project documentation
```

---

## 🚀 Phases & Deliverables

### Phase 1: Data Collection & Preparation
- Target: 2,000+ Instagram influencers (< 1M followers).
- Fields: Handle, Followers, Category, Engagement Rate (last 10 posts), Posting Frequency, Bio Contact, Hashtags, Automation signals, Notes.
- Deliverables: Cleaned CSV/Excel dataset, Week 1 Report, Week 2 Report.

### Phase 2: AI-Powered Analysis & Ranking
- Feature Engineering: Engagement rate, posting frequency, hashtag diversity.
- AI/ML Models:
  1. **NLP Bio/Caption Analysis** (Niche & theme classification).
  2. **Engagement Prediction Model** (Predicting engagement using followers, posts, category).
  3. **Automation Tool Adoption Predictor** (Predicting automation usage likelihood).
- Ranking Engine: Multi-factor composite ranking per niche.
- Dashboard: Streamlit interactive dashboard with insights and filters.
