function buildContextMenus() {
  BROWSER_SDK.storage.sync.get("domains", function(items) {
    var patterns = null;
    if (items.domains) {
      patterns = items.domains.split('|');
    } else {
      patterns = MD_TO_JIRA_DEFAULT_DOMAINS.split('|');
    }

    BROWSER_SDK.contextMenus.removeAll(function() {
      BROWSER_SDK.contextMenus.create({
        "id": "md_to_jira",
        "title" : "MD to JIRA",
        "type" : "normal",
        "contexts" : ["editable"],
        "documentUrlPatterns": patterns
      });

      BROWSER_SDK.contextMenus.create({
        "id": "jira_to_md",
        "title" : "JIRA to MD",
        "type" : "normal",
        "contexts" : ["editable"],
        "documentUrlPatterns": patterns
      });
    });
  });
}

function handleMenuClick(info, tab) {
  if (!tab || !tab.id) {
    return;
  }

  if (info.menuItemId === "md_to_jira") {
    BROWSER_SDK.tabs.sendMessage(tab.id, {
      "action": 'context-click',
      "event": "md_to_jira"
    });
  } else if (info.menuItemId === "jira_to_md") {
    BROWSER_SDK.tabs.sendMessage(tab.id, {
      "action": 'context-click',
      "event": "jira_to_md"
    });
  }
}

BROWSER_SDK.runtime.onInstalled.addListener(buildContextMenus);
BROWSER_SDK.runtime.onStartup.addListener(buildContextMenus);
BROWSER_SDK.contextMenus.onClicked.addListener(handleMenuClick);

// Keep menus in sync if the user updates the domain list from options.
BROWSER_SDK.storage.onChanged.addListener(function(changes, areaName) {
  if (areaName === "sync" && changes.domains) {
    buildContextMenus();
  }
});

// In case the worker is spun up outside install/startup events.
buildContextMenus();
