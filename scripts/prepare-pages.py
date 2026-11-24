"""Prepare the public install site and userscript using only Python's standard library."""

import json
import os
from pathlib import Path
import re
import shutil
from urllib.parse import urlsplit


def main():
    root = Path(__file__).resolve().parents[1]
    base_url = os.environ["PAGES_BASE_URL"].rstrip("/")
    repository = os.environ["REPOSITORY_SLUG"]
    parsed = urlsplit(base_url)
    if (parsed.scheme != "https" or not parsed.netloc or parsed.query or parsed.fragment
            or parsed.username or parsed.password or any(char.isspace() for char in base_url)
            or "*" in base_url):
        raise ValueError("PAGES_BASE_URL must be the HTTPS root of the published website.")
    if not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", repository):
        raise ValueError("REPOSITORY_SLUG must have the form owner/repository.")

    filename = "cpp-registration-helper.user.js"
    script = (root / "userscript" / filename).read_text(encoding="utf-8")
    header, separator, body = script.partition("// ==/UserScript==")
    version = re.search(r"^// @version\s+(\S+)", header, re.MULTILINE)
    if not header.startswith("// ==UserScript==") or not separator or not version:
        raise ValueError("The userscript metadata is missing or invalid.")

    repository_url = f"https://github.com/{repository}"
    install_url = f"{base_url}/{filename}"
    # Keep the source installable without a known GitHub owner or repository name.
    # Only the deployed copy receives site-specific match and update addresses.
    header = re.sub(r"^// @(?:homepageURL|supportURL|downloadURL|updateURL)\s+[^\n]*\n?", "", header, flags=re.MULTILINE)
    header = header.rstrip() + "\n" + "\n".join([
        f"// @match        {base_url}/*",
        f"// @homepageURL  {base_url}/",
        f"// @supportURL   {repository_url}/issues",
        f"// @downloadURL  {install_url}",
        f"// @updateURL    {install_url}",
    ]) + "\n"

    destination = root / "_site"
    destination.mkdir(exist_ok=True)
    for name in ("index.html", "styles.css", "install.js", "assets/mark.svg"):
        target = destination / name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(root / "website" / name, target)
    (destination / filename).write_text(header + separator + body, encoding="utf-8")
    config = {"version": version.group(1), "repositoryUrl": repository_url}
    (destination / "site-config.js").write_text(
        "window.CPP_SITE_CONFIG = Object.freeze(" + json.dumps(config) + ");\n", encoding="utf-8"
    )


if __name__ == "__main__":
    main()
