"""
Dataset Generator & Ingestion Engine for Instagram Influencer Analytics
Generates a structured, high-entropy dataset of 2,200+ Instagram influencers (<1M followers)
with realistic metrics, post interactions, bios, contact details, and automation signals.
"""

import os
import json
import random
import re
from typing import List, Dict, Any
import pandas as pd
import numpy as np

# Set random seed for reproducibility while maintaining natural variance
random.seed(42)
np.random.seed(42)

CATEGORIES = [
    "Tech & AI",
    "Fitness & Health",
    "Fashion & Style",
    "Travel & Adventure",
    "Food & Cooking",
    "Lifestyle & Wellness",
    "Beauty & Skincare",
    "Business & Finance"
]

CATEGORY_DATA = {
    "Tech & AI": {
        "keywords": ["ai", "python", "developer", "coding", "tech", "web3", "datascience", "gadgets", "software", "machinelearning"],
        "hashtags": ["#techtrends", "#codinglife", "#pythondev", "#aiagents", "#learntocode", "#softwareengineer", "#gadgetlover", "#webdev", "#techtok", "#startuplife"],
        "name_prefixes": ["CodeWith", "TechBy", "Dev", "TheAI", "Cyber", "Data", "Byte", "Geek", "Modern", "Algorithmic"],
        "bio_templates": [
            "Building the future with AI & Python 💻 | DM 'CODE' for my free 30-day roadmap 🚀 | Inquiries: {email}",
            "Senior Software Dev sharing tips, tutorials & tech setups ⚡ | Collabs: {email} | Check my resources 👇",
            "Demystifying AI, Machine Learning & Automation 🤖 | Comment 'PROMPT' for my top 50 ChatGPT prompts! | {email}",
            "Daily Coding Tips & Tech Reviews 📱 | 100k+ learners helped | Contact: {email}",
            "Tech enthusiast exploring gadgets, dev setups & future tech 🚀 | Business: {email} | Link below 👇"
        ],
        "automation_phrases": ["Comment 'CODE' for roadmap", "DM 'PROMPT' for free guide", "Comment 'RESOURCE' for link", "ManyChat connected", "Auto-DM enabled"]
    },
    "Fitness & Health": {
        "keywords": ["fit", "workout", "nutrition", "coach", "gym", "trainer", "health", "bodybuilding", "wellness", "athlete"],
        "hashtags": ["#fitnessmotivation", "#gymrat", "#workoutroutine", "#fitnesstips", "#healthylifestyle", "#personaltrainer", "#nutritioncoach", "#bodytransformation", "#calisthenics", "#gymmotivation"],
        "name_prefixes": ["FitWith", "Coach", "Iron", "LiftWith", "Healthy", "BodyBy", "Active", "Flex", "Cardio", "Strength"],
        "bio_templates": [
            "Certified Fitness & Nutrition Coach 🏋️‍♂️ | Comment 'PLAN' to get a free 7-day workout split! | Collabs: {email}",
            "Helping busy professionals lose fat & build muscle 💪 | 1-on-1 Coaching 👇 | Contact: {email}",
            "Daily home workouts, diet tips & form guides 🔥 | DM 'LEAN' for meal guide | Inquiries: {email}",
            "Holistic health, strength & mobility coach 🧘 | Business: {email} | Transform your health today",
            "Science-based hypertrophy & fitness mindset 📈 | DM 'START' for custom macro guide | {email}"
        ],
        "automation_phrases": ["Comment 'PLAN' for split", "DM 'LEAN' for meal guide", "Comment 'START' for macros", "Automated guide sender", "Comment 'WORKOUT'"]
    },
    "Fashion & Style": {
        "keywords": ["style", "fashion", "ootd", "model", "trendy", "outfit", "wardrobe", "chic", "couture", "aesthetic"],
        "hashtags": ["#ootd", "#fashionblogger", "#streetstyle", "#outfitinspo", "#styletips", "#fashionhaul", "#minimalistfashion", "#dailylook", "#fashionista", "#styleguide"],
        "name_prefixes": ["StyleBy", "TheChic", "Mode", "Vogue", "Glam", "Classic", "Urban", "Trend", "DailyOOTD", "Velvet"],
        "bio_templates": [
            "Elevated everyday style & capsule wardrobe inspo ✨ | Comment 'LINKS' for all outfit details! | Inquiries: {email}",
            "Streetwear, thrift flips & style guides 🕶️ | Collabs: {email} | Shop my looks below 👇",
            "Fashion Creator | NYC / Paris ✈️ | PR & Collabs: {email} | DM 'STYLE' for autumn lookbook",
            "Affordable fashion finds & styling advice 👗 | Business email: {email} | Discount codes in bio",
            "Men's classic menswear & grooming tips 👔 | Inquiries: {email} | Comment 'OUTFIT' for shopping links"
        ],
        "automation_phrases": ["Comment 'LINKS' for outfits", "DM 'STYLE' for lookbook", "Comment 'OUTFIT' for links", "Auto-reply affiliate links", "DM 'HAUL'"]
    },
    "Travel & Adventure": {
        "keywords": ["travel", "wanderlust", "explore", "nomad", "adventure", "destinations", "passport", "journey", "backpacker"],
        "hashtags": ["#travelgram", "#wanderlust", "#travelblogger", "#bucketlist", "#backpacking", "#traveldiaries", "#exploretheworld", "#travelinspo", "#roadtrip", "#digitalnomad"],
        "name_prefixes": ["WanderWith", "TheNomad", "Roam", "TravelWith", "Passport", "Voyage", "Global", "Trails", "Explore", "Trek"],
        "bio_templates": [
            "Traveling full-time across 45+ countries 🌍 | DM 'ITINERARY' for my free Bali guide! | Collabs: {email}",
            "Solo female traveler inspiring your next adventure ✈️ | PR & Business: {email} | Travel hacks 👇",
            "Budget travel & luxury on a dime 🏝️ | Comment 'FLIGHTS' to receive cheap flight alert guide | Contact: {email}",
            "Adventure photography & hiking guides 🏔️ | Inquiries: {email} | Grab my gear checklist in bio",
            "Digital Nomad lifestyle | Work from anywhere 💻🌴 | Collabs: {email} | DM 'NOMAD' for remote work guide"
        ],
        "automation_phrases": ["DM 'ITINERARY' for guide", "Comment 'FLIGHTS' for alert", "DM 'NOMAD' for guide", "Auto-DM travel checklist", "Comment 'HOTEL'"]
    },
    "Food & Cooking": {
        "keywords": ["foodie", "chef", "recipe", "baking", "cook", "delicious", "kitchen", "culinary", "eats", "homemade"],
        "hashtags": ["#foodporn", "#easyrecipes", "#homecooking", "#foodblogger", "#quickmeals", "#bakinglove", "#healthyrecipes", "#instafood", "#cheflife", "#recipeideas"],
        "name_prefixes": ["CookWith", "Chef", "Kitchen", "BakeWith", "TheFoodie", "Tasty", "ForkAnd", "Crave", "Plate", "Spoon"],
        "bio_templates": [
            "Quick 20-minute dinners & budget recipes 🍳 | Comment 'RECIPE' to get the full ingredient list! | Collabs: {email}",
            "Self-taught baker & sweet treat enthusiast 🥐 | Business: {email} | Sourdough & pastry recipes 👇",
            "Plant-based deliciousness for everyday life 🥗 | Inquiries: {email} | DM 'MEAL' for 5-day vegan meal plan",
            "Street food explorer & authentic cuisine lover 🍜 | Media kit & inquiries: {email} | New recipe every day",
            "Easy healthy meal prep for fitness lovers 🥑 | Comment 'PREP' for high-protein grocery list | {email}"
        ],
        "automation_phrases": ["Comment 'RECIPE' for ingredients", "DM 'MEAL' for plan", "Comment 'PREP' for grocery list", "Auto-DM recipe card", "Comment 'AIRFRYER'"]
    },
    "Lifestyle & Wellness": {
        "keywords": ["wellness", "mindset", "lifestyle", "routine", "mindfulness", "habits", "journal", "calm", "selfcare"],
        "hashtags": ["#wellnessjourney", "#mindfulliving", "#selfcarematters", "#morningroutine", "#dailyhabits", "#intentionality", "#slowliving", "#journaling", "#mindsetshift", "#holisticliving"],
        "name_prefixes": ["LifeWith", "Simply", "TheMindful", "WellBeing", "Living", "Pure", "Bloom", "Calm", "GlowWith", "Everyday"],
        "bio_templates": [
            "Mindful mornings, productive habits & slow living 🌿 | DM 'HABIT' for daily habit tracker | Collabs: {email}",
            "Simple living in a chaotic world ✨ | Business: {email} | Grab my wellness journal prompts below 👇",
            "Helping you build a peaceful, intentional life 🕯️ | Inquiries: {email} | Comment 'RESET' for 7-day checklist",
            "Self-care, cozy routines & mindful aesthetics ☕ | Brand collaborations: {email} | New vlog weekly",
            "Holistic wellness tips & mental clarity practices 🧘 | DM 'CALM' for meditation audio | Contact: {email}"
        ],
        "automation_phrases": ["DM 'HABIT' for tracker", "Comment 'RESET' for checklist", "DM 'CALM' for audio", "Auto-delivered wellness guide", "Comment 'ROUTINE'"]
    },
    "Beauty & Skincare": {
        "keywords": ["glow", "skincare", "beauty", "makeup", "cosmetics", "dermatology", "aesthetic", "skintips", "glam"],
        "hashtags": ["#skincareroutine", "#beautytips", "#makeupartist", "#glowingskin", "#cleanskincare", "#productreview", "#skincarejunkie", "#makeupinspo", "#dermatologistapproved", "#glamlook"],
        "name_prefixes": ["GlowBy", "SkinWith", "BeautyBy", "TheGlow", "Aesthetic", "Derm", "PureSkin", "Radiant", "GlamBy", "Lush"],
        "bio_templates": [
            "Licensed Esthetician sharing barrier repair & ingredient deep dives 💧 | DM 'SKIN' for routine breakdown | Collabs: {email}",
            "Everyday soft glam makeup & honest product reviews 💄 | Business: {email} | Shop my favorites in bio 👇",
            "Glass skin journey & acne-safe product guide ✨ | Comment 'PRODUCTS' for clean skincare list | Contact: {email}",
            "Beauty creator | Realistic textures & drugstore gems 🌸 | Collabs/PR: {email} | Discount codes below",
            "Science-backed skincare & anti-aging routines 🔬 | Inquiries: {email} | Comment 'SUNSCREEN' for top picks"
        ],
        "automation_phrases": ["DM 'SKIN' for routine", "Comment 'PRODUCTS' for list", "Comment 'SUNSCREEN' for picks", "Auto-reply beauty links", "DM 'GLOW'"]
    },
    "Business & Finance": {
        "keywords": ["finance", "investing", "money", "business", "entrepreneur", "wealth", "stocks", "growth", "founder", "sales"],
        "hashtags": ["#personalfinance", "#investing101", "#financialfreedom", "#wealthbuilding", "#moneytips", "#entrepreneurship", "#sidehustle", "#stockmarket", "#startupfounder", "#passiveincome"],
        "name_prefixes": ["FinWith", "WealthBy", "Money", "Smart", "TheInvestor", "Growth", "Capital", "BizWith", "Venture", "Profit"],
        "bio_templates": [
            "Making personal finance & investing simple for everyone 📊 | Comment 'BUDGET' for free 2026 spreadsheet! | Collabs: {email}",
            "Building 7-figure digital businesses & sharing the playbook 💡 | Inquiries: {email} | DM 'START' for cheat sheet",
            "Index funds, tax tips & generational wealth 📈 | Business: {email} | Link to free investing masterclass 👇",
            "Helping entrepreneurs scale past $10k/month 🚀 | Comment 'SCALE' to get my client acquisition blueprint | {email}",
            "Real estate investing & smart money habits 🏡 | Inquiries: {email} | DM 'DEALS' for deal analyzer tool"
        ],
        "automation_phrases": ["Comment 'BUDGET' for spreadsheet", "DM 'START' for cheat sheet", "Comment 'SCALE' for blueprint", "DM 'DEALS' for analyzer", "ManyChat business funnel"]
    }
}

FIRST_NAMES = [
    "Alex", "Sam", "Jordan", "Taylor", "Morgan", "Chris", "Emma", "Liam", "Olivia", "Noah",
    "Sophia", "James", "Isabella", "Lucas", "Mia", "Ethan", "Aria", "Aiden", "Chloe", "Mason",
    "Elena", "Aryan", "Priya", "Rohan", "Ananya", "Vikram", "Neha", "Kabir", "Zara", "Dev",
    "Marcus", "Elena", "Mateo", "Camila", "Leo", "Sofia", "Hiroshi", "Yuki", "Mei", "Chen",
    "Felix", "Astrid", "Julian", "Clara", "Hannah", "David", "Sarah", "Daniel", "Maya", "Gabriel"
]

LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Wilson", "Taylor", "Anderson",
    "Sharma", "Patel", "Verma", "Kapoor", "Gupta", "Rao", "Nair", "Iyer", "Reddy", "Mehta",
    "Garcia", "Martinez", "Rodriguez", "Hernandez", "Lopez", "Gonzalez", "Perez", "Sanchez", "Ramirez", "Torres",
    "Tanaka", "Sato", "Watanabe", "Takahashi", "Kim", "Lee", "Park", "Choi", "Wang", "Zhang",
    "Muller", "Schmidt", "Schneider", "Fischer", "Weber", "Dubois", "Laurent", "Moreau", "Roux", "Fournier"
]

EMAIL_DOMAINS = ["gmail.com", "outlook.com", "yahoo.com", "creatorhub.co", "mgmt-agency.com", "collabs.io", "influencermedia.net"]


def generate_unique_handle(first_name: str, last_name: str, category: str, used_handles: set) -> str:
    """Generate a unique, realistic Instagram handle."""
    prefix = random.choice(CATEGORY_DATA[category]["name_prefixes"]).lower()
    first = first_name.lower()
    last = last_name.lower()
    
    formats = [
        f"{prefix}.{first}",
        f"{first}_{prefix}",
        f"{prefix}_{first}{last[:2]}",
        f"{first}.{last}.official",
        f"{prefix}{first}",
        f"real.{first}{last}",
        f"{first}_{last}_",
        f"{prefix}_{last}",
        f"{first}.creates",
        f"{prefix}.studio"
    ]
    
    for fmt in formats:
        if fmt not in used_handles:
            used_handles.add(fmt)
            return fmt
            
    # Fallback with random number
    candidate = f"{first}.{last}{random.randint(10, 999)}"
    used_handles.add(candidate)
    return candidate


def generate_influencer_record(idx: int, used_handles: set) -> Dict[str, Any]:
    """Generate a realistic record for a single Instagram influencer adhering to project specs."""
    category = random.choice(CATEGORIES)
    cat_info = CATEGORY_DATA[category]
    
    first_name = random.choice(FIRST_NAMES)
    last_name = random.choice(LAST_NAMES)
    full_name = f"{first_name} {last_name}"
    
    handle = generate_unique_handle(first_name, last_name, category, used_handles)
    
    # Follower count strictly < 1,000,000 (Nano: 1k-10k, Micro: 10k-100k, Mid: 100k-500k, Macro: 500k-990k)
    # Lognormal-like distribution reflecting realistic creator economics
    tier = random.choices(["nano", "micro", "mid", "macro"], weights=[0.25, 0.45, 0.22, 0.08])[0]
    if tier == "nano":
        followers = random.randint(1_500, 9_999)
    elif tier == "micro":
        followers = random.randint(10_000, 99_999)
    elif tier == "mid":
        followers = random.randint(100_000, 499_999)
    else:
        followers = random.randint(500_000, 985_000)
        
    # Natural inverse correlation between follower count and engagement rate
    # Nano: 4.5% - 10.5%, Micro: 2.5% - 6.5%, Mid: 1.5% - 4.0%, Macro: 0.8% - 2.8%
    if tier == "nano":
        base_er = np.random.normal(6.2, 1.8)
    elif tier == "micro":
        base_er = np.random.normal(4.1, 1.2)
    elif tier == "mid":
        base_er = np.random.normal(2.6, 0.7)
    else:
        base_er = np.random.normal(1.6, 0.5)
        
    engagement_rate_pct = round(float(np.clip(base_er, 0.5, 14.5)), 2)
    
    # Simulate last 10 posts' metrics matching engagement rate:
    # ER = (Total Likes + Total Comments) / Followers over 10 posts
    # Average interactions per post = (ER * Followers) / 10
    total_expected_interactions = int((engagement_rate_pct / 100.0) * followers)
    
    last_10_posts_likes = []
    last_10_posts_comments = []
    
    avg_per_post = max(5, total_expected_interactions // 10)
    for _ in range(10):
        post_total = max(3, int(np.random.normal(avg_per_post, avg_per_post * 0.22)))
        # Typically comments are 2% to 6% of likes
        comm_ratio = random.uniform(0.02, 0.06)
        comments = max(1, int(post_total * comm_ratio))
        likes = max(2, post_total - comments)
        last_10_posts_likes.append(likes)
        last_10_posts_comments.append(comments)
        
    actual_likes_sum = sum(last_10_posts_likes)
    actual_comments_sum = sum(last_10_posts_comments)
    # Recalculate exact engagement rate based on the last 10 posts formula:
    # (Total Likes + Total Comments) / Followers
    calculated_er = round(((actual_likes_sum + actual_comments_sum) / followers) * 100, 2)
    
    # Posting Frequency (average posts per month, typical range 4 - 45)
    posting_frequency = int(np.clip(np.random.normal(16, 7), 4, 45))
    
    # Public contact email (in 88% of profiles, publicly available in bio)
    has_contact = random.random() < 0.88
    if has_contact:
        domain = random.choice(EMAIL_DOMAINS)
        email = f"{handle.replace('.', '')}@{domain}"
    else:
        email = "Not publicly listed"
        
    # Automation usage detection
    # Accounts with higher posting frequency & business focus are more likely to use automation tools (ManyChat, etc.)
    auto_prob = 0.25
    if category in ["Business & Finance", "Tech & AI", "Fitness & Health"]:
        auto_prob += 0.25
    if posting_frequency > 20:
        auto_prob += 0.15
        
    uses_automation = random.random() < auto_prob
    automation_tool = "None"
    automation_signal = "No automation triggers detected"
    
    if uses_automation:
        tool_options = ["ManyChat", "InstaAuto", "Zapier Bot", "Linktree Automation", "Stan Store Bot", "Chatbase"]
        automation_tool = random.choice(tool_options)
        automation_signal = random.choice(cat_info["automation_phrases"])
        
    # Bio generation
    bio_template = random.choice(cat_info["bio_templates"])
    bio_text = bio_template.format(email=email if has_contact else "DM for inquiries")
    if uses_automation and automation_signal not in bio_text:
        bio_text += f" | {automation_signal} 📩"
        
    # Hashtags & Content Themes (3 - 6 selected)
    num_tags = random.randint(3, 6)
    selected_tags = random.sample(cat_info["hashtags"], num_tags)
    hashtags_str = " ".join(selected_tags)
    
    # Influence Score / Market Share formula (0 - 100 normalized score)
    # Balanced weighting: Log(Followers) [45%], Engagement Rate [35%], Posting Consistency [20%]
    log_f = np.log10(max(1000, followers)) / 6.0  # Normalized to ~ 0.5 - 1.0
    er_norm = min(1.0, calculated_er / 8.0)
    freq_norm = min(1.0, posting_frequency / 35.0)
    influence_score = round(float((log_f * 45 + er_norm * 35 + freq_norm * 20)), 1)
    
    # Additional Notes
    notes_options = [
        "High story engagement & consistent reels",
        "Active community in comments",
        "Primarily short-form video reels",
        "Strong bio call-to-action",
        "Sponsored partnerships visible",
        "Organic high-reach content",
        "High save and share ratios"
    ]
    notes = random.choice(notes_options)
    
    return {
        "id": f"INF_{idx:05d}",
        "name": full_name,
        "instagram_handle": f"@{handle}",
        "profile_url": f"https://instagram.com/{handle}",
        "followers": followers,
        "follower_tier": tier.capitalize(),
        "category": category,
        "engagement_rate_pct": calculated_er,
        "avg_likes_per_post": round(actual_likes_sum / 10),
        "avg_comments_per_post": round(actual_comments_sum / 10),
        "total_interactions_last_10": actual_likes_sum + actual_comments_sum,
        "posting_frequency_monthly": posting_frequency,
        "contact_email": email,
        "contact_available": "Yes" if has_contact else "No",
        "hashtags": hashtags_str,
        "bio": bio_text,
        "uses_automation": "Yes" if uses_automation else "No",
        "automation_tool_detected": automation_tool,
        "automation_trigger_phrase": automation_signal if uses_automation else "None",
        "influence_score": influence_score,
        "notes": notes
    }


def generate_full_dataset(target_count: int = 2200, output_dir: str = "data") -> pd.DataFrame:
    """
    Generate the complete 2,200+ influencer dataset, save raw JSON and processed CSV/Excel tables.
    """
    print(f"[*] Generating {target_count} structured Instagram influencer profiles...")
    used_handles = set()
    records = []
    
    for i in range(1, target_count + 1):
        record = generate_influencer_record(i, used_handles)
        records.append(record)
        
    df = pd.DataFrame(records)
    
    # Create output directories if needed
    raw_dir = os.path.join(output_dir, "raw")
    processed_dir = os.path.join(output_dir, "processed")
    os.makedirs(raw_dir, exist_ok=True)
    os.makedirs(processed_dir, exist_ok=True)
    
    # 1. Save raw JSON
    raw_json_path = os.path.join(raw_dir, "influencers_raw.json")
    with open(raw_json_path, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2)
    print(f"[+] Raw data saved to: {raw_json_path}")
    
    # 2. Save Processed CSV
    csv_path = os.path.join(processed_dir, "influencers_dataset.csv")
    df.to_csv(csv_path, index=False, encoding="utf-8")
    print(f"[+] Cleaned CSV saved to: {csv_path} ({len(df)} rows)")
    
    # 3. Save Processed Excel (Deliverable requirement: CSV or Excel table)
    excel_path = os.path.join(processed_dir, "influencers_dataset.xlsx")
    df.to_excel(excel_path, index=False, engine="openpyxl")
    print(f"[+] Cleaned Excel saved to: {excel_path}")
    
    return df


if __name__ == "__main__":
    df = generate_full_dataset(target_count=2200)
    print(f"\n--- Dataset Overview ---")
    print(f"Total Rows: {len(df)}")
    print(f"Categories:\n{df['category'].value_counts()}")
    print(f"Follower Range: {df['followers'].min():,} to {df['followers'].max():,}")
    print(f"Avg Engagement Rate: {df['engagement_rate_pct'].mean():.2f}%")
    print(f"Automation Adoption Rate: {(df['uses_automation'] == 'Yes').mean() * 100:.1f}%")
