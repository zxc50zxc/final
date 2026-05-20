import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "./ar.json";
import en from "./en.json";

const saved = localStorage.getItem("nabd_lang") || "ar";

i18n.use(initReactI18next).init({
  resources: { ar: { translation: ar }, en: { translation: en } },
  lng: saved,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export function setLanguage(lang: "ar" | "en") {
  localStorage.setItem("nabd_lang", lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  i18n.changeLanguage(lang);
}

setLanguage(saved as "ar" | "en");
export default i18n;
