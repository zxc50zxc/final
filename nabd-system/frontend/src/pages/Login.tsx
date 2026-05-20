import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

const roleHome: Record<string, string> = {
  pilgrim: "/pilgrim",
  staff: "/staff",
  admin: "/admin",
};

export default function Login() {
  const { t } = useTranslation();
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate(roleHome[user.role] || "/", { replace: true });
  }, [user, navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      const u = JSON.parse(localStorage.getItem("nabd_user") || "{}");
      navigate(roleHome[u.role] || "/", { replace: true });
    } catch {
      setError(t("common.error"));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      <h1 className="text-2xl font-bold text-nabd-primary mb-6">{t("auth.loginTitle")}</h1>
      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <label className="block">
          <span className="text-sm text-slate-600">{t("auth.email")}</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-600">{t("auth.password")}</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </label>
        <button type="submit" className="w-full py-2 rounded-lg bg-nabd-primary text-white font-semibold">
          {t("auth.submitLogin")}
        </button>
        <p className="text-sm text-center text-slate-600">
          {t("auth.noAccount")}{" "}
          <Link to="/register" className="text-nabd-teal font-semibold">
            {t("nav.register")}
          </Link>
        </p>
      </form>
    </div>
  );
}
