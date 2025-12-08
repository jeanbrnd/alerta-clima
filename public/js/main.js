let cities = [];


async function loadAllCities() {
  try {
    const url = "https://servicodados.ibge.gov.br/api/v1/localidades/municipios";
    const res = await fetch(url);
    const data = await res.json();

    cities = data.map(c => c.nome);
  } catch (err) {
    console.error(err);
  }
}

window.onload = async () => {
  await loadAllCities();
  renderCityChoices("");
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

// UI wiring
const cityInput = $("#cityInput");
const cityList = $("#cityList");
const alertsEl = $("#alerts");
const previewBtn = $("#previewBtn");
const saveBtn = $("#saveBtn");
const subscribeForm = $("#subscribeForm");
const phoneInput = $("#phone");
const prefsCard = $("#prefsCard");
const prefPhone = $("#prefPhone");
const prefCity = $("#prefCity");
const prefAlerts = $("#prefAlerts");
const lastSaved = $("#lastSaved");
const savedIndicator = $("#savedIndicator");
const summaryTitle = $("#summaryTitle");
const summaryCity = $("#summaryCity");
const avatarTxt = $("#avatarTxt");
const exportBtn = $("#exportBtn");
const clearBtn = $("#clearBtn");
const previewTitle = $("#prefName");
const prefTime = $("#prefTime");

// build city list for autocomplete
function renderCityChoices(filter=""){
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
}

cityInput.addEventListener("input", (e)=>{
  renderCityChoices(e.target.value);
});

document.addEventListener("click", (e)=>{
  if(!e.target.closest(".city-search")) cityList.style.display = "none";
});

// chips toggle
alertsEl.querySelectorAll(".chip").forEach(chip => {
  const input = chip.querySelector("input");
  chip.addEventListener("click", () => {
    input.checked = !input.checked;
    chip.classList.toggle("active", input.checked);
  });
});

// preview
previewBtn.addEventListener("click", ()=> buildPreview());

// build preview & populate right column
function buildPreview(){
  const ph = phoneInput.value.trim();
  const city = cityInput.value.trim();
  const selected = Array.from(alertsEl.querySelectorAll("input:checked")).map(i => i.value);
  if(!ph && !city && selected.length===0){
    showToast("Preencha pelo menos um campo para ver o preview.", false);
    return;
  }
  prefsCard.style.display = "block";
  previewTitle.textContent = ph ? `Número: ${ph}` : "Número: —";
  prefPhone.textContent = ph || "—";
  prefCity.textContent = city || "—";
  prefTime.textContent = $("#timePref").value ? `Preferência: ${$("#timePref").selectedOptions[0].text}` : "Notificações imediatas";
  prefAlerts.innerHTML = "";
  if(selected.length===0){
    prefAlerts.textContent = "Nenhum alerta selecionado";
  } else {
    selected.forEach(s => {
      const el = document.createElement("div");
      el.className = "chip active";
      el.style.margin = "4px";
      el.textContent = humanizeAlert(s);
      prefAlerts.appendChild(el);
    });
  }
  savedIndicator.innerHTML = "";
  summaryTitle.textContent = ph ? ph : "Pronto para inscrição";
  summaryCity.textContent = city ? city : "";
  avatarTxt.textContent = initialsFromText(city || ph || "AC");
}

// small helpers
function humanizeAlert(key){
  return {
    temp_high: "Alta temperatura",
    temp_low: "Baixa temperatura",
    rain: "Chuva / Temporal",
    wind: "Vento forte",
    humidity: "Umidade crítica"
  }[key] || key;
}

function initialsFromText(text){
  const parts = text.split(/[\s,]+/).filter(Boolean);
  if(parts.length===0) return "AC";
  if(parts.length===1) return parts[0].slice(0,2).toUpperCase();
  return (parts[0][0]+parts[1][0]).toUpperCase();
}

// validate phone (basic international digits)
function validPhone(num){
  const digits = num.replace(/\D/g,'');
  return digits.length >= 10 && digits.length <= 15;
}

// save / submit
function loadSaved(){
  const list = JSON.parse(localStorage.getItem("alerta_clima_subs") || "[]");
  if(!list.length){
    summaryTitle.textContent = "Nenhuma inscrição";
    prefsCard.style.display = "none";
    return;
  }
  const latest = list[list.length-1];
  prefsCard.style.display = "block";
  previewTitle.textContent = `Último inscrito`;
  prefPhone.textContent = latest.phone;
  prefCity.textContent = latest.city;
  prefAlerts.innerHTML = "";
  latest.alerts.forEach(a=>{
    const el = document.createElement("div");
    el.className = "chip active";
    el.style.margin = "4px";
    el.textContent = humanizeAlert(a);
    prefAlerts.appendChild(el);
  });
  lastSaved.textContent = new Date(latest.savedAt).toLocaleString();
  savedIndicator.innerHTML = `<span class="saved">Salvo ✓</span>`;
  summaryTitle.textContent = latest.phone;
  summaryCity.textContent = latest.city;
  avatarTxt.textContent = initialsFromText(latest.city || latest.phone);
}

subscribeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const phone = phoneInput.value.trim();
  const city = cityInput.value.trim();
  const alerts = Array.from(alertsEl.querySelectorAll("input:checked")).map(i=>i.value);
  const timePref = $("#timePref").value;

  if(!phone){
    showToast("Insira seu número de WhatsApp.", false); phoneInput.focus(); return;
  }
  if(!validPhone(phone)){
    showToast("Número inválido. Use formato internacional ou verifique os dígitos.", false); phoneInput.focus(); return;
  }
  if(!city){
    showToast("Selecione uma cidade.", false); cityInput.focus(); return;
  }
  if(alerts.length===0){
    showToast("Escolha pelo menos um tipo de alerta.", false); return;
  }

  // montar payload
  const payload = {
    phone: phone.replace(/\s+/g,''),
    city,
    alerts,
    timePref,
    savedAt: new Date().toISOString()
  };

  // salvar localmente
  const list = JSON.parse(localStorage.getItem("alerta_clima_subs") || "[]");
  list.push(payload);
  localStorage.setItem("alerta_clima_subs", JSON.stringify(list));

  buildPreview();
  loadSaved();
  showToast("Inscrição salva localmente. Enviando para o servidor...");

  try {
    const resp = await fetch("/api/subscription", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });
   console.log(resp)
   alert("deu bo")
    if(resp.ok){
      showToast("Servidor confirmou inscrição.");
    } else {
      showToast("Servidor retornou erro ao salvar.", false);
    };

  } catch(err){
    console.log(err);
    showToast("Não foi possível contatar o servidor.", false);
  }
});

// export CSV
exportBtn.addEventListener("click", ()=>{
  const list = JSON.parse(localStorage.getItem("alerta_clima_subs") || "[]");
  if(!list.length){ showToast("Nenhuma inscrição para exportar.", false); return; }
  const rows = [
    ["phone","city","alerts","timePref","savedAt"],
    ...list.map(r => [r.phone, r.city, `"${r.alerts.join(';')}"`, r.timePref, r.savedAt])
  ];
  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "inscricoes_alerta_clima.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast("CSV criado e download iniciado.");
});

// clear form
clearBtn.addEventListener("click", ()=>{
  phoneInput.value = "";
  cityInput.value = "";
  $("#timePref").value = "";
  alertsEl.querySelectorAll("input").forEach(i=>{ i.checked=false; i.parentElement.classList.remove("active") });
  prefsCard.style.display = "none";
  showToast("Formulário limpo.");
});

renderCityChoices("");
loadSaved();
