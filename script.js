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

function setHomeAddress(address) {
  addressInput.value = address;
  const url = new URL("https://www.google.com/maps/dir/");
  url.search = new URLSearchParams({
    api: "1",
    destination: address,
    travelmode: "driving",
    dir_action: "navigate"
  }).toString();
  navigationLink.href = url.toString();
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

loadWeather();
