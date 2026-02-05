async function createProperty() {
  const name = document.getElementById('propertyName').value.trim();
  const owner = document.getElementById('propertyOwner').value.trim();
  const state = document.getElementById('propertyState').value;
  const attributesText = document.getElementById('propertyAttributes').value.trim();

  if (!name) {
    showResponse('propertyResponse', 'Property name is required!', true);
    return;
  }

  let attributes = [];
  if (attributesText) {
    try {
      attributes = JSON.parse(attributesText);
    } catch (e) {
      showResponse('propertyResponse', `❌ Invalid JSON in attributes: ${e.message}`, true);
      return;
    }
  }

  const url = `${API_BASE}/properties/${encodeURIComponent(name)}`;
  const payload = { name, owner, state, attributes };

  const result = await fetchWithSSL(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (result.ok) {
    showResponse('propertyResponse', `✅ Property "${name}" created successfully.`);
    loadProperties();
  } else {
    showResponse('propertyResponse', `❌ Error: ${result.error}`, true);
  }
}

async function loadProperties() {
  const url = `${API_BASE}/properties`;
  const result = await fetchWithSSL(url);

  if (result.ok) {
    const properties = Array.isArray(result.data) ? result.data : [];
    const list = document.getElementById('propertiesList');
    list.innerHTML = properties.map(prop => `
      <div class="list-item">
        <span><strong>${prop.name}</strong> (Owner: ${prop.owner}, State: ${prop.state})</span>
        <div class="actions">
          <button class="btn-danger" onclick="deleteProperty('${prop.name}')">Delete</button>
        </div>
      </div>
    `).join('');
    showResponse('propertyResponse', `✅ Loaded ${properties.length} properties.`);
  } else {
    showResponse('propertyResponse', `❌ Failed to load properties: ${result.error}`, true);
  }
}

async function deleteProperty(name) {
  if (!confirm(`Delete property "${name}"?`)) return;

  const url = `${API_BASE}/properties/${encodeURIComponent(name)}`;
  const result = await fetchWithSSL(url, { method: 'DELETE' });

  if (result.ok) {
    showResponse('propertyResponse', `✅ Property "${name}" deleted.`);
    loadProperties();
  } else {
    showResponse('propertyResponse', `❌ Error deleting property: ${result.error}`, true);
  }
}