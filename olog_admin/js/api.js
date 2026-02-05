// Base API URL
const API_BASE = 'https://mesalogger.mesa.kph:8181/Olog';

// Utility: Basic Auth Header
function getOlogAuthHeader() {
  return 'Basic ' + btoa('guest:guest');
}

// Utility: Fetch with SSL bypass (for localhost)
async function fetchWithSSL(url, options = {}) {
  const headers = {
    ...options.headers,
    'Authorization': getOlogAuthHeader()
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = await response.text();
    }

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

// Export for use in other modules
window.API_BASE = API_BASE;
window.getOlogAuthHeader = getOlogAuthHeader;
window.fetchWithSSL = fetchWithSSL;