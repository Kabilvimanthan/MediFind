async function searchMedicine() {
  const medicine = document.getElementById("medicine").value.trim();
  const results = document.getElementById("results");
  if (!medicine) {
    results.innerHTML = "<p>Please enter a medicine name.</p>";
    return;
  }

  results.innerHTML = "<p>Searching nearby pharmacies...</p>";
  const res = await fetch(`/api/search?medicine=${encodeURIComponent(medicine)}`);
  const data = await res.json();

  results.innerHTML = data.map(p => `
    <article class="card">
      <div>
        <h3>${p.name}</h3>
        <small>${p.area} • ${p.lat.toFixed(4)}, ${p.lon.toFixed(4)}</small>
        <p class="${p.available ? "available" : "unavailable"}">
          ${p.available ? `${p.stock} units available` : "Out of stock"}
        </p>
      </div>
      ${p.available ? `<button onclick="reserve(${p.id}, '${escapeHtml(medicine)}')">Reserve</button>` : ""}
    </article>
  `).join("");
}

async function reserve(pharmacyId, medicine) {
  const res = await fetch("/api/reserve", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ pharmacyId, medicine })
  });
  const data = await res.json();
  alert(data.message);
  searchMedicine();
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
