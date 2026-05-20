import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { t } = useTranslation();
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate("/pilgrim", { replace: true });
  }, [user, navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register(email, password, fullName);
      navigate("/pilgrim", { replace: true });
    } catch {
      setError(t("common.error"));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      <h1 className="text-2xl font-bold text-nabd-primary mb-6">{t("auth.registerTitle")}</h1>
      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <label className="block">
          <span className="text-sm text-slate-600">{t("auth.fullName")}</span>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </label>
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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </label>
        <button type="submit" className="w-full py-2 rounded-lg bg-nabd-teal text-white font-semibold">
          {t("auth.submitRegister")}
        </button>
        <p className="text-sm text-center text-slate-600">
          {t("auth.hasAccount")}{" "}
          <Link to="/login" className="text-nabd-primary font-semibold">
            {t("nav.login")}
          </Link>
        </p>
      </form>
    </div>
  );
}
