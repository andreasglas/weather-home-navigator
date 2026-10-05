"use strict";

const weatherStatus = document.getElementById("weather-status");
const weatherPanel = document.getElementById("weather");
const refreshButton = document.getElementById("refresh-weather");
const addressInput = document.getElementById("home-address");
const homeStatus = document.getElementById("home-status");
const navigationLink = document.getElementById("navigate-home");
const storageKey = "weather-home-navigator.home-address";
const numberFormat = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });

function weatherAppearance(code, isDay) {
  if (code === 0) return [isDay ? "☀️" : "🌙", "Klarer Himmel"];
  if (code === 1) return [isDay ? "🌤️" : "🌙", "Überwiegend klar"];
  if (code === 2) return ["⛅", "Teilweise bewölkt"];
  if (code === 3) return ["☁️", "Bewölkt"];
  if ([45, 48].includes(code)) return ["🌫️", "Nebel"];
  if ([51, 53, 55].includes(code)) return ["🌦️", "Nieselregen"];
  if ([56, 57].includes(code)) return ["🌧️", "Gefrierender Nieselregen"];
  if ([61, 63, 65, 80, 81, 82].includes(code)) return ["🌧️", "Regen"];
  if ([66, 67].includes(code)) return ["🌧️", "Gefrierender Regen"];
  if ([71, 73, 75, 77, 85, 86].includes(code)) return ["🌨️", "Schnee"];
  if ([95, 96, 99].includes(code)) return ["⛈️", "Gewitter"];
  return ["🌡️", "Wetterlage unbekannt"];
}

function setWeatherError(message) {
  weatherStatus.textContent = message;
  weatherStatus.classList.add("error");
  refreshButton.disabled = false;
}

async function fetchWeather(position) {
  weatherStatus.textContent = "Wetterdaten werden geladen …";
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day",
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
    timezone: "auto"
  }).toString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error("Weather request failed");
    const data = await response.json();
    const current = data.current;
    if (!current || !["temperature_2m", "relative_humidity_2m", "weather_code", "wind_speed_10m", "is_day"]
      .every((key) => Number.isFinite(current[key]))) {
      throw new Error("Invalid weather data");
    }
    const [icon, description] = weatherAppearance(current.weather_code, current.is_day);
    document.getElementById("weather-icon").textContent = icon;
    document.getElementById("temperature").textContent = `${numberFormat.format(current.temperature_2m)} °C`;
    document.getElementById("weather-description").textContent = description;
    document.getElementById("humidity").textContent = `${numberFormat.format(current.relative_humidity_2m)} %`;
    document.getElementById("wind").textContent = `${numberFormat.format(current.wind_speed_10m)} km/h`;
    document.getElementById("weather-updated").textContent =
      `Abgerufen um ${new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} Uhr`;
    weatherPanel.hidden = false;
    weatherStatus.textContent = "Das aktuelle Wetter an deinem Standort";
  } catch {
    setWeatherError("Wetterdaten konnten nicht geladen werden. Prüfe deine Internetverbindung und versuche es erneut.");
  } finally {
    clearTimeout(timeout);
    refreshButton.disabled = false;
  }
}

function loadWeather() {
  weatherPanel.hidden = true;
  weatherStatus.classList.remove("error");
  refreshButton.disabled = true;
  weatherStatus.textContent = "Dein Standort wird ermittelt …";
  if (!window.isSecureContext) {
    setWeatherError("Der Standort benötigt eine sichere Verbindung. Öffne diese Seite über HTTPS oder localhost.");
    return;
  }
  if (!navigator.geolocation) {
    setWeatherError("Dein Browser unterstützt keine Standortabfrage.");
    return;
  }
  navigator.geolocation.getCurrentPosition(fetchWeather, (error) => {
    const messages = {
      1: "Standortzugriff verweigert. Erlaube den Standortzugriff in den Browser-Einstellungen und tippe auf Aktualisieren.",
      2: "Dein Standort ist gerade nicht verfügbar. Versuche es erneut.",
      3: "Die Standortabfrage hat zu lange gedauert. Versuche es erneut."
    };
    setWeatherError(messages[error.code] || "Dein Standort konnte nicht ermittelt werden. Versuche es erneut.");
  }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
}

function navigationUrl(address) {
  const url = new URL("https://www.google.com/maps/dir/");
  url.search = new URLSearchParams({
    api: "1",
    destination: address,
    travelmode: "driving",
    dir_action: "navigate"
  }).toString();
  return url.toString();
}

function setHomeAddress(address) {
  addressInput.value = address;
  navigationLink.href = navigationUrl(address);
  navigationLink.classList.remove("disabled");
  navigationLink.removeAttribute("aria-disabled");
}

document.getElementById("home-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const address = addressInput.value.trim();
  if (!address) {
    addressInput.setCustomValidity("Bitte gib deine Heimatadresse ein.");
    addressInput.reportValidity();
    return;
  }
  setHomeAddress(address);
  homeStatus.classList.remove("error");
  try {
    localStorage.setItem(storageKey, address);
    homeStatus.textContent = "Heimatadresse gespeichert. Bereit für den Heimweg!";
  } catch {
    homeStatus.textContent = "Die Adresse gilt nur für diese Sitzung, da dein Browser das Speichern nicht erlaubt.";
  }
});

addressInput.addEventListener("input", () => addressInput.setCustomValidity(""));
navigationLink.addEventListener("click", (event) => {
  if (navigationLink.getAttribute("aria-disabled") === "true") {
    event.preventDefault();
    addressInput.closest("details").open = true;
    addressInput.focus();
  }
});
refreshButton.addEventListener("click", loadWeather);

try {
  const savedAddress = localStorage.getItem(storageKey);
  if (savedAddress && savedAddress.trim()) {
    setHomeAddress(savedAddress.trim());
    homeStatus.textContent = "Deine gespeicherte Heimatadresse ist bereit.";
  }
} catch {
  homeStatus.textContent = "Lokaler Speicher ist nicht verfügbar. Du kannst die Adresse für diese Sitzung eingeben.";
}

document.getElementById("navigate-work").href = navigationUrl("FIZ München, Knorrstraße 147, München");

const currencyFormat = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const balanceInput = document.getElementById("account-balance");
const balanceStatus = document.getElementById("balance-status");
const keyInput = document.getElementById("oil-api-key");
const pricesButton = document.getElementById("refresh-prices");
const oilSaveButton = document.querySelector("#oil-form button");
const reminderStatus = document.getElementById("reminder-status");
const reminderMessage = document.getElementById("reminder-message");
const reminderTime = document.getElementById("reminder-time");
const notificationStatus = document.getElementById("notification-status");
const prefix = "weather-home-navigator.";
let oilApiKey = "";
let reminder = null;

function readLocal(key) {
  try {
    return localStorage.getItem(prefix + key);
  } catch {
    return null;
  }
}

function saveLocal(key, value, status, message) {
  try {
    if (value === null) localStorage.removeItem(prefix + key);
    else localStorage.setItem(prefix + key, value);
    status.textContent = message;
  } catch {
    status.textContent = "Speichern nicht möglich: Änderung gilt nur für diese Sitzung.";
  }
}

function parseBalance(value) {
  const text = value.trim();
  if (!/^-?\d{1,12}([.,]\d{1,2})?$/.test(text)) return null;
  const amount = Number(text.replace(",", "."));
  return Number.isFinite(amount) ? amount : null;
}

document.getElementById("balance-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const amount = parseBalance(balanceInput.value);
  if (amount === null) {
    balanceInput.setCustomValidity("Bitte einen Betrag ohne Tausendertrennzeichen mit höchstens zwei Nachkommastellen eingeben.");
    balanceInput.reportValidity();
    return;
  }
  document.getElementById("balance-display").textContent = currencyFormat.format(amount);
  saveLocal("balance", String(amount), balanceStatus, "Kontostand lokal gespeichert. Jederzeit editierbar.");
});
balanceInput.addEventListener("input", () => balanceInput.setCustomValidity(""));
const savedBalance = readLocal("balance");
if (savedBalance !== null && parseBalance(savedBalance) !== null) {
  balanceInput.value = savedBalance.replace(".", ",");
  document.getElementById("balance-display").textContent = currencyFormat.format(parseBalance(savedBalance));
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, { signal: controller.signal, credentials: "omit", referrerPolicy: "no-referrer" });
    if (!response.ok) throw new Error("API request failed");
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function loadBitcoin() {
  const status = document.getElementById("bitcoin-status");
  const price = document.getElementById("bitcoin-price");
  status.textContent = "Kurs wird geladen …";
  status.classList.remove("error");
  price.textContent = "—";
  try {
    const data = await fetchJson("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur&include_last_updated_at=true");
    if (!Number.isFinite(data.bitcoin?.eur) || data.bitcoin.eur <= 0 ||
        !Number.isFinite(data.bitcoin.last_updated_at) || data.bitcoin.last_updated_at <= 0) {
      throw new Error("Invalid Bitcoin price");
    }
    price.textContent = currencyFormat.format(data.bitcoin.eur);
    status.textContent = `Stand: ${new Date(data.bitcoin.last_updated_at * 1000).toLocaleString("de-DE")}`;
  } catch {
    status.textContent = "Kurs nicht verfügbar. Bitte später aktualisieren (Internet/API-Limit).";
    status.classList.add("error");
  }
}

async function loadOil() {
  const status = document.getElementById("oil-status");
  const price = document.getElementById("oil-price");
  status.classList.remove("error");
  price.textContent = "—";
  if (!oilApiKey) {
    status.textContent = "Zum Laden bitte deinen EIA API-Schlüssel für diese Sitzung eingeben.";
    return;
  }
  status.textContent = "Preis wird geladen …";
  const url = new URL("https://api.eia.gov/v2/petroleum/pri/wfr/data/");
  url.search = new URLSearchParams({
    api_key: oilApiKey,
    frequency: "weekly",
    "data[0]": "value",
    "facets[product][]": "EPD2F",
    "facets[process][]": "PRS",
    "facets[duoarea][]": "NUS",
    "sort[0][column]": "period",
    "sort[0][direction]": "desc",
    length: "1"
  }).toString();
  try {
    const data = await fetchJson(url);
    const row = data.response?.data?.[0];
    const value = Number(row?.value);
    if (!row || row.value === null || row.value === "" || !Number.isFinite(value) || value <= 0 ||
        !/^\d{4}-\d{2}-\d{2}$/.test(row.period)) throw new Error("Invalid heating oil price");
    price.textContent = `${new Intl.NumberFormat("de-DE", { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(value)} $/gal`;
    status.textContent = `Stand: ${row.period} · US-Durchschnitt`;
  } catch {
    status.textContent = "Heizölpreis nicht verfügbar. API-Schlüssel und Verbindung prüfen.";
    status.classList.add("error");
  }
}

async function loadPrices() {
  pricesButton.disabled = true;
  keyInput.disabled = true;
  oilSaveButton.disabled = true;
  await Promise.all([loadBitcoin(), loadOil()]);
  pricesButton.disabled = false;
  keyInput.disabled = false;
  oilSaveButton.disabled = false;
}

document.getElementById("oil-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (pricesButton.disabled) return;
  oilApiKey = keyInput.value.trim();
  document.getElementById("oil-settings-status").textContent = oilApiKey
    ? "API-Schlüssel nur für diese Sitzung gesetzt. Nach Neuladen erneut eingeben."
    : "API-Schlüssel aus der Sitzung entfernt.";
  await loadPrices();
});
pricesButton.addEventListener("click", loadPrices);

function describeReminder() {
  reminderStatus.textContent = reminder
    ? `${reminder.message} · ${new Date(reminder.at).toLocaleString("de-DE")}`
    : "Keine Erinnerung geplant.";
}

function checkReminder() {
  if (!reminder || Date.now() < reminder.at) return;
  const message = reminder.message;
  reminder = null;
  const alert = document.getElementById("reminder-alert");
  alert.textContent = `Erinnerung: ${message}`;
  alert.hidden = false;
  saveLocal("reminder", null, reminderStatus, "Erinnerung ausgelöst.");
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification("Mein Dashboard", { body: message });
    } catch {
      notificationStatus.textContent = "Systembenachrichtigungen sind hier nicht verfügbar. Die Erinnerung steht im Dashboard.";
    }
  }
}

document.getElementById("reminder-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const at = new Date(reminderTime.value).getTime();
  const message = reminderMessage.value.trim();
  if (!message || !Number.isFinite(at) || at <= Date.now()) {
    reminderStatus.textContent = "Bitte eine Nachricht und einen Zeitpunkt in der Zukunft eingeben.";
    return;
  }
  reminder = { message, at };
  document.getElementById("reminder-alert").hidden = true;
  describeReminder();
  saveLocal("reminder", JSON.stringify(reminder), reminderStatus, reminderStatus.textContent);
});
document.getElementById("cancel-reminder").addEventListener("click", () => {
  reminder = null;
  reminderMessage.value = "";
  reminderTime.value = "";
  document.getElementById("reminder-alert").hidden = true;
  saveLocal("reminder", null, reminderStatus, "Erinnerung gelöscht.");
});
try {
  const saved = JSON.parse(readLocal("reminder"));
  if (saved && typeof saved.message === "string" && saved.message.trim() &&
      saved.message.length <= 150 && Number.isFinite(saved.at) && saved.at > 0) {
    reminder = saved;
    reminderMessage.value = saved.message;
    const localDate = new Date(saved.at);
    if (!Number.isFinite(localDate.getTime())) throw new Error("Invalid reminder date");
    localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
    reminderTime.value = localDate.toISOString().slice(0, 16);
    describeReminder();
  }
} catch {
  reminder = null;
  reminderStatus.textContent = "Gespeicherte Erinnerung ungültig. Bitte neu einrichten.";
}

const notificationsButton = document.getElementById("enable-notifications");
if (!("Notification" in window) || !window.isSecureContext) {
  notificationsButton.disabled = true;
  notificationStatus.textContent = "Keine Systembenachrichtigungen verfügbar. Erinnerungen erscheinen im geöffneten Dashboard.";
} else {
  notificationStatus.textContent = `Browser-Erlaubnis: ${Notification.permission}. Erinnerungen benötigen ein geöffnetes Dashboard.`;
}
notificationsButton.addEventListener("click", async () => {
  try {
    const permission = await Notification.requestPermission();
    notificationStatus.textContent = permission === "granted"
      ? "Benachrichtigungen erlaubt. Das Dashboard muss geöffnet bleiben."
      : "Keine Erlaubnis. Erinnerungen erscheinen weiterhin im Dashboard.";
  } catch {
    notificationStatus.textContent = "Nicht unterstützt. Erinnerungen erscheinen im Dashboard.";
  }
});

setInterval(checkReminder, 1000);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) checkReminder();
});
checkReminder();
loadWeather();
loadPrices();
