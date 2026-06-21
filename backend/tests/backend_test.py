"""
Backend API tests for AEGIS — Strength in Order (post-rebrand).
Covers: products (core/legacy), campaigns, legacy redeem/request, contact,
newsletter, manual order, Stripe checkout session, award-only enforcement.
"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "http://127.0.0.1:8000").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ----- Health -----
def test_root(session):
    r = session.get(f"{API}/")
    assert r.status_code == 200
    data = r.json()
    assert data.get("status") == "operational"
    assert "AEGIS" in data.get("message", "")


# ----- Products: 9 total (4 core + 5 legacy) -----
def test_products_total_count_9(session):
    r = session.get(f"{API}/products")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) == 9, f"Expected 9 products, got {len(data)}"
    assert "_id" not in data[0]
    slugs = {d["slug"] for d in data}
    expected = {
        "tactical-white-tee", "tactical-black-tee", "core-hoodie-black", "core-hat-flexfit",
        "foundation-piece", "legacy-patch-foundation", "legacy-sticker-aegis",
        "legacy-sticker-core", "legacy-patch-order",
    }
    assert expected.issubset(slugs), f"Missing slugs: {expected - slugs}"


def test_products_division_core_count_4(session):
    r = session.get(f"{API}/products", params={"division": "core"})
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 4
    for it in items:
        assert it["division"] == "core"
        assert it["is_award_only"] is False


def test_products_division_legacy_count_5(session):
    r = session.get(f"{API}/products", params={"division": "legacy"})
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 5
    for it in items:
        assert it["division"] == "legacy"
        assert it["is_award_only"] is True


def test_products_category_tshirt(session):
    r = session.get(f"{API}/products", params={"category": "tshirt"})
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 2
    for it in items:
        assert it["category"] == "tshirt"


def test_get_product_by_slug(session):
    r = session.get(f"{API}/products/tactical-white-tee")
    assert r.status_code == 200
    data = r.json()
    assert data["slug"] == "tactical-white-tee"
    assert data["price"] == 34.0
    assert data["division"] == "core"


def test_get_product_invalid_slug(session):
    r = session.get(f"{API}/products/does-not-exist")
    assert r.status_code == 404


# ----- Campaigns -----
def test_campaigns_count_5(session):
    r = session.get(f"{API}/campaigns")
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 5
    codes = {c["code"] for c in items}
    assert codes == {"001", "002", "003", "004", "005"}


def test_campaign_a_yard_detail(session):
    r = session.get(f"{API}/campaigns/a-yard")
    assert r.status_code == 200
    data = r.json()
    assert data["slug"] == "a-yard"
    assert data["code"] == "001"
    assert data["status"] == "active"
    assert len(data["bullets"]) >= 1


# ----- Legacy redeem -----
def test_legacy_redeem_valid_code(session):
    r = session.post(f"{API}/legacy/redeem", json={"code": "BUILT-ON-DISCIPLINE"})
    assert r.status_code == 200, r.text
    data = r.json()
    assert isinstance(data.get("unlocked_product_ids"), list)
    assert len(data["unlocked_product_ids"]) == 5
    assert "foundation-piece" in data["unlocked_slugs"]
    assert "legacy-patch-order" in data["unlocked_slugs"]


def test_legacy_redeem_case_insensitive(session):
    r = session.post(f"{API}/legacy/redeem", json={"code": "foundation-001"})
    assert r.status_code == 200
    data = r.json()
    assert "foundation-piece" in data["unlocked_slugs"]


def test_legacy_redeem_invalid_code(session):
    r = session.post(f"{API}/legacy/redeem", json={"code": "NOT-A-CODE"})
    assert r.status_code == 400


def test_legacy_request_submission(session):
    r = session.post(f"{API}/legacy/request", json={
        "full_name": "TEST Officer Smith",
        "email": "test_legacy@example.com",
        "unit": "A Yard MCSP",
        "story": "TEST: Held the line on the worst day.",
    })
    assert r.status_code == 200
    data = r.json()
    assert data.get("ok") is True
    assert data.get("id")


# ----- Contact + Newsletter -----
def test_contact_submission(session):
    r = session.post(f"{API}/contact", json={
        "full_name": "TEST Contact",
        "email": "test_contact@example.com",
        "subject": "Inquiry",
        "message": "TEST message body.",
    })
    assert r.status_code == 200
    assert r.json().get("ok") is True


def test_newsletter_subscribe(session):
    unique = f"TEST_aegis_{uuid.uuid4().hex[:8]}@example.com"
    r = session.post(f"{API}/newsletter", json={"email": f"  {unique.upper()}  "})
    assert r.status_code == 200
    data = r.json()
    assert data.get("ok") is True
    assert data.get("email") == unique.lower()
    assert data.get("status") in {"confirmed", "pending"}

    r2 = session.post(f"{API}/newsletter", json={"email": unique.lower()})
    assert r2.status_code == 200
    data2 = r2.json()
    assert data2.get("ok") is True
    assert data2.get("email") == unique.lower()
    assert data2.get("status") == data.get("status")


# ----- Checkout: manual order for CORE product -----
def test_manual_order_core_success(session):
    r = session.get(f"{API}/products/tactical-white-tee")
    pid = r.json()["id"]
    payload = {
        "items": [{"product_id": pid, "quantity": 2, "size": "L", "color": "Bone White"}],
        "origin_url": BASE_URL,
        "customer_name": "TEST Officer",
        "customer_email": "test_officer@example.com",
        "address_line1": "1 Mule Creek Rd",
        "city": "Ione",
        "state": "CA",
        "zip_code": "95640",
        "notes": "TEST manual aegis order",
    }
    r = session.post(f"{API}/orders/manual", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "order_id" in data
    assert data["total"] == round(34.0 * 2 + 7.99, 2)

    # GET the order to verify persistence
    r2 = session.get(f"{API}/orders/{data['order_id']}")
    assert r2.status_code == 200
    o = r2.json()
    assert o["payment_status"] == "awaiting_manual"
    assert o["customer"]["email"] == "test_officer@example.com"


# ----- Award-only legacy products must be blocked at checkout -----
def test_award_only_blocked_in_manual_order(session):
    r = session.get(f"{API}/products/foundation-piece")
    pid = r.json()["id"]
    payload = {
        "items": [{"product_id": pid, "quantity": 1}],
        "origin_url": BASE_URL,
        "customer_name": "TEST",
        "customer_email": "t@example.com",
        "address_line1": "x", "city": "x", "state": "CA", "zip_code": "00000",
    }
    r = session.post(f"{API}/orders/manual", json=payload)
    assert r.status_code == 400
    assert "award-only" in r.text.lower()


def test_award_only_blocked_in_stripe_session(session):
    r = session.get(f"{API}/products/foundation-piece")
    pid = r.json()["id"]
    payload = {
        "items": [{"product_id": pid, "quantity": 1}],
        "origin_url": BASE_URL,
        "customer_name": "TEST",
        "customer_email": "t@example.com",
        "address_line1": "x", "city": "x", "state": "CA", "zip_code": "00000",
    }
    r = session.post(f"{API}/checkout/session", json=payload)
    assert r.status_code == 400
    assert "award-only" in r.text.lower()


# ----- Stripe checkout session for CORE product -----
def test_stripe_checkout_session_core(session):
    r = session.get(f"{API}/products/tactical-black-tee")
    pid = r.json()["id"]
    payload = {
        "items": [{"product_id": pid, "quantity": 1, "size": "M", "color": "Black"}],
        "origin_url": BASE_URL,
        "customer_name": "TEST Stripe",
        "customer_email": "test_stripe@example.com",
        "address_line1": "1 Yard Way",
        "city": "Ione", "state": "CA", "zip_code": "95640",
    }
    r = session.post(f"{API}/checkout/session", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "url" in data and data["url"].startswith("http")
    assert "session_id" in data and data["session_id"]
