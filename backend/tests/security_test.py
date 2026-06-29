"""
Security regression tests for the AEGIS app.
These cover the fixed docs exposure and frontend path traversal behavior.
"""

import os

from fastapi.testclient import TestClient

os.environ.setdefault("MONGO_URL", "mongodb://localhost:27017")
os.environ.setdefault("DB_NAME", "aegis_test")

import server  # noqa: E402


def test_docs_endpoints_are_disabled():
    client = TestClient(server.app)

    assert client.get("/docs").status_code == 404
    assert client.get("/redoc").status_code == 404
    assert client.get("/openapi.json").status_code == 404


def test_frontend_path_helper_rejects_traversal(tmp_path, monkeypatch):
    build_dir = tmp_path / "build"
    build_dir.mkdir()
    (build_dir / "index.html").write_text("<html>ok</html>", encoding="utf-8")
    secret = tmp_path / "package.json"
    secret.write_text('{"name":"secret"}', encoding="utf-8")

    monkeypatch.setattr(server, "FRONTEND_BUILD_DIR", build_dir)

    assert server.resolve_frontend_path("index.html") == build_dir / "index.html"
    assert server.resolve_frontend_path("../package.json") is None
    assert server.resolve_frontend_path("../../package.json") is None
