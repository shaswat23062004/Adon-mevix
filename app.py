from flask import Flask, render_template, request, jsonify
from datetime import datetime
import json
import os

app = Flask(__name__)

DATA_FILE = os.path.join(os.path.dirname(__file__), "submissions.json")

PLANS = [
    {
        "id": "basic",
        "name": "Basic",
        "price": "9,999",
        "tagline": "Perfect for small businesses",
        "icon": "rocket",
        "featured": False,
        "features": [
            "2 Social Media Platforms",
            "15 Posts Per Month",
            "Basic Graphics",
            "Engagement Management",
            "Unlimited Design Revisions",
            "Ad Management",
            "2 Campaigns Per Month",
            "Monthly Report",
        ],
    },
    {
        "id": "standard",
        "name": "Standard",
        "price": "19,999",
        "tagline": "Best for growing businesses",
        "icon": "trend",
        "featured": True,
        "features": [
            "3 Social Media Platforms",
            "23 Posts Per Month",
            "Reels + Stories",
            "Engagement Management",
            "Unlimited Design Revisions",
            "Advanced Ads Management",
            "5 Campaigns Per Month",
            "Monthly Report",
        ],
    },
    {
        "id": "premium",
        "name": "Premium",
        "price": "34,999",
        "tagline": "For businesses that want to lead the market",
        "icon": "crown",
        "featured": False,
        "features": [
            "4+ Social Media Platforms",
            "30 Posts Per Month",
            "Reels + Stories + Shorts",
            "Advanced Ads Management",
            "Influencer & Collab Outreach",
            "Priority Support",
            "Unlimited Design Revisions",
            "7 Campaigns Per Month",
            "Monthly Report",
        ],
    },
]

WEBSITE_PACKAGES = [
    {
        "id": "starter",
        "name": "Starter Website",
        "price": "6,000",
        "icon": "globe",
        "features": ["Mobile Responsive", "Contact Form", "Basic Features"],
    },
    {
        "id": "business",
        "name": "Business Website",
        "price": "12,000",
        "icon": "briefcase",
        "features": ["Mobile Responsive", "Contact Forms", "Theme Customization", "Basic Features"],
    },
    {
        "id": "premium-site",
        "name": "Premium Website",
        "price": "20,000",
        "icon": "crown",
        "features": ["Custom Design", "E-commerce / Advanced Features", "Theme Customization"],
    },
]

SERVICES = [
    {
        "title": "Social Media Marketing",
        "desc": "We handle your platforms, engagement, community and growth from day one.",
        "icon": "social",
    },
    {
        "title": "Stunning Websites",
        "desc": "Modern, responsive websites designed to convert visitors into customers.",
        "icon": "globe",
    },
    {
        "title": "Professional Branding",
        "desc": "A brand identity that makes your business instantly recognizable.",
        "icon": "brand",
    },
    {
        "title": "Creative Graphics",
        "desc": "High-quality posts, graphics and visuals that connect with your audience.",
        "icon": "graphics",
    },
    {
        "title": "Video Editing",
        "desc": "Reels, shorts and promotional videos cut for maximum engagement.",
        "icon": "video",
    },
    {
        "title": "Brochures & Flyers",
        "desc": "Print-ready collateral that tells your brand's story on paper.",
        "icon": "brochure",
    },
    {
        "title": "Catalogues & Magazines",
        "desc": "Multi-page layouts that showcase your products and services in depth.",
        "icon": "catalogue",
    },
    {
        "title": "Complete Digital Solutions",
        "desc": "Analytics, ads management and reporting — everything tied together.",
        "icon": "digital",
    },
]

WHY_CHOOSE = [
    {"title": "Expert Team", "desc": "A passionate team of creatives and strategists dedicated to your success.", "icon": "team"},
    {"title": "Quality Work", "desc": "We deliver outstanding quality that speaks for your brand.", "icon": "quality"},
    {"title": "On-Time Delivery", "desc": "We value your time and ensure every project is delivered on schedule.", "icon": "clock"},
    {"title": "Results Driven", "desc": "Our strategies are focused on real results and business growth.", "icon": "results"},
]

CONTACT = {
    "email": "info@adonmevix.com",
}

PORTFOLIO = [
    {
        "id": "1",
        "title": "Neon Brew Co.",
        "category": "Branding & Social",
        "tags": ["Branding", "Social Media", "Graphics"],
        "desc": "Full brand identity refresh and social media launch for a premium craft brewery. Grew their Instagram from 0 to 18k in 90 days.",
        "stats": [{"label": "Followers gained", "value": "18K"}, {"label": "Engagement rate", "value": "7.2%"}, {"label": "Posts/month", "value": "23"}],
        "color": "#7B2FF7",
    },
    {
        "id": "2",
        "title": "Zenith Realty",
        "category": "Website & SEO",
        "tags": ["Website", "Branding", "Ads"],
        "desc": "Built a high-converting property listing website with advanced search, virtual tours and a full Google Ads funnel.",
        "stats": [{"label": "Leads/month", "value": "340+"}, {"label": "Conversion rate", "value": "4.8%"}, {"label": "Avg. session", "value": "3m 40s"}],
        "color": "#C9952C",
    },
    {
        "id": "3",
        "title": "FitFuel Nutrition",
        "category": "Complete Digital",
        "tags": ["Social Media", "Video", "Ads"],
        "desc": "End-to-end digital launch: branding, reels strategy, influencer collabs and paid ads for a D2C nutrition brand.",
        "stats": [{"label": "Revenue growth", "value": "3.2×"}, {"label": "Reel views", "value": "1.4M"}, {"label": "ROAS", "value": "5.6×"}],
        "color": "#9B4DFF",
    },
    {
        "id": "4",
        "title": "The Silk Route",
        "category": "Branding & Print",
        "tags": ["Branding", "Catalogue", "Brochure"],
        "desc": "Complete brand system for a luxury fashion label: logo, lookbook, catalogue, social templates and print collateral.",
        "stats": [{"label": "Catalogue pages", "value": "64"}, {"label": "Print run", "value": "5,000"}, {"label": "Retailers onboarded", "value": "28"}],
        "color": "#F0B94D",
    },
    {
        "id": "5",
        "title": "CloudStack SaaS",
        "category": "Website & Video",
        "tags": ["Website", "Video", "Graphics"],
        "desc": "Product website, explainer video and motion-graphic onboarding flow for a B2B SaaS platform targeting SMEs.",
        "stats": [{"label": "Trial sign-ups", "value": "+210%"}, {"label": "Bounce rate drop", "value": "−38%"}, {"label": "Video views", "value": "92K"}],
        "color": "#7B2FF7",
    },
    {
        "id": "6",
        "title": "Marigold Café",
        "category": "Social Media",
        "tags": ["Social Media", "Photography", "Ads"],
        "desc": "Monthly social management, food photography direction, targeted Meta ads and loyalty campaign for a chain of 4 cafés.",
        "stats": [{"label": "Footfall increase", "value": "+55%"}, {"label": "Online orders", "value": "+3×"}, {"label": "Reviews gained", "value": "800+"}],
        "color": "#C9952C",
    },
]

TEAM = [
    {"name": "Arjun Mehta",  "role": "Founder & Creative Director", "bio": "10+ years crafting brand stories for startups and enterprises alike.", "initial": "AM"},
    {"name": "Priya Sharma", "role": "Head of Digital Strategy",    "bio": "Data-driven strategist who turns audience insights into growth engines.", "initial": "PS"},
    {"name": "Rohan Das",    "role": "Lead Web Developer",          "bio": "Full-stack developer specialising in performance-first web experiences.", "initial": "RD"},
    {"name": "Sneha Kapoor", "role": "Social Media Manager",        "bio": "Viral content architect with a knack for community building.", "initial": "SK"},
]

BLOG_POSTS = [
    {
        "slug": "social-media-trends-2025",
        "title": "7 Social Media Trends That Will Define 2025",
        "category": "Social Media",
        "date": "June 10, 2025",
        "read_time": "5 min read",
        "excerpt": "From AI-generated content to micro-community platforms, here are the shifts every brand needs to prepare for.",
        "body": [
            ("Short-form video is still king — but originality wins", "Reels and Shorts are saturated. The brands cutting through in 2025 are those leaning into unpolished, creator-style content. Authenticity is an algorithm signal."),
            ("AI content tools are table stakes, not an edge", "Every brand has access to AI copy generators now. What differentiates winners is curation and voice — knowing which output to use and how to layer in your brand's personality."),
            ("Micro-communities outperform broadcast channels", "Private groups and niche communities drive more qualified engagement than public feeds. Build a community around a shared interest, not just your product."),
            ("Social commerce is closing the funnel gap", "Instagram Checkout and TikTok Shop are turning discovery into purchase in a single session. If your product isn't shoppable on social, you're leaving conversions on the table."),
            ("LinkedIn is the underrated B2B growth channel", "Organic reach on LinkedIn is at an all-time high. Thought-leadership posts from founders consistently outperform company-page content."),
            ("Creator partnerships beat traditional influencers", "Nano and micro-creators with a tight niche deliver 3–5× the engagement rate of macro-influencers at a fraction of the cost."),
            ("Analytics are moving from vanity to revenue metrics", "Likes and follower counts are dead metrics. 2025 is about attributed revenue, cost-per-acquisition and lifetime value of community members."),
        ],
    },
    {
        "slug": "brand-identity-mistakes",
        "title": "5 Brand Identity Mistakes That Are Costing You Customers",
        "category": "Branding",
        "date": "May 28, 2025",
        "read_time": "4 min read",
        "excerpt": "Your logo isn't your brand. Here are the five identity errors we see most often — and how to fix them fast.",
        "body": [
            ("Inconsistent visual language across touchpoints", "Your Instagram uses one font, your website another, your packaging a third. Build a brand kit and enforce it across every channel."),
            ("Designing for yourself, not your audience", "Your brand colours should resonate with your ideal customer, not your personal taste. Mismatched aesthetics create instant cognitive dissonance."),
            ("Neglecting the verbal brand", "Your tone of voice is equally part of your brand identity. Define how you write captions, emails and CTAs — and stick to it."),
            ("Chasing trends instead of building timelessness", "Gradient logos are in this year and out the next. Aim for a visual identity that works for 5–10 years, then refresh incrementally."),
            ("No differentiation from category norms", "If your brand looks like every other brand in your category, you're invisible. Study competitors and deliberately stand apart in at least one dimension."),
        ],
    },
    {
        "slug": "website-conversion-guide",
        "title": "How to Turn Your Website Into a 24/7 Sales Machine",
        "category": "Web & SEO",
        "date": "May 14, 2025",
        "read_time": "6 min read",
        "excerpt": "Most business websites are digital brochures. Here's how to build one that actually generates leads while you sleep.",
        "body": [
            ("Your homepage has 3 seconds", "Visitors decide whether to stay within 3 seconds. Your headline must answer: what do you do, for whom, and why should I care — instantly."),
            ("Social proof above the fold", "A single powerful quote or recognisable client logo placed high on the page increases conversion by an average of 34%."),
            ("One primary CTA per page", "Multiple competing calls-to-action create decision paralysis. Every page should have one primary action you want visitors to take."),
            ("Page speed is a conversion lever", "A 1-second delay in page load reduces conversions by 7%. Compress images, use a CDN, and audit your Core Web Vitals monthly."),
            ("Mobile-first is non-negotiable", "Over 65% of web traffic in India is mobile. If your website is a desktop site that 'also works' on mobile, you're losing the majority of potential customers."),
            ("Build trust with transparency", "About pages, team photos and clear pricing dramatically reduce anxiety in potential customers. More information = lower perceived risk."),
        ],
    },
]


def _load_submissions():
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []


def _save_submission(entry):
    data = _load_submissions()
    data.append(entry)
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)


@app.context_processor
def inject_globals():
    return {"contact": CONTACT, "current_year": datetime.now().year}


@app.route("/")
def home():
    return render_template(
        "index.html",
        services=SERVICES,
        why_choose=WHY_CHOOSE,
        plans=PLANS,
        portfolio=PORTFOLIO[:3],
        blog_posts=BLOG_POSTS[:2],
    )


@app.route("/services")
def services():
    return render_template("services.html", services=SERVICES, why_choose=WHY_CHOOSE)


@app.route("/pricing")
def pricing():
    return render_template("pricing.html", plans=PLANS, website_packages=WEBSITE_PACKAGES)


@app.route("/portfolio")
def portfolio():
    return render_template("portfolio.html", portfolio=PORTFOLIO)


@app.route("/about")
def about():
    return render_template("about.html", team=TEAM, why_choose=WHY_CHOOSE)


@app.route("/blog")
def blog():
    return render_template("blog.html", posts=BLOG_POSTS)


@app.route("/blog/<slug>")
def blog_post(slug):
    post = next((p for p in BLOG_POSTS if p["slug"] == slug), None)
    if not post:
        return render_template("404.html"), 404
    others = [p for p in BLOG_POSTS if p["slug"] != slug][:2]
    return render_template("blog_post.html", post=post, others=others)


@app.route("/contact", methods=["GET"])
def contact():
    return render_template("contact.html")


@app.route("/api/contact", methods=["POST"])
def api_contact():
    payload = request.get_json(silent=True) or request.form

    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip()
    phone = (payload.get("phone") or "").strip()
    plan = (payload.get("plan") or "Not specified").strip()
    message = (payload.get("message") or "").strip()

    errors = {}
    if not name:
        errors["name"] = "Tell us your name."
    if not email or "@" not in email:
        errors["email"] = "Enter a valid email address."
    if not message:
        errors["message"] = "Add a short message so we know how to help."

    if errors:
        return jsonify({"ok": False, "errors": errors}), 400

    entry = {
        "name": name,
        "email": email,
        "phone": phone,
        "plan": plan,
        "message": message,
        "submitted_at": datetime.utcnow().isoformat() + "Z",
    }
    _save_submission(entry)

    return jsonify({"ok": True, "message": f"Thanks {name.split()[0]}, we've received your message. We'll reach out within 24 hours."})


if __name__ == "__main__":
    app.run()
    # app.run(debug=True, host="0.0.0.0", port=5000)
