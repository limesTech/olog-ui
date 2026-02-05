async function createLogEntry() {
  const owner = document.getElementById('logOwner').value.trim();
  const title = document.getElementById('logTitle').value.trim();
  const description = document.getElementById('logDescription').value.trim();
  const level = document.getElementById('logLevel').value;
  const logbooks = document.getElementById('logLogbooks').value.trim().split(',').map(s => s.trim()).filter(s => s);
  const tags = document.getElementById('logTags').value.trim().split(',').map(s => s.trim()).filter(s => s);
  const files = document.getElementById('logAttachments').files;

  if (!owner || !title || !description) {
    showResponse('logResponse', 'Owner, Title, and Description are required!', true);
    return;
  }

  const formData = new FormData();
  const logEntry = {
    owner,
    title,
    description,
    level,
    logbooks: logbooks.map(name => ({ name })),
    tags: tags.map(name => ({ name }))
  };

  formData.append('logEntry', new Blob([JSON.stringify(logEntry)], { type: 'application/json' }));

  // Add attachments
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  const url = `${API_BASE}/logs/multipart`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': getOlogAuthHeader()
      },
      body: formData
    });

    if (response.ok) {
      showResponse('logResponse', '✅ Log entry created successfully.');
      document.getElementById('logOwner').value = '';
      document.getElementById('logTitle').value = '';
      document.getElementById('logDescription').value = '';
      document.getElementById('logLogbooks').value = '';
      document.getElementById('logTags').value = '';
      document.getElementById('logAttachments').value = '';
    } else {
      const text = await response.text();
      showResponse('logResponse', `❌ Error: ${response.status} ${response.statusText}\n${text}`, true);
    }
  } catch (error) {
    showResponse('logResponse', `🚨 Network Error: ${error.message}`, true);
  }
}

async function searchLogs() {
  const text = document.getElementById('searchText').value.trim();
  const fuzzy = document.getElementById('searchFuzzy').value;
  const owner = document.getElementById('searchOwner').value;

  let url = `${API_BASE}/logs/search?`;
  if (text) url += `desc=${encodeURIComponent(text)}&`;
  if (fuzzy === 'true') url += `fuzzy=true&`;
  if (owner) url += `owner=${encodeURIComponent(owner)}&`;

  const result = await fetchWithSSL(url);

  if (result.ok) {
    const logs = Array.isArray(result.data) ? result.data : [];
    const resultsDiv = document.getElementById('searchResults');
    if (logs.length === 0) {
      resultsDiv.innerHTML = '<p>No logs found.</p>';
    } else {
      resultsDiv.innerHTML = logs.map(log => `
        <div class="log-entry">
          <h4>${log.title} <small>(${log.level})</small></h4>
          <p><strong>Owner:</strong> ${log.owner}</p>
          <p><strong>Description:</strong> ${log.description}</p>
          <p><strong>Created:</strong> ${new Date(log.createTime).toLocaleString()}</p>
          ${log.logbooks ? `<p><strong>Logbooks:</strong> ${log.logbooks.map(lb => lb.name).join(', ')}</p>` : ''}
          ${log.tags ? `<p><strong>Tags:</strong> ${log.tags.map(t => t.name).join(', ')}</p>` : ''}
          ${log.attachments ? `<div><strong>Attachments:</strong> ${log.attachments.map(a => `<div class="attachment">${a.filename}</div>`).join('')}</div>` : ''}
        </div>
      `).join('');
    }
    showResponse('logResponse', `✅ Found ${logs.length} logs.`);
  } else {
    showResponse('logResponse', `❌ Search failed: ${result.error}`, true);
  }
}