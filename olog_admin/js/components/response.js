// Utility: Show response
function showResponse(elementId, message, isError = false) {
  const el = document.getElementById(elementId);
  el.textContent = message;
  el.className = isError ? 'response error' : 'response';
  if (isError) {
    console.error(message);
  } else {
    console.log(message);
  }
}

// Export for use in other modules
window.showResponse = showResponse;