import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Landing() {
  const { t } = useTranslation();
  const cards = [
    { title: t("landing.problem"), text: t("landing.problemText") },
    { title: t("landing.solution"), text: t("landing.solutionText") },
    { title: t("landing.track"), text: t("landing.trackText") },
    { title: t("landing.tech"), text: t("landing.techText") },
    { title: t("landing.value"), text: t("landing.valueText") },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-nabd-primary/10 to-nabd-teal/10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-nabd-primary mb-4">{t("landing.hero")}</h1>
          <p className="text-lg text-slate-600 mb-8">{t("tagline")}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/login" className="px-6 py-3 rounded-lg bg-nabd-primary text-white font-semibold hover:opacity-90">
              {t("landing.ctaLogin")}
            </Link>
            <Link to="/register" className="px-6 py-3 rounded-lg border-2 border-nabd-teal text-nabd-teal font-semibold hover:bg-nabd-teal/10">
              {t("landing.ctaRegister")}
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">{t("landing.demo")}</p>
        </div>
      </section>
      <section className="max-w-6xl mx-auto py-12 px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c) => (
          <article key={c.title} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-nabd-teal mb-2">{c.title}</h2>
            <p className="text-slate-600 text-sm leading-relaxed">{c.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
