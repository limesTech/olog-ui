async function createLevel() {
  const name = document.getElementById('levelName').value.trim();
  const isDefault = document.getElementById('levelDefault').value === 'true';

  if (!name) {
    showResponse('levelResponse', 'Level name is required!', true);
    return;
  }

  const url = `${API_BASE}/level/${encodeURIComponent(name)}`;
  const payload = {
    name,
    defaultLevel: isDefault
  };

  const result = await fetchWithSSL(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (result.ok) {
    showResponse('levelResponse', `✅ Level "${name}" created successfully.`);
    loadLevels();
  } else {
    showResponse('levelResponse', `❌ Error: ${result.error}`, true);
  }
}

async function loadLevels() {
  const url = `${API_BASE}/levels`;
  const result = await fetchWithSSL(url);

  if (result.ok) {
    const levels = Array.isArray(result.data) ? result.data : [];
    const list = document.getElementById('levelsList');
    list.innerHTML = levels.map(level => `
      <div class="list-item">
        <span><strong>${level.name}</strong> ${level.defaultLevel ? '(Default)' : ''}</span>
        <div class="actions">
          <button class="btn-danger" onclick="deleteLevel('${level.name}')">Delete</button>
        </div>
      </div>
    `).join('');
    showResponse('levelResponse', `✅ Loaded ${levels.length} levels.`);
  } else {
    showResponse('levelResponse', `❌ Failed to load levels: ${result.error}`, true);
  }
}

async function deleteLevel(name) {
  if (!confirm(`Delete level "${name}"?`)) return;

  const url = `${API_BASE}/level/${encodeURIComponent(name)}`;
  const result = await fetchWithSSL(url, { method: 'DELETE' });

  if (result.ok) {
    showResponse('levelResponse', `✅ Level "${name}" deleted.`);
    loadLevels();
  } else {
    showResponse('levelResponse', `❌ Error deleting level: ${result.error}`, true);
  }
}