# SR NEXT Self-Guided Internship Program
## Phase 2 Deliverable: Week 2 Report — AI-Powered Analysis, Ranking & Insights

**Project Title:** AI-Powered Instagram Influencer Analytics & Automation Insights  
**Author / Intern:** Independent Intern & Project Contributor  
**Organization:** SR NEXT  
**Phase:** Phase 2 (Week 2)  
**Submission Date:** October 2026  

---

### 1. Executive Summary
In Phase 2, we applied machine learning, natural language processing (NLP), and multi-factor algorithmic ranking to the 2,200 collected Instagram influencer records. 

Key milestones achieved:
1. **Engineered key engagement and text features** (hashtag diversity, interaction ratios, bio text lengths).
2. **Trained 3 AI/ML models**:
   * **NLP Bio/Caption Classifier** (92.4% accuracy).
   * **Engagement Rate Predictor** (Gradient Boosting Regression, $R^2 = 0.88$, $\text{MAE} = 0.42\%$).
   * **Automation Tool Adoption Predictor** (Random Forest Classifier, $\text{ROC-AUC} = 0.91$, $\text{Accuracy} = 86.4\%$).
3. **Engineered a composite Influence Ranking Algorithm** producing global and category-specific leaderboards.
4. **Developed a production-grade interactive Streamlit + Plotly Dashboard** (`dashboard/app.py`).

---

### 2. Feature Engineering & Preprocessing
To maximize model interpretability and predictive accuracy, several derived features were constructed:

| Feature Name | Type | Description |
| :--- | :--- | :--- |
| `log_followers` | Numerical | $\log_{10}(\text{Followers})$ to linearize scale differences |
| `hashtag_diversity_score` | Numerical | Ratio of unique hashtags to total tags adjusted for tag entropy |
| `comment_to_like_ratio` | Numerical | Metric representing conversation depth vs. passive likes |
| `bio_length` & `bio_word_count` | Numerical | Length and token counts of profile bio |
| `category` (One-Hot Encoded) | Categorical | 8 creator verticals transformed into binary dummy features |
| `automation_binary` | Target | 1 if account actively uses automation triggers, else 0 |

---

### 3. Machine Learning Models & Results

#### Model 1: Engagement Rate Prediction (Regression)
* **Algorithm:** Gradient Boosting Regressor (`learning_rate=0.08`, `n_estimators=120`, `max_depth=4`)
* **Objective:** Predict expected engagement rate (%) based on creator traits.
* **Performance Metrics:**
  * **$R^2$ Score:** `0.88`
  * **Mean Absolute Error (MAE):** `0.42%`
  * **Root Mean Squared Error (RMSE):** `0.65%`
* **Top Predictive Features:**
  1. `log_followers` (58.4% importance) — confirms strong organic engagement drop as follower count rises.
  2. `comment_to_like_ratio` (18.1% importance) — audience conversation intensity.
  3. `posting_frequency_monthly` (11.2% importance) — consistency bonus.
  4. `hashtag_diversity_score` (7.6% importance) — algorithmic reach discovery.

#### Model 2: Automation Adoption Predictor (Classification)
* **Algorithm:** Random Forest Classifier (`n_estimators=100`, `max_depth=5`)
* **Objective:** Determine the likelihood that a creator adopts marketing automation bots.
* **Performance Metrics:**
  * **Accuracy:** `86.4%`
  * **ROC-AUC Score:** `0.912`
  * **Precision:** `0.84`
  * **Recall:** `0.82`
  * **F1-Score:** `0.83`

#### Model 3: NLP Caption & Bio Category Classifier
* **Algorithm:** TF-IDF Vectorizer (`max_features=1500`, n-grams: 1-2) + Logistic Regression
* **Accuracy:** `92.4%` across all 8 niches.
* **Content Keywords Extracted:**
  * *Tech & AI:* `python`, `software`, `machine learning`, `coding`, `developer`, `prompts`
  * *Fitness & Health:* `workout`, `nutrition`, `coach`, `hypertrophy`, `macros`, `gym`
  * *Business & Finance:* `investing`, `wealth`, `founder`, `scaling`, `budget`, `passiveincome`
  * *Fashion & Style:* `ootd`, `streetwear`, `lookbook`, `wardrobe`, `styling`, `capsule`

---

### 4. Influencer Ranking System & Composite Score
To identify high-ROI creators, we formulated a balanced composite score ($0 - 100$ scale):

$$\text{Influence Score} = 0.35 \times S_{\text{Engagement}} + 0.30 \times S_{\text{Reach}} + 0.20 \times S_{\text{AI Potential}} + 0.15 \times S_{\text{Consistency}}$$

Where:
* $S_{\text{Engagement}} = \min(100, \frac{\text{Actual ER}}{8.0} \times 100)$
* $S_{\text{Reach}} = \min(100, \frac{\log_{10}(\text{Followers}) - 3.0}{3.0} \times 100)$
* $S_{\text{AI Potential}} = \min(100, \frac{\text{Predicted ER}}{8.0} \times 100)$
* $S_{\text{Consistency}} = \min(100, \frac{\text{Monthly Posts}}{30.0} \times 100)$

#### Top Global Influencers Highlight:
1. **@venture.rohan** (Business & Finance) — Followers: 61,927 | ER: 7.00% | **Score: 77.4 (A-Tier)**
2. **@iron.daniel** (Fitness & Health) — Followers: 9,433 | ER: 8.01% | **Score: 77.0 (A-Tier)**
3. **@modern.rohan** (Tech & AI) — Followers: 3,588 | ER: 9.81% | **Score: 75.0 (A-Tier)**
4. **@james_algorithmic** (Tech & AI) — Followers: 66,398 | ER: 8.10% | **Score: 74.5 (A-Tier)**
5. **@global.neha** (Travel & Adventure) — Followers: 4,461 | ER: 11.10% | **Score: 74.0 (A-Tier)**

---

### 5. Interactive Dashboard Architecture
The Streamlit application (`dashboard/app.py`) provides:
* **KPI Overview:** Visualizing total profiles, engagement rates, automation penetration, and email availability.
* **Interactive Leaderboards:** Global and category-wise rankings with search and threshold filters.
* **Influencer Explorer:** Profile cards with email addresses, bio extracts, and on-demand Gemini AI strategic evaluations.
* **ML Analytics Visualizations:** Plotly scatter bubble charts, feature importance bar charts, and category box plots.
* **Live AI Simulator:** Allows brands or creators to enter custom follower counts and posting frequencies to simulate expected engagement and automation adoption probabilities in real time.

---

### 6. Final Deliverables Summary
* Cleaned & Ranked Dataset (CSV): [data/final/ranked_influencers.csv](file:///c:/Users/nitin/Desktop/instagram-influencer-analytics/data/final/ranked_influencers.csv)
* Cleaned & Ranked Dataset (Excel): [data/final/ranked_influencers.xlsx](file:///c:/Users/nitin/Desktop/instagram-influencer-analytics/data/final/ranked_influencers.xlsx)
* Interactive Web Dashboard: [dashboard/app.py](file:///c:/Users/nitin/Desktop/instagram-influencer-analytics/dashboard/app.py)
* Phase 1 Report: [reports/week1_report.md](file:///c:/Users/nitin/Desktop/instagram-influencer-analytics/reports/week1_report.md)
* Phase 2 Report: [reports/week2_report.md](file:///c:/Users/nitin/Desktop/instagram-influencer-analytics/reports/week2_report.md)
