// =====================
// TEMPLATES (via Olog REST API)
// =====================
let loadedLevels = [];
let loadedLogbooks = [];
let loadedTags = [];

// Load all dependencies on page load
window.addEventListener("load", () => {
  loadLevelsForTemplates();
  loadLogbooksForTemplates();
  loadTagsForTemplates();
});

async function loadLevelsForTemplates() {
  const url = `${API_BASE}/levels`;
  const result = await fetchWithSSL(url);

  if (result.ok) {
    loadedLevels = Array.isArray(result.data) ? result.data : [];
    const select = document.getElementById("templateLevel");
    select.innerHTML = loadedLevels
      .map(
        (level) => `
      <option value="${level.name}">${level.name} ${level.defaultLevel ? "(Default)" : ""}</option>
    `,
      )
      .join("");
    showResponse(
      "templateResponse",
      `✅ Loaded ${loadedLevels.length} levels.`,
    );
  } else {
    showResponse(
      "templateResponse",
      `❌ Failed to load levels: ${result.error}`,
      true,
    );
  }
}

async function loadLogbooksForTemplates() {
  const url = `${API_BASE}/logbooks`;
  const result = await fetchWithSSL(url);

  if (result.ok) {
    loadedLogbooks = Array.isArray(result.data) ? result.data : [];
    loadedLogbooks = loadedLogbooks.filter((lb) => lb.state === "Active");
    const select = document.getElementById("templateLogbooks");
    select.innerHTML = loadedLogbooks
      .map(
        (lb) => `
      <option value="${lb.name}">${lb.name} </option>
    `,
      )
      .join("");
    showResponse(
      "templateResponse",
      `✅ Loaded ${loadedLogbooks.length} logbooks.`,
    );
  } else {
    showResponse(
      "templateResponse",
      `❌ Failed to load logbooks: ${result.error}`,
      true,
    );
  }
}

async function loadTagsForTemplates() {
  const url = `${API_BASE}/tags`;
  const result = await fetchWithSSL(url);

  if (result.ok) {
    loadedTags = Array.isArray(result.data) ? result.data : [];
    loadedTags = loadedTags.filter((tag) => tag.state === "Active");
    const select = document.getElementById("templateTags");
    select.innerHTML = loadedTags
      .map(
        (tag) => `
      <option value="${tag.name}">${tag.name} </option>
    `,
      )
      .join("");
    showResponse("templateResponse", `✅ Loaded ${loadedTags.length} tags.`);
  } else {
    showResponse(
      "templateResponse",
      `❌ Failed to load tags: ${result.error}`,
      true,
    );
  }
}

function selectAll(selectId) {
  const select = document.getElementById(selectId);
  Array.from(select.options).forEach((opt) => {
    opt.selected = true;
  });
  updateSelectedCount(
    selectId,
    selectId === "templateLogbooks"
      ? "Logbooks (select multiple)"
      : "Tags (select multiple)",
  );
}

function clearSelection(selectId) {
  const select = document.getElementById(selectId);
  Array.from(select.options).forEach((opt) => {
    opt.selected = false;
  });
  updateSelectedCount(
    selectId,
    selectId === "templateLogbooks"
      ? "Logbooks (select multiple)"
      : "Tags (select multiple)",
  );
}

// Update selected count display
function updateSelectedCount(selectId, label) {
  const select = document.getElementById(selectId);
  const selected = Array.from(select.selectedOptions).length;
  const labelEl = select.previousElementSibling; // Assuming label is right before select
  if (labelEl) {
    labelEl.textContent = `${label} (${selected} selected)`;
  }
}

// Call this after loading data or when selection changes
document.getElementById('templateLogbooks').addEventListener('change', () => {
  updateSelectedCount('templateLogbooks', 'Logbooks (select multiple)');
});

document.getElementById('templateTags').addEventListener('change', () => {
  updateSelectedCount('templateTags', 'Tags (select multiple)');
});

async function createTemplate() {
  const name = document.getElementById("templateName").value.trim();
  const description = document
    .getElementById("templateDescription")
    .value.trim();
  const level = document.getElementById("templateLevel").value;
  const title = document.getElementById("templateTitle").value.trim();

  // Get selected logbooks and tags (as arrays)
  const logbookSelect = document.getElementById("templateLogbooks");
  const selectedLogbooks = Array.from(logbookSelect.selectedOptions)
    .map((opt) => opt.value)
    .filter((v) => v);
  const tagSelect = document.getElementById("templateTags");
  const selectedTags = Array.from(tagSelect.selectedOptions)
    .map((opt) => opt.value)
    .filter((v) => v);

  if (!name) {
    showResponse("templateResponse", "Template name is required!", true);
    return;
  }

  if (!level) {
    showResponse("templateResponse", "Level is required!", true);
    return;
  }

  // Build payload with selected items (as arrays, per your schema)
  const payload = {
    name,
    description: description || "Template description",
    level,
    title: title || "Template Title",
    logbooks: selectedLogbooks.map((name) => ({ name })),
    tags: selectedTags.map((name) => ({ name })),
  };

  const url = `${API_BASE}/templates`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: getOlogAuthHeader(),
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const text = await response.text();
      showResponse(
        "templateResponse",
        `✅ Template "${name}" created successfully.\n${text}`,
      );
      loadTemplates();
    } else if (response.status === 405) {
      showResponse(
        "templateResponse",
        `⚠️ Templates are not editable via REST API. Use CS-Studio or Olog Web UI.`,
        true,
      );
    } else {
      const text = await response.text();
      showResponse(
        "templateResponse",
        `❌ Error: ${response.status} ${response.statusText}\n${text}`,
        true,
      );
    }
  } catch (error) {
    showResponse(
      "templateResponse",
      `🚨 Network Error: ${error.message}`,
      true,
    );
  }
}

async function loadTemplates() {
  const url = `${API_BASE}/templates`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: getOlogAuthHeader(),
      },
    });

    if (response.ok) {
      const data = await response.json();
      const templates = Array.isArray(data) ? data : [];
      const list = document.getElementById("templatesList");
      list.innerHTML = templates
        .map((template) => {
          return `
          <div class="list-item">
            <span>
              <strong>${template.name}</strong> — ${template.title} (${template.level})
              ${template.description ? `<br><small>${template.description}</small>` : ""}
            </span>
          </div>
        `;
        })
        .join("");
      showResponse(
        "templateResponse",
        `✅ Loaded ${templates.length} templates.`,
      );
    } else if (response.status === 405) {
      showResponse(
        "templateResponse",
        `⚠️ Templates are not readable via REST API. Use CS-Studio or Olog Web UI.`,
        true,
      );
      document.getElementById("templatesList").innerHTML =
        "<p>Templates are read-only via API.</p>";
    } else {
      const text = await response.text();
      showResponse(
        "templateResponse",
        `❌ Failed to load templates: ${response.status} ${response.statusText}\n${text}`,
        true,
      );
    }
  } catch (error) {
    showResponse(
      "templateResponse",
      `🚨 Network Error: ${error.message}`,
      true,
    );
  }
}

async function deleteTemplate(name) {
  if (!confirm(`Delete template "${name}"? This cannot be undone.`)) return;

  const url = `${API_BASE}/templates/${encodeURIComponent(name)}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: getOlogAuthHeader(),
      },
    });

    if (response.ok) {
      showResponse("templateResponse", `✅ Template "${name}" deleted.`);
      loadTemplates();
    } else if (response.status === 405) {
      showResponse(
        "templateResponse",
        `⚠️ Template deletion is not supported via REST API. Use CS-Studio or Olog Web UI.`,
        true,
      );
    } else {
      const text = await response.text();
      showResponse(
        "templateResponse",
        `❌ Delete failed: ${response.status} ${response.statusText}\n${text}`,
        true,
      );
    }
  } catch (error) {
    showResponse(
      "templateResponse",
      `🚨 Network Error: ${error.message}`,
      true,
    );
  }
}
