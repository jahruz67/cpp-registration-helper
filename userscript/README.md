# CPP Registration Helper userscript

The standalone `cpp-registration-helper.user.js` file includes the course directory, styles, and the extension's current features: course autocomplete, frequent-subject ordering with bold moved selections, CPP professor links/ratings, and separate shopping cart/enrolled weekly calendar tabs. Dropped classes are excluded from Enrolled. It also covers class search opened through Add Classes.

## Install

1. Install or enable [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/get-it/).
2. Disable the original CPP Registration Helper extension so the two copies do not add duplicate controls.
3. In your manager, create a new script, replace the starter text with the entire contents of `cpp-registration-helper.user.js`, and save. The published install website also has a button that opens your manager's confirmation screen.
4. Reload BroncoDirect. Allow the script to connect to `www.ratemyprofessors.com` if your manager asks.

For downloaded pages, also allow your userscript manager to access file URLs in the browser's extension settings. Keep the saved HTML pages and their `_files` folders together.

The userscript has its own saved subject history, observed course titles, and professor cache. Existing extension storage is not automatically transferred. The 4,166-course directory and its source metadata are embedded, so course suggestions do not need a live catalog request. See the [project README](../README.md) for coverage, troubleshooting, and publishing instructions.

Only professor-name lookups contact Rate My Professors. Requests omit cookies; the script does not submit registration forms or send shopping cart data elsewhere. The external rating endpoint may still fail or block requests; names retain CPP-filtered search links when a rating cannot be loaded.

The userscript is now the maintained source. The old extension and downloaded reference pages have been moved out of this repository. The website installs the raw repository file, and the script's update URLs point there too. Script releases need a version bump and a push to `master`, without a Pages deployment. The Pages workflow retains a copy at the old script URL so existing installations can migrate to repository updates.

The userscript has been reviewed statically. It has not been installed, launched, or tested in a browser.
