
// 🌙 Theme Toggle
document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// LocalStorage structure: { shortCode: { longUrl, clicks, createdAt } }
let links = JSON.parse(localStorage.getItem("links")) || {};

// 🔗 Generate Short URL
document.getElementById("shortenBtn").addEventListener("click", () => {
  let longUrl = document.getElementById("longUrl").value.trim();
  let alias = document.getElementById("customAlias").value.trim();

  if (!longUrl) {
    alert("Please enter a URL!");
    return;
  }

  // Validate URL format
  try {
    new URL(longUrl);
  } catch {
    alert("Invalid URL! Please enter a valid link.");
    return;
  }

  let shortCode = alias || Math.random().toString(36).substring(2, 8);

  if (links[shortCode]) {
    alert("Alias already taken! Choose another one.");
    return;
  }

  let shortUrl = `${window.location.origin}${window.location.pathname}?s=${shortCode}`;

  links[shortCode] = {
    longUrl,
    clicks: 0,
    createdAt: new Date().toLocaleString()
  };
  localStorage.setItem("links", JSON.stringify(links));

  document.getElementById("shortUrl").value = shortUrl;
  document.getElementById("result").classList.remove("hidden");

  // Generate QR Code
  QRCode.toCanvas(document.getElementById("qrCode"), shortUrl, { width: 150 }, (err) => {
    if (err) console.error(err);
    else document.getElementById("downloadQR").classList.remove("hidden"); // Show download button
  });

  showAnalytics();
});

// 📋 Copy to Clipboard
document.getElementById("copyBtn").addEventListener("click", () => {
  let shortUrl = document.getElementById("shortUrl");
  shortUrl.select();
  document.execCommand("copy");
  alert("Copied to clipboard!");
});

// ⬇️ Download QR Code
document.getElementById("downloadQR").addEventListener("click", () => {
  let canvas = document.getElementById("qrCode");
  let link = document.createElement("a");
  link.download = "qrcode.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

// 📊 Show Analytics
function showAnalytics() {
  let container = document.getElementById("analyticsData");
  container.innerHTML = "";

  for (let code in links) {
    let { longUrl, clicks, createdAt } = links[code];
    let shortUrl = `${window.location.origin}${window.location.pathname}?s=${code}`;

    let div = document.createElement("div");
    div.className = "analytics-item";
    div.innerHTML = `
      <p><strong>Short:</strong> <a href="${shortUrl}" target="_blank">${shortUrl}</a></p>
      <p><strong>Original:</strong> ${longUrl}</p>
      <p><strong>Clicks:</strong> ${clicks}</p>
      <p><strong>Created:</strong> ${createdAt}</p>
    `;
    container.appendChild(div);
  }

  if (Object.keys(links).length > 0) {
    document.getElementById("analytics").classList.remove("hidden");
  }
}

// 🚀 Handle redirect when visiting ?s=shortCode
(function handleRedirect() {
  let params = new URLSearchParams(window.location.search);
  let shortCode = params.get("s");
  if (shortCode && links[shortCode]) {
    links[shortCode].clicks += 1;
    localStorage.setItem("links", JSON.stringify(links));
    window.location.href = links[shortCode].longUrl;
  }
})();

// Show analytics on load
showAnalytics();
