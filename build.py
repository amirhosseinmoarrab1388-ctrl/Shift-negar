"""Package the frontend and activity API as one Cloudflare Worker."""
from pathlib import Path
import base64
import json
import mimetypes

root = Path(__file__).resolve().parent
assets = {}
for path in sorted(root.iterdir()):
    if path.suffix in {".html", ".js", ".css", ".ttf", ".webmanifest", ".svg", ".txt"}:
        mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        assets["/" + path.name] = [mime, base64.b64encode(path.read_bytes()).decode()]
output = root / "dist/server/index.js"
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text("const assets=" + json.dumps(assets) + ";\n" + (root / "team-core.js").read_text() + (root / "worker/api.js").read_text())
