import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { setLanguage } from "../i18n";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleLang = () => {
    const next = i18n.language === "ar" ? "en" : "ar";
    setLanguage(next);
  };

  const dashPath =
    user?.role === "admin" ? "/admin" : user?.role === "staff" ? "/staff" : user?.role === "pilgrim" ? "/pilgrim" : null;

  return (
    <header className="bg-gradient-to-r from-nabd-primary to-nabd-teal text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="font-bold text-xl">
          {t("appName")} <span className="font-normal text-sm opacity-90">{t("tagline")}</span>
        </Link>
        <nav className="flex items-center gap-3 flex-wrap text-sm">
          <button type="button" onClick={toggleLang} className="px-2 py-1 rounded bg-white/20 hover:bg-white/30">
            {t("common.lang")}
          </button>
          {user ? (
            <>
              {dashPath && (
                <Link to={dashPath} className="hover:underline">
                  {user.role === "admin" ? t("nav.admin") : user.role === "staff" ? t("nav.staff") : t("nav.pilgrim")}
                </Link>
              )}
              <span className="opacity-80">{user.full_name}</span>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="px-3 py-1 rounded bg-white/20 hover:bg-white/30"
              >
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                {t("nav.login")}
              </Link>
              <Link to="/register" className="px-3 py-1 rounded bg-white text-nabd-primary font-semibold">
                {t("nav.register")}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
