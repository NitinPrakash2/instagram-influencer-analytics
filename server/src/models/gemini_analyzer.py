"""
Gemini AI Analysis & Creator Insights Engine
Leverages Google Gemini API (via google-genai SDK) to generate executive summaries,
automation opportunities, and pitch angles for selected influencers.
Includes offline heuristic fallbacks when no API key is configured.
"""

import os
from typing import Dict, Any, Optional
from dotenv import load_dotenv

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
load_dotenv(os.path.join(BASE_DIR, ".env"))
load_dotenv()

class GeminiInfluencerAnalyzer:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.client = None
        
        if self.api_key and self.api_key != "your_gemini_api_key_here":
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"[!] Warning: Could not initialize Gemini client: {e}")
                self.client = None

    def generate_creator_insight(self, profile: Dict[str, Any]) -> str:
        """
        Generate an AI-powered evaluation of an influencer profile.
        Uses Gemini API if configured; otherwise provides high-quality local analytical evaluation.
        """
        handle = profile.get("instagram_handle", "@creator")
        category = profile.get("category", "General")
        followers = profile.get("followers", 0)
        er = profile.get("engagement_rate_pct", 0)
        auto_used = profile.get("uses_automation", "No")
        auto_tool = profile.get("automation_tool_detected", "None")
        score = profile.get("composite_influence_score", 0)
        tier = profile.get("influencer_tier", "Rising Star")
        bio = profile.get("bio", "")
        
        prompt = f"""
        Act as an expert Social Media & Influencer Marketing Strategist.
        Analyze the following Instagram creator:
        - Handle: {handle}
        - Category: {category}
        - Followers: {followers:,}
        - Engagement Rate: {er}%
        - Composite AI Influence Score: {score}/100 ({tier})
        - Automation Detected: {auto_used} (Tool: {auto_tool})
        - Bio: {bio}

        Provide a concise, high-impact assessment with 3 sections:
        1. Performance Summary & Audience Loyalty
        2. Automation & Workflow Opportunity
        3. Brand Collaboration Potential & Estimated Value
        """

        if self.client:
            try:
                response = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                if response and response.text:
                    return response.text
            except Exception as e:
                print(f"[!] Gemini API call failed: {e}. Falling back to offline analyzer.")

        # Offline analytical fallback
        auto_text = (
            f"Already leverages {auto_tool} automation to drive conversion and community DMs."
            if auto_used == "Yes"
            else "Currently has no automated DM funnels; adopting tools like ManyChat could increase lead conversion by 30-40%."
        )
        
        er_assessment = (
            "Outstanding engagement well above industry benchmark for their follower tier."
            if er > 5.0
            else "Healthy engagement aligned with standard organic discovery rates."
        )

        return f"""
### 📊 AI Strategic Analysis for {handle}
* **Performance & Reach:** Ranked as **{tier}** with an AI Composite Score of **{score}/100**. With **{followers:,}** followers and an engagement rate of **{er}%**, this creator exhibits {er_assessment}
* **Automation Workflow:** {auto_text}
* **Brand Partnership Value:** Prime fit for brands in the **{category}** vertical. Estimated partnership rate: **${max(150, int(followers * 0.008)):,} – ${max(300, int(followers * 0.018)):,} per sponsored post/reel**.
        """.strip()


if __name__ == "__main__":
    analyzer = GeminiInfluencerAnalyzer()
    sample_profile = {
        "instagram_handle": "@techby.alex",
        "category": "Tech & AI",
        "followers": 48200,
        "engagement_rate_pct": 5.4,
        "composite_influence_score": 72.8,
        "influencer_tier": "High-Impact (A-Tier)",
        "uses_automation": "Yes",
        "automation_tool_detected": "ManyChat",
        "bio": "Building AI agents with Python 💻 | DM 'CODE' for starter pack"
    }
    insight = analyzer.generate_creator_insight(sample_profile)
    print(insight)
