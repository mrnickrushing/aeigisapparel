from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout,
    CheckoutSessionRequest,
)
import os
import logging
import uuid
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

STRIPE_API_KEY = os.environ.get("STRIPE_API_KEY", "")

# Bump this to wipe + reseed products & campaigns on next startup
SEED_VERSION = "aegis-v1"

app = FastAPI(title="AEGIS API — Strength in Order")
api_router = APIRouter(prefix="/api")


# ---------- MODELS ----------
class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    name: str
    short: str                   # short tagline / subtitle
    category: str                # tshirt, hoodie, hat, sticker, patch, coin, tumbler
    division: str                # core | legacy
    is_award_only: bool = False  # legacy items require unlock code
    price: float
    description: str
    images: List[str] = []
    accent: str = "#D4AF37"
    sizes: List[str] = []
    colors: List[str] = []
    badge: Optional[str] = None
    featured: bool = False


class Campaign(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    code: str
    slug: str
    name: str
    status: str                  # active | coming_soon | classified
    tagline: str
    description: str
    accent: str
    image: str
    bullets: List[str] = []
    is_unlocked: bool = True


class CartItemIn(BaseModel):
    product_id: str
    quantity: int = 1
    size: Optional[str] = None
    color: Optional[str] = None


class CheckoutRequest(BaseModel):
    items: List[CartItemIn]
    origin_url: str
    customer_name: str
    customer_email: str
    address_line1: str
    address_line2: Optional[str] = ""
    city: str
    state: str
    zip_code: str
    country: str = "USA"
    notes: Optional[str] = ""


class OrderRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: Optional[str] = None
    items: List[Dict]
    subtotal: float
    shipping: float
    total: float
    customer: Dict
    payment_status: str = "pending"
    status: str = "pending"
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


class RedeemIn(BaseModel):
    code: str


class LegacyRequestIn(BaseModel):
    full_name: str
    email: str
    unit: Optional[str] = ""
    story: str


class ContactIn(BaseModel):
    full_name: str
    email: str
    subject: Optional[str] = ""
    message: str


# ---------- SEED DATA ----------
SIZES = ["S", "M", "L", "XL", "2XL", "3XL"]

CORE_PRODUCTS_RAW = [
    {
        "slug": "tactical-white-tee",
        "name": "AEGIS Tactical White Tee",
        "short": "The Foundation. Bone white. Heavyweight.",
        "category": "tshirt",
        "price": 34.0,
        "images": ["/aegis/tactical-white-tee.jpg"],
        "accent": "#C7CCD4",
        "sizes": SIZES,
        "colors": ["Bone White"],
        "badge": "BESTSELLER",
        "featured": True,
        "description": "AEGIS CORE — Tactical White. Bone-white heavyweight cotton with the AEGIS chestplate on the front and the full CORE shield on the back. Stitched flag on the sleeve. Built for the line, made to last beyond it.",
    },
    {
        "slug": "tactical-black-tee",
        "name": "AEGIS Tactical Black Tee",
        "short": "Bronze on black. Discipline you can wear.",
        "category": "tshirt",
        "price": 34.0,
        "images": ["/aegis/core-black-tee.jpg"],
        "accent": "#B08B4F",
        "sizes": SIZES,
        "colors": ["Black"],
        "badge": "NEW",
        "featured": True,
        "description": "AEGIS CORE — Tactical Black. Antique bronze CORE crest on midnight black, USA flag on sleeve. The everyday uniform of the Order. Heavyweight, pre-shrunk, riot-rated.",
    },
    {
        "slug": "core-hoodie-black",
        "name": "AEGIS CORE Hoodie — Midnight",
        "short": "Tactical winter loadout.",
        "category": "hoodie",
        "price": 64.0,
        "images": ["/aegis/core-badge.jpg"],
        "accent": "#4A7FC1",
        "sizes": SIZES,
        "colors": ["Midnight Black"],
        "featured": True,
        "description": "Heavyweight midnight black pullover with the CORE shield emblazoned across the back. 12oz fleece, kangaroo pouch, ribbed cuffs. Designed for cold yard mornings and post-shift cooldown.",
    },
    {
        "slug": "core-hat-flexfit",
        "name": "AEGIS CORE Flexfit Cap",
        "short": "Low profile. High discipline.",
        "category": "hat",
        "price": 28.0,
        "images": ["/aegis/core-badge.jpg"],
        "accent": "#4A7FC1",
        "sizes": ["S/M", "L/XL"],
        "colors": ["Black"],
        "description": "Structured low-profile flexfit cap. Embroidered AEGIS shield on the crown. Standard issue daily wear.",
    },
]

# Legacy items — awarded, not sold. Visible but require redeem code.
LEGACY_PRODUCTS_RAW = [
    {
        "slug": "foundation-piece",
        "name": "Foundation Piece — Numbered",
        "short": "001/100. Awarded to founders only.",
        "category": "coin",
        "price": 0.0,
        "is_award_only": True,
        "images": ["/aegis/legacy-badge.jpg"],
        "accent": "#D4AF37",
        "sizes": ["1.75in"],
        "colors": [],
        "badge": "EARNED",
        "description": "The Foundation Piece. Numbered 1–100. Awarded only to the people who built the Order from the ground up. Antique gold finish, AEGIS LEGACY crest, individually serialized on the rim.",
    },
    {
        "slug": "morale-patch-dumpster-fire",
        "name": "Dumpster Fire Response Team Patch",
        "short": "A Yard Custody · Mule Creek.",
        "category": "patch",
        "price": 0.0,
        "is_award_only": True,
        "images": ["/stickers/sticker1.png"],
        "accent": "#FF4500",
        "sizes": ["3in"],
        "colors": [],
        "badge": "EARNED",
        "description": "The original. Hand-distributed to A Yard officers at Mule Creek who held the line through the worst of it. Velcro back, full-bleed embroidery. Not for sale. Earned.",
    },
    {
        "slug": "morale-patch-mental-health",
        "name": "Mental Health Team Patch",
        "short": "Strength in mind. Support in action.",
        "category": "patch",
        "price": 0.0,
        "is_award_only": True,
        "images": ["/stickers/sticker2.png"],
        "accent": "#8B5FBF",
        "sizes": ["3in"],
        "colors": [],
        "badge": "EARNED",
        "description": "Awarded to the clinicians and Mental Health Team who walk the floors no one else will. Purple-accented, embroidered velcro patch. Issued in person.",
    },
    {
        "slug": "legacy-sticker-a-yard",
        "name": "A-Yard Legacy Sticker",
        "short": "The original sticker that started it all.",
        "category": "sticker",
        "price": 0.0,
        "is_award_only": True,
        "images": ["/stickers/sticker1.png"],
        "accent": "#FF4500",
        "sizes": ["3in"],
        "colors": [],
        "badge": "EARNED",
        "description": "The first sticker. Hand-numbered run from the original A-Yard batch. If you got one, you know.",
    },
    {
        "slug": "legacy-sticker-mental-health",
        "name": "Mental Health Legacy Sticker",
        "short": "From the clinicians of the watch.",
        "category": "sticker",
        "price": 0.0,
        "is_award_only": True,
        "images": ["/stickers/sticker2.png"],
        "accent": "#8B5FBF",
        "sizes": ["3in"],
        "colors": [],
        "badge": "EARNED",
        "description": "Numbered from the original Mental Health Team run. Awarded only to clinicians and MHC staff who served the yard.",
    },
]

CAMPAIGNS_RAW = [
    {
        "code": "001",
        "slug": "a-yard",
        "name": "A-YARD",
        "status": "active",
        "tagline": "Mule Creek State Prison. Five Buildings. One Mission.",
        "accent": "#D4AF37",
        "image": "/stickers/sticker1.png",
        "bullets": [
            "Level IV high-security yard",
            "Code 2 / Code 3 operational tempo",
            "Built on discipline. United as one.",
        ],
        "description": "Where it started. A Yard at Mule Creek State Prison — California Level IV. The campaign that birthed the Order. The Dumpster Fire Response Team patch, the original A-Yard sticker, the AEGIS Foundation Piece — all trace their lineage here. Five buildings. One mission.",
    },
    {
        "code": "002",
        "slug": "eop",
        "name": "EOP",
        "status": "active",
        "tagline": "Mental Tough. Physical Tough. Mission Ready.",
        "accent": "#A23E48",
        "image": "/stickers/sticker2.png",
        "bullets": [
            "Enhanced Outpatient Program operations",
            "Mental Health Team integration",
            "Clinicians + Custody as one unit",
        ],
        "description": "The Enhanced Outpatient Program campaign. Where Mental Health clinicians and Custody work together as one fighting unit. Strength in mind. Support in action. Awarded gear acknowledges the people who walked these floors on the toughest days.",
    },
    {
        "code": "003",
        "slug": "building-5",
        "name": "BUILDING 5",
        "status": "active",
        "tagline": "The Standard. Lives Here.",
        "accent": "#2F855A",
        "image": "/aegis/core-badge.jpg",
        "bullets": [
            "Highest standard on the yard",
            "Tier I custody operations",
            "The bar everyone else is measured against",
        ],
        "description": "Building 5. The standard. The bar. Where discipline, presence, and control are not slogans — they are baseline. The Building 5 campaign honors the watch that sets the tone for everything else on the yard.",
    },
    {
        "code": "004",
        "slug": "locked",
        "name": "LOCKED",
        "status": "coming_soon",
        "tagline": "Earn it. Unlock it. Live it.",
        "accent": "#8C92A0",
        "image": "/aegis/legacy-badge.jpg",
        "bullets": [],
        "description": "Campaign locked. Eligibility criteria forthcoming. This dossier becomes available when the conditions are met.",
    },
    {
        "code": "005",
        "slug": "classified",
        "name": "CLASSIFIED",
        "status": "classified",
        "tagline": "The next chapter awaits.",
        "accent": "#8C92A0",
        "image": "/aegis/core-badge.jpg",
        "bullets": [],
        "description": "Classified. Information regarding this campaign has been redacted at this time.",
    },
]

# Demo redeem codes (user can edit/replace via DB later)
LEGACY_REDEEM_CODES = {
    "AYARD-MCSP-2024": {
        "label": "A-Yard MCSP Founders Cohort",
        "unlocks": [
            "morale-patch-dumpster-fire",
            "legacy-sticker-a-yard",
        ],
    },
    "MHT-CLINICIAN-2024": {
        "label": "Mental Health Team — Issued",
        "unlocks": [
            "morale-patch-mental-health",
            "legacy-sticker-mental-health",
        ],
    },
    "FOUNDATION-001": {
        "label": "Foundation Piece Holder",
        "unlocks": ["foundation-piece"],
    },
    "BUILT-ON-DISCIPLINE": {
        "label": "Order Admin Override",
        "unlocks": [
            "foundation-piece",
            "morale-patch-dumpster-fire",
            "morale-patch-mental-health",
            "legacy-sticker-a-yard",
            "legacy-sticker-mental-health",
        ],
    },
}


def build_seed_products() -> List[Product]:
    out: List[Product] = []
    for raw in CORE_PRODUCTS_RAW:
        out.append(Product(division="core", **raw))
    for raw in LEGACY_PRODUCTS_RAW:
        out.append(Product(division="legacy", **raw))
    return out


@app.on_event("startup")
async def seed_data():
    meta = await db.meta.find_one({"key": "seed_version"})
    current = meta.get("value") if meta else None
    if current != SEED_VERSION:
        await db.products.delete_many({})
        await db.campaigns.delete_many({})
        prods = [p.model_dump() for p in build_seed_products()]
        await db.products.insert_many(prods)
        campaigns = [Campaign(**c).model_dump() for c in CAMPAIGNS_RAW]
        await db.campaigns.insert_many(campaigns)
        await db.meta.update_one(
            {"key": "seed_version"},
            {"$set": {"value": SEED_VERSION, "updated_at": datetime.now(timezone.utc).isoformat()}},
            upsert=True,
        )
        logging.info(f"Re-seeded AEGIS data ({len(prods)} products, {len(campaigns)} campaigns)")


# ---------- ROUTES ----------
@api_router.get("/")
async def root():
    return {"message": "AEGIS — Strength in Order", "status": "operational"}


@api_router.get("/products", response_model=List[Product])
async def list_products(
    category: Optional[str] = None,
    division: Optional[str] = None,
    featured: Optional[bool] = None,
):
    q: Dict = {}
    if category:
        q["category"] = category
    if division:
        q["division"] = division
    if featured is not None:
        q["featured"] = featured
    docs = await db.products.find(q, {"_id": 0}).to_list(500)
    return docs


@api_router.get("/products/filters")
async def product_filters():
    cats = await db.products.distinct("category")
    divisions = await db.products.distinct("division")
    return {"categories": cats, "divisions": divisions}


@api_router.get("/products/{slug}", response_model=Product)
async def get_product(slug: str):
    doc = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Product not found")
    return doc


@api_router.get("/campaigns", response_model=List[Campaign])
async def list_campaigns():
    docs = await db.campaigns.find({}, {"_id": 0}).sort("code", 1).to_list(50)
    return docs


@api_router.get("/campaigns/{slug}", response_model=Campaign)
async def get_campaign(slug: str):
    doc = await db.campaigns.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Campaign not found")
    return doc


# ---------- LEGACY REDEEM / REQUEST ----------
@api_router.post("/legacy/redeem")
async def redeem_legacy(payload: RedeemIn):
    code = payload.code.strip().upper()
    entry = LEGACY_REDEEM_CODES.get(code)
    if not entry:
        raise HTTPException(400, "Invalid code. Codes are case-insensitive but must match exactly.")
    # Find product ids by slug
    slugs = entry["unlocks"]
    docs = await db.products.find({"slug": {"$in": slugs}}, {"_id": 0, "id": 1, "slug": 1, "name": 1}).to_list(50)
    return {
        "label": entry["label"],
        "unlocked_product_ids": [d["id"] for d in docs],
        "unlocked_slugs": [d["slug"] for d in docs],
        "unlocked_names": [d["name"] for d in docs],
    }


@api_router.post("/legacy/request")
async def legacy_request(payload: LegacyRequestIn):
    rec = {
        "id": str(uuid.uuid4()),
        "full_name": payload.full_name,
        "email": payload.email,
        "unit": payload.unit,
        "story": payload.story,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.legacy_requests.insert_one(rec)
    return {"ok": True, "id": rec["id"]}


# ---------- CHECKOUT ----------
SHIPPING_FLAT = 7.99


async def _calc_totals(items: List[CartItemIn]):
    line_items = []
    subtotal = 0.0
    for it in items:
        prod = await db.products.find_one({"id": it.product_id}, {"_id": 0})
        if not prod:
            raise HTTPException(400, f"Invalid product {it.product_id}")
        if prod.get("is_award_only"):
            raise HTTPException(400, f"{prod['name']} is award-only and cannot be purchased.")
        qty = max(1, int(it.quantity))
        line_total = round(float(prod["price"]) * qty, 2)
        subtotal += line_total
        line_items.append({
            "product_id": prod["id"],
            "name": prod["name"],
            "slug": prod["slug"],
            "price": prod["price"],
            "quantity": qty,
            "size": it.size,
            "color": it.color,
            "line_total": line_total,
            "image": (prod.get("images") or [""])[0],
        })
    subtotal = round(subtotal, 2)
    shipping = SHIPPING_FLAT if subtotal > 0 else 0.0
    total = round(subtotal + shipping, 2)
    return line_items, subtotal, shipping, total


@api_router.post("/checkout/quote")
async def checkout_quote(payload: Dict):
    items = [CartItemIn(**i) for i in payload.get("items", [])]
    line_items, subtotal, shipping, total = await _calc_totals(items)
    return {"items": line_items, "subtotal": subtotal, "shipping": shipping, "total": total}


@api_router.post("/checkout/session")
async def create_checkout_session(payload: CheckoutRequest, request: Request):
    if not STRIPE_API_KEY:
        raise HTTPException(500, "Stripe not configured")

    line_items, subtotal, shipping, total = await _calc_totals(payload.items)
    if total <= 0:
        raise HTTPException(400, "Cart is empty")

    origin = payload.origin_url.rstrip("/")
    success_url = f"{origin}/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/checkout"

    host_url = str(request.base_url)
    webhook_url = f"{host_url.rstrip('/')}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    order_id = str(uuid.uuid4())
    metadata = {
        "order_id": order_id,
        "customer_email": payload.customer_email,
        "source": "aegis",
    }

    req = CheckoutSessionRequest(
        amount=float(total),
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata,
    )
    session = await stripe_checkout.create_checkout_session(req)

    now = datetime.now(timezone.utc).isoformat()
    await db.payment_transactions.insert_one({
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "order_id": order_id,
        "amount": float(total),
        "currency": "usd",
        "metadata": metadata,
        "payment_status": "initiated",
        "status": "initiated",
        "created_at": now,
        "updated_at": now,
    })

    order = OrderRecord(
        id=order_id,
        session_id=session.session_id,
        items=line_items,
        subtotal=subtotal,
        shipping=shipping,
        total=total,
        customer={
            "name": payload.customer_name,
            "email": payload.customer_email,
            "address_line1": payload.address_line1,
            "address_line2": payload.address_line2,
            "city": payload.city,
            "state": payload.state,
            "zip_code": payload.zip_code,
            "country": payload.country,
            "notes": payload.notes,
        },
        payment_status="pending",
        status="pending",
    )
    await db.orders.insert_one(order.model_dump())

    return {"url": session.url, "session_id": session.session_id, "order_id": order_id}


@api_router.get("/checkout/status/{session_id}")
async def checkout_status(session_id: str, request: Request):
    if not STRIPE_API_KEY:
        raise HTTPException(500, "Stripe not configured")
    host_url = str(request.base_url)
    webhook_url = f"{host_url.rstrip('/')}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    status = await stripe_checkout.get_checkout_status(session_id)

    tx = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    already_paid = tx and tx.get("payment_status") == "paid"

    new_payment_status = status.payment_status
    new_status = status.status
    now = datetime.now(timezone.utc).isoformat()

    if not already_paid:
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {
                "payment_status": new_payment_status,
                "status": new_status,
                "updated_at": now,
            }},
        )
        await db.orders.update_one(
            {"session_id": session_id},
            {"$set": {
                "payment_status": new_payment_status,
                "status": "paid" if new_payment_status == "paid" else new_status,
                "updated_at": now,
            }},
        )

    order = await db.orders.find_one({"session_id": session_id}, {"_id": 0})
    return {
        "session_id": session_id,
        "status": new_status,
        "payment_status": new_payment_status,
        "amount_total": status.amount_total,
        "currency": status.currency,
        "order": order,
    }


@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    if not STRIPE_API_KEY:
        raise HTTPException(500, "Stripe not configured")
    body = await request.body()
    sig = request.headers.get("Stripe-Signature", "")
    host_url = str(request.base_url)
    webhook_url = f"{host_url.rstrip('/')}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    try:
        resp = await stripe_checkout.handle_webhook(body, sig)
    except Exception as e:
        logging.exception("webhook error")
        return JSONResponse({"received": False, "error": str(e)}, status_code=400)

    if resp.session_id:
        now = datetime.now(timezone.utc).isoformat()
        await db.payment_transactions.update_one(
            {"session_id": resp.session_id},
            {"$set": {
                "payment_status": resp.payment_status,
                "status": resp.payment_status,
                "updated_at": now,
            }},
        )
        await db.orders.update_one(
            {"session_id": resp.session_id},
            {"$set": {
                "payment_status": resp.payment_status,
                "status": "paid" if resp.payment_status == "paid" else "pending",
                "updated_at": now,
            }},
        )
    return {"received": True}


@api_router.post("/orders/manual")
async def create_manual_order(payload: CheckoutRequest):
    line_items, subtotal, shipping, total = await _calc_totals(payload.items)
    if total <= 0:
        raise HTTPException(400, "Cart is empty")
    order = OrderRecord(
        items=line_items,
        subtotal=subtotal,
        shipping=shipping,
        total=total,
        customer={
            "name": payload.customer_name,
            "email": payload.customer_email,
            "address_line1": payload.address_line1,
            "address_line2": payload.address_line2,
            "city": payload.city,
            "state": payload.state,
            "zip_code": payload.zip_code,
            "country": payload.country,
            "notes": payload.notes,
        },
        payment_status="awaiting_manual",
        status="pending",
    )
    await db.orders.insert_one(order.model_dump())
    return {"order_id": order.id, "total": total}


@api_router.get("/orders/{order_id}")
async def get_order(order_id: str):
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(404, "Order not found")
    return order


# ---------- NEWSLETTER / CONTACT ----------
class NewsletterIn(BaseModel):
    email: str


@api_router.post("/newsletter")
async def subscribe(payload: NewsletterIn):
    await db.newsletter.insert_one({
        "id": str(uuid.uuid4()),
        "email": payload.email,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"ok": True}


@api_router.post("/contact")
async def contact(payload: ContactIn):
    rec = {
        "id": str(uuid.uuid4()),
        "full_name": payload.full_name,
        "email": payload.email,
        "subject": payload.subject,
        "message": payload.message,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.contact_messages.insert_one(rec)
    return {"ok": True, "id": rec["id"]}


# ---------- APP WIRING ----------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
