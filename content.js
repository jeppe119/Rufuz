// Content script to extract page content
(function() {
  // Extract page data
  const pageData = {
    title: document.title,
    url: window.location.href,
    content: extractTextContent(),
    links: document.querySelectorAll("a").length,
    timestamp: new Date().toISOString()
  };

  // Send data back to background script
  browser.runtime.sendMessage({
    type: "PAGE_CONTENT",
    data: pageData
  });
})();

function extractTextContent() {
  // Remove script and style elements
  const clone = document.body.cloneNode(true);
  const scriptsAndStyles = clone.querySelectorAll("script, style, noscript");
  scriptsAndStyles.forEach(el => el.remove());

  // Get text content
  let text = clone.innerText || clone.textContent;

  // Clean up whitespace
  text = text.replace(/\s+/g, " ").trim();

  return text;
}
