(() => {
  "use strict";

  const config = window.CPP_SITE_CONFIG || {};
  const dialog = document.getElementById("manager-dialog");
  const status = document.getElementById("install-status");
  const confirm = document.getElementById("confirm-manager");
  const preferenceKey = "cpp-helper:manager-confirmed";
  let detectedManager = "";

  function rememberManager() {
    try { localStorage.setItem(preferenceKey, "yes"); } catch { /* Installation also works without storage. */ }
  }

  function managerWasConfirmed() {
    try { return localStorage.getItem(preferenceKey) === "yes"; } catch { return false; }
  }

  function installedScript() {
    const version = document.documentElement.dataset.cppHelperVersion;
    if (!version) return;
    detectedManager = document.documentElement.dataset.cppHelperManager || "your userscript manager";
    status.textContent = `CPP Registration Helper v${version} is installed in ${detectedManager}. Click Install to reinstall or update.`;
    status.classList.add("detected");
  }

  function showManagerHelp() {
    if (!dialog.open) dialog.showModal();
  }

  if (config.version) {
    document.querySelectorAll("[data-version]").forEach(node => { node.textContent = `v${config.version}`; });
  }
  if (config.repositoryUrl) {
    try {
      const repository = new URL(config.repositoryUrl);
      if (repository.origin === "https://github.com") {
        document.querySelectorAll("[data-repository]").forEach(link => {
          link.href = repository.href;
          link.hidden = false;
        });
        document.querySelectorAll("[data-issues]").forEach(link => {
          link.href = `${repository.href.replace(/\/$/, "")}/issues`;
        });
        document.querySelectorAll("[data-feedback]").forEach(section => { section.hidden = false; });
      }
    } catch { /* An unconfigured site still has a working local install link. */ }
  }

  // Some Tampermonkey installations expose this API to websites; many managers do not.
  // Never interpret the API's absence as proof that no manager is installed.
  try {
    if (typeof window.external?.Tampermonkey?.isInstalled === "function") {
      detectedManager = "Tampermonkey";
      status.textContent = "Tampermonkey detected. Install opens its script confirmation screen.";
      status.classList.add("detected");
    }
  } catch { /* Browser extension details can be private. */ }

  document.addEventListener("cpp-helper:ready", installedScript);
  document.dispatchEvent(new Event("cpp-helper:check"));
  installedScript();

  document.querySelectorAll("[data-install]").forEach(link => {
    link.addEventListener("click", event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      if (detectedManager || managerWasConfirmed()) return;
      event.preventDefault();
      showManagerHelp();
    });
  });
  document.querySelectorAll("[data-manager-help]").forEach(button => button.addEventListener("click", showManagerHelp));
  confirm.addEventListener("click", () => { rememberManager(); dialog.close(); });
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });

  const previews = Array.from(document.querySelectorAll("[data-preview]"));
  function showPreview(name, focus = false) {
    previews.forEach(tab => {
      const selected = tab.dataset.preview === name;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute("aria-controls")).hidden = !selected;
      if (selected && focus) tab.focus();
    });
  }
  previews.forEach(tab => {
    tab.addEventListener("click", () => showPreview(tab.dataset.preview));
    tab.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const index = previews.indexOf(tab);
      const next = event.key === "Home" ? 0 : event.key === "End" ? previews.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + previews.length) % previews.length;
      showPreview(previews[next].dataset.preview, true);
    });
  });
})();
