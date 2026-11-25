<p align="center">
  <img src="website/assets/mark.svg" alt="CPP Registration Helper" width="76" height="76">
</p>

<h1 align="center">CPP Registration Helper</h1>

<p align="center"><strong>Your classes. A little clearer.</strong></p>
<p align="center">Course names as you type, familiar subjects up front, professor ratings beside their names,<br>and a weekly calendar that makes your plans easier to see.</p>

<p align="center">
  <a href="https://raw.githubusercontent.com/jahruz67/cpp-registration-helper/master/userscript/cpp-registration-helper.user.js"><strong>Install the user script ↗</strong></a>
  &nbsp; · &nbsp; <a href="#get-started">Get started</a>
  &nbsp; · &nbsp; <a href="#what-you-get">What you get</a>
  &nbsp; · &nbsp; <a href="#publish-the-install-website">Publish the website</a>
</p>

---

## A few thoughtful upgrades for BroncoDirect

CPP Registration Helper is a single userscript for Cal Poly Pomona’s Class Search and Add Classes pages. It adds helpful information to the pages you already use. **You stay in control of searching, choosing classes, and enrolling.**

### What you get

| A little upgrade | How it helps |
| --- | --- |
| **Course autocomplete** | Pick a subject, type part of a course number, and choose a matching number **and name**. Click a suggestion or use the arrow keys and Enter. |
| **Your subjects, up front** | Subjects you select often move to the top. Moved selections are bold, and your preferences are remembered across visits. |
| **Professor links & ratings** | Instructor names open their Rate My Professors profiles when a unique CPP match is found. A small rating appears beside the name; unavailable ratings show N/A with a CPP-filtered search link. |
| **Your week at a glance** | Scroll to the calendar on Add Classes. Switch between **Shopping Cart** and **Enrolled**, see color-coded meetings, and spot overlapping times. Dropped classes are excluded from Enrolled. |

**4,166 course names · 90 subjects · No live catalog request needed**

Search enhancements also work when you enter through **Add Classes → Find Classes → Class Search → Search**. Classes with TBA or unrecognized meeting times are listed below the calendar.

## Get started

### 1. Add a userscript manager

Choose [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/get-it/) and follow its browser setup. If your browser asks you to allow userscripts, enable that permission.

### 2. Install the helper

Open this project’s published GitHub Pages website and click **Install the user script**. The site detects the helper when possible, and offers manager setup when browser privacy prevents detection. Already have a manager? Choose **I have a manager — install script**.

Your manager opens its installation screen. Review the script and confirm **Install**.

**Prefer installing directly from GitHub?** Open the [userscript file](userscript/cpp-registration-helper.user.js), then choose **Raw**. If your browser displays code instead of an installation screen, create a new script in your manager, replace the starter text with the entire file, and save.

### 3. Refresh BroncoDirect

Reload **Class Search** or **Add Classes**. Autocomplete appears when you select a subject and type a course number; the weekly calendar appears at the bottom of Add Classes.

If you previously used the unpacked CPP Registration Helper extension, disable it so you only have one copy running. The userscript keeps its own history, so preferences from the old extension start fresh.

## Your data

- **Your cart and class schedule stay on the page.** The helper does not upload them.
- **Preferences stay in your userscript manager.** Subject counts, observed course titles, and rating caches are stored locally.
- **Professor lookups contact Rate My Professors.** Requests include the instructor name and CPP campus filter and omit browser cookies.
- **The script does not submit registration forms.** You choose when to search, add, delete, or enroll.

The install website has no analytics or third-party scripts. Its manager choice is remembered in your browser; it can read the installed helper’s version and manager name only on its own published site.

## Good to know

**Course names are suggestions, not seat availability.** The directory combines [archived 2023–2024 CPP catalog names](https://github.com/DanielPasion/CPPCatalogWebScraper/blob/master/Course_Prereqs/2023-2024_Courses.csv) with [newer all-terms listings](https://coursequest.org/schools/cpp/catalog), collected November 23, 2026. Older courses remain, and it is not a complete current catalog. ATH, CM, SME, and OAPL have no bundled records; you can still enter their numbers manually.

**N/A is not a score.** An exact, unique CPP profile is required. No matching profile, multiple matches, no ratings, or an unavailable external lookup can all produce N/A. Hover for the reason, or click the name to search.

**The calendar shows a recurring week.** It reads the meeting rows on the page, including labs and multiple meeting times. Check individual class date ranges in BroncoDirect when planning around shorter sessions.

## If something doesn’t appear

| What you see | What to try |
| --- | --- |
| The install button opens code | Enable your userscript manager, check its userscript permission, then try again. Or paste the entire file into a new script in the manager. |
| No enhancements in BroncoDirect | Make sure the script is enabled for `cmsweb.cms.cpp.edu`, then refresh Class Search or Add Classes. |
| Duplicate controls | Disable the old unpacked extension or an extra installed copy of the script. |
| A professor shows N/A | Hover over N/A for the lookup result. The name remains a CPP-specific search link. |
| A meeting is listed below the calendar | Its time is TBA, missing, or in a format the helper could not read. |

## Publish the install website

This repository includes the landing page and a GitHub Pages workflow. There are no npm dependencies to install.

1. Push this repository to GitHub using a **`main` or `master`** branch.
2. In the repository, open **Settings → Pages** and set **Source → GitHub Actions**.
3. Open **Actions → Deploy install website → Run workflow**. Future website changes publish automatically when pushed to either supported branch. Script-only changes do not trigger a Pages deployment.
4. Open the website URL shown in the deployment. You can also add it to the repository’s **About → Website** field.

The website’s install buttons link directly to the raw userscript in this repository. The workflow supplies the repository and branch in the website configuration. It also keeps a copy at the old Pages script URL with GitHub update addresses, so existing installations can migrate when their manager next checks for updates.

To release a script change, edit `userscript/cpp-registration-helper.user.js`, increase its `@version`, and push to `master`. New installations and userscript update checks then use the repository file directly, according to the manager’s update settings; no Pages deployment is needed. Deploy the website once when switching from the old Pages installation links to these repository links.

### Project layout

```text
userscript/cpp-registration-helper.user.js  The standalone userscript, including course data
website/                                  Install page, previews, and manager setup
scripts/prepare-pages.py                   Prepares the public website files
.github/workflows/pages.yml                GitHub Pages deployment
```

This is an independent companion for BroncoDirect. The website previews use sample data. The website, updated userscript, and workflow have been reviewed statically; browser checks, tests, and deployment have not been run.
