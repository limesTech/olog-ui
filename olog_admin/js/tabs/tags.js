async function createTag() {
  const name = document.getElementById('tagName').value.trim();
  const state = document.getElementById('tagState').value;

  if (!name) {
    showResponse('tagResponse', 'Tag name is required!', true);
    return;
  }

  const url = `${API_BASE}/tags/${encodeURIComponent(name)}`;
  const payload = { name, state };

  const result = await fetchWithSSL(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (result.ok) {
    showResponse('tagResponse', `✅ Tag "${name}" created successfully.`);
    loadTags();
  } else {
    showResponse('tagResponse', `❌ Error: ${result.error}`, true);
  }
}

async function loadTags() {
  const url = `${API_BASE}/tags`;
  const result = await fetchWithSSL(url);

  if (result.ok) {
    const tags = Array.isArray(result.data) ? result.data : [];
    const list = document.getElementById('tagsList');
    list.innerHTML = tags.map(tag => `
      <div class="list-item">
        <span><strong>${tag.name}</strong> (${tag.state})</span>
        <div class="actions">
          <button class="btn-danger" onclick="deleteTag('${tag.name}')">Delete</button>
        </div>
      </div>
    `).join('');
    showResponse('tagResponse', `✅ Loaded ${tags.length} tags.`);
  } else {
    showResponse('tagResponse', `❌ Failed to load tags: ${result.error}`, true);
  }
}

async function deleteTag(name) {
  if (!confirm(`Delete tag "${name}"?`)) return;

  const url = `${API_BASE}/tags/${encodeURIComponent(name)}`;
  const result = await fetchWithSSL(url, { method: 'DELETE' });

  if (result.ok) {
    showResponse('tagResponse', `✅ Tag "${name}" deleted.`);
    loadTags();
  } else {
    showResponse('tagResponse', `❌ Error deleting tag: ${result.error}`, true);
  }
}