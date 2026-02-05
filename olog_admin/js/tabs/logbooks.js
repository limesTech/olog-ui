async function createLogbook() {
  const name = document.getElementById('logbookName').value.trim();
  const owner = document.getElementById('logbookOwner').value.trim();
  const state = document.getElementById('logbookState').value;

  if (!name) {
    showResponse('logbookResponse', 'Logbook name is required!', true);
    return;
  }

  const url = `${API_BASE}/logbooks/${encodeURIComponent(name)}`;
  const payload = { name, owner, state };

  const result = await fetchWithSSL(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (result.ok) {
    showResponse('logbookResponse', `✅ Logbook "${name}" created successfully.`);
    loadLogbooks();
  } else {
    showResponse('logbookResponse', `❌ Error: ${result.error}`, true);
  }
}

async function loadLogbooks() {
  const url = `${API_BASE}/logbooks`;
  const result = await fetchWithSSL(url);

  if (result.ok) {
    const logbooks = Array.isArray(result.data) ? result.data : [];
    const list = document.getElementById('logbooksList');
    list.innerHTML = logbooks.map(lb => `
      <div class="list-item">
        <span><strong>${lb.name}</strong> (Owner: ${lb.owner}, State: ${lb.state})</span>
        <div class="actions">
          <button class="btn-danger" onclick="deleteLogbook('${lb.name}')">Delete</button>
        </div>
      </div>
    `).join('');
    showResponse('logbookResponse', `✅ Loaded ${logbooks.length} logbooks.`);
  } else {
    showResponse('logbookResponse', `❌ Failed to load logbooks: ${result.error}`, true);
  }
}

async function deleteLogbook(name) {
  if (!confirm(`Delete logbook "${name}"?`)) return;

  const url = `${API_BASE}/logbooks/${encodeURIComponent(name)}`;
  const result = await fetchWithSSL(url, { method: 'DELETE' });

  if (result.ok) {
    showResponse('logbookResponse', `✅ Logbook "${name}" deleted.`);
    loadLogbooks();
  } else {
    showResponse('logbookResponse', `❌ Error deleting logbook: ${result.error}`, true);
  }
}