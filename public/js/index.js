


async function searchCity(term) { 
  if(!term || term.length < 2) return [];
  
  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/municipios?nome=${encodeURIComponent(term)}`;
  const response = await fetch(url);
  const data = response.json();
  return data.map(c => c.nome).slice(0, 5);
};

async function renderCityChoices(filter="") {
   const cityList = $("#cityList");
   const cityInput = $("#cityInput");

   cityList.innerHTML = "";
   const f = filter.trim().toLowerCase();
   const list = cities.filter(c => c.toLowerCase().includes(f));

   list.forEach(c => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = c;

    btn.addEventListener("click", ()=> {
      cityInput.value = c;
      cityList.style.display = "none";
    });
    cityList.appendChild(btn);
  });

  cityList.style.display = list.length ? "block" : "none";
};
// Helpers
const $ = sel => document.querySelector(sel);
const showToast = (txt, ok=true) => {
  const t = $("#toast");
  t.textContent = txt;
  t.style.display = "block";
  t.style.borderColor = ok ? "rgba(52,211,153,0.12)" : "rgba(251,113,133,0.12)";
  clearTimeout(t._hide);
  t._hide = setTimeout(()=> t.style.display="none", 3800);
};

alertsEl.querySelectorAll(".chip").forEach(chip => {
  const input = chip.querySelector("input");
  chip.addEventListener("click", () => {
    input.checked = !input.checked;
    chip.classList.toggle("active", input.checked);
  });
});

function buildPreview() {
  const ph = phoneInput.value.trim();
  const city = cityInput.value.trim();
  const selected = Array.from(alertsEl.querySelectorAll("input:checked")).map(i => i.value);

  
  if (!ph && !city && selected.length === 0) {
    showToast("Preencha pelo menos um campo para ver o preview.", false);
    return;
  };

    prefsCard.style.display = "block";

  previewTitle.textContent = ph ? `Número: ${ph}` : "Número: —";
  prefPhone.textContent = ph || "—";
  prefCity.textContent = city || "—";

  
};