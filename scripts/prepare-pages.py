"""Prepare the install site and a legacy update copy using only Python's standard library."""

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
    branch = os.environ.get("SCRIPT_BRANCH", "master")
    parsed = urlsplit(base_url)
    if (parsed.scheme != "https" or not parsed.netloc or parsed.query or parsed.fragment
            or parsed.username or parsed.password or any(char.isspace() for char in base_url)
            or "*" in base_url):
        raise ValueError("PAGES_BASE_URL must be the HTTPS root of the published website.")
    if not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", repository):
        raise ValueError("REPOSITORY_SLUG must have the form owner/repository.")
    if branch not in ("main", "master"):
        raise ValueError("SCRIPT_BRANCH must be main or master.")

    filename = "cpp-registration-helper.user.js"
    script = (root / "userscript" / filename).read_text(encoding="utf-8")
    header, separator, body = script.partition("// ==/UserScript==")
    version = re.search(r"^// @version\s+(\S+)", header, re.MULTILINE)
    if not header.startswith("// ==UserScript==") or not separator or not version:
        raise ValueError("The userscript metadata is missing or invalid.")

    repository_url = f"https://github.com/{repository}"
    install_url = f"https://raw.githubusercontent.com/{repository}/{branch}/userscript/{filename}"
    # Keep the old Pages URL available so existing installations migrate to GitHub updates.
    header = re.sub(r"^// @(?:homepageURL|supportURL|downloadURL|updateURL)\s+[^\n]*\n?", "", header, flags=re.MULTILINE)
    site_match = f"// @match        {base_url}/*"
    if site_match not in header.splitlines():
        header = header.rstrip() + "\n" + site_match + "\n"
    header = header.rstrip() + "\n" + "\n".join([
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
    config = {"installUrl": install_url, "repositoryUrl": repository_url}
    (destination / "site-config.js").write_text(
        "window.CPP_SITE_CONFIG = Object.freeze(" + json.dumps(config) + ");\n", encoding="utf-8"
    )


if __name__ == "__main__":
    main()
