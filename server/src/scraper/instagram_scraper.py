"""
Public Instagram Data Scraper & Parser Utility
Uses requests, fake-useragent, and BeautifulSoup to fetch public Instagram profile data and metadata.
"""

import re
import json
import time
from typing import Dict, Any, Optional
import requests
from bs4 import BeautifulSoup
from fake_useragent import UserAgent

class InstagramPublicScraper:
    def __init__(self, timeout: int = 10):
        self.timeout = timeout
        self.ua = UserAgent()
        self.session = requests.Session()
        
    def get_headers(self) -> Dict[str, str]:
        return {
            "User-Agent": self.ua.random,
            "Accept-Language": "en-US,en;q=0.9",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Referer": "https://www.google.com/"
        }
        
    def extract_bio_emails(self, text: str) -> Optional[str]:
        """Extract public email address from bio string using regex."""
        email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
        matches = re.findall(email_pattern, text)
        return matches[0] if matches else None

    def detect_automation_triggers(self, bio_text: str) -> Dict[str, Any]:
        """Detect automated DM keywords like 'Comment X for link', ManyChat triggers, etc."""
        lower_bio = bio_text.lower()
        triggers = [
            r"comment\s+['\"][a-z0-9_-]+['\"]",
            r"dm\s+['\"][a-z0-9_-]+['\"]",
            r"manychat",
            r"stan\.store",
            r"linktr\.ee",
            r"free\s+guide\s+below",
            r"auto-reply"
        ]
        
        detected = []
        for pat in triggers:
            found = re.findall(pat, lower_bio)
            if found:
                detected.extend(found)
                
        return {
            "has_automation": len(detected) > 0,
            "detected_signals": detected,
            "automation_tool": "ManyChat/ChatBot" if detected else "None"
        }

    def fetch_public_profile_meta(self, username: str) -> Dict[str, Any]:
        """
        Fetch public metadata from Instagram web profile.
        Falls back gracefully if Instagram challenges/rate-limits guest sessions.
        """
        clean_user = username.strip().lstrip("@")
        url = f"https://www.instagram.com/{clean_user}/"
        
        try:
            response = self.session.get(url, headers=self.get_headers(), timeout=self.timeout)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, "html.parser")
                meta_desc = soup.find("meta", property="og:description")
                content = meta_desc["content"] if meta_desc and "content" in meta_desc.attrs else ""
                
                # Parse follower count from standard OpenGraph description
                # Example format: "125K Followers, 450 Following, 320 Posts - See Instagram photos and videos from..."
                followers_match = re.search(r"([\d.,]+[KkMm]?)\s+Followers", content)
                followers_str = followers_match.group(1) if followers_match else "Unknown"
                
                return {
                    "username": clean_user,
                    "profile_url": url,
                    "followers_raw": followers_str,
                    "meta_description": content,
                    "status": "success"
                }
            else:
                return {
                    "username": clean_user,
                    "profile_url": url,
                    "status": f"HTTP_{response.status_code}",
                    "note": "Rate-limited or requires session authentication"
                }
        except Exception as e:
            return {
                "username": clean_user,
                "status": "error",
                "error": str(e)
            }


if __name__ == "__main__":
    scraper = InstagramPublicScraper()
    test_bio = "Full stack dev & AI researcher 🚀 | DM 'CODE' for python starter pack | Business: alex@creatorhub.co"
    print("Test Email Extraction:", scraper.extract_bio_emails(test_bio))
    print("Test Automation Detection:", scraper.detect_automation_triggers(test_bio))
