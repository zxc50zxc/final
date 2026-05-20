import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CentersMap from "../components/CentersMap";
import {
  Center,
  createAppointment,
  createMedRequest,
  getCenters,
  getZones,
  myAppointments,
  myMedRequests,
  recommend,
} from "../api/client";

interface RecommendRes {
  recommended: Center;
  alternatives: Center[];
  zone: string;
  score: number;
}

export default function Pilgrim() {
  const { t, i18n } = useTranslation();
  const ar = i18n.language === "ar";
  const [centers, setCenters] = useState<Center[]>([]);
  const [zones, setZones] = useState<{ id: string; name_ar: string; name_en: string }[]>([]);
  const [zone, setZone] = useState("mina");
  const [rec, setRec] = useState<RecommendRes | null>(null);
  const [appts, setAppts] = useState<
    { id: number; center_name_ar: string; center_name_en: string; slot_time: string; status: string }[]
  >([]);
  const [meds, setMeds] = useState<
    { id: number; medication_name: string; status: string; center_id: number }[]
  >([]);
  const [bookCenter, setBookCenter] = useState<number | "">("");
  const [slotTime, setSlotTime] = useState("");
  const [bookNotes, setBookNotes] = useState("");
  const [medCenter, setMedCenter] = useState<number | "">("");
  const [medName, setMedName] = useState("");
  const [msg, setMsg] = useState("");

  const load = async () => {
    const [c, z, a, m] = await Promise.all([getCenters(), getZones(), myAppointments(), myMedRequests()]);
    setCenters(c);
    setZones(z);
    setAppts(a);
    setMeds(m);
    if (!bookCenter && c.length) setBookCenter(c[0].id);
    if (!medCenter && c.length) setMedCenter(c[0].id);
  };

  const loadRecommend = async (z: string) => {
    const data = await recommend(z);
    setRec(data);
    setBookCenter(data.recommended.id);
  };

  useEffect(() => {
    load().then(() => loadRecommend("mina"));
  }, []);

  const onZoneChange = (z: string) => {
    setZone(z);
    loadRecommend(z);
  };

  const onBook = async (e: FormEvent) => {
    e.preventDefault();
    if (!bookCenter || !slotTime) return;
    setMsg("");
    try {
      await createAppointment(Number(bookCenter), new Date(slotTime).toISOString(), bookNotes || undefined);
      setMsg("OK");
      setSlotTime("");
      setBookNotes("");
      const a = await myAppointments();
      setAppts(a);
    } catch {
      setMsg(t("common.error"));
    }
  };

  const onMed = async (e: FormEvent) => {
    e.preventDefault();
    if (!medCenter || !medName) return;
    setMsg("");
    try {
      await createMedRequest(Number(medCenter), medName);
      setMedName("");
      const m = await myMedRequests();
      setMeds(m);
    } catch {
      setMsg(t("common.error"));
    }
  };

  const crowdBadge = (level: string) => {
    const labels: Record<string, string> = {
      low: t("pilgrim.low"),
      medium: t("pilgrim.medium"),
      high: t("pilgrim.high"),
    };
    const colors: Record<string, string> = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    };
    return <span className={`text-xs px-2 py-0.5 rounded ${colors[level]}`}>{labels[level]}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-nabd-primary">{t("pilgrim.title")}</h1>
      {msg && <p className="text-sm text-nabd-teal">{msg === "OK" ? "✓" : msg}</p>}

      <section>
        <h2 className="font-semibold mb-2">{t("pilgrim.map")}</h2>
        <CentersMap centers={centers} />
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-4">
          <label className="block text-sm text-slate-600 mb-2">{t("pilgrim.zone")}</label>
          <select
            value={zone}
            onChange={(e) => onZoneChange(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-4"
          >
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {ar ? z.name_ar : z.name_en}
              </option>
            ))}
          </select>
          {rec && (
            <>
              <h3 className="font-semibold text-nabd-teal mb-2">{t("pilgrim.recommend")}</h3>
              <div className="p-3 bg-nabd-teal/10 rounded-lg mb-3">
                <p className="font-bold">{ar ? rec.recommended.name_ar : rec.recommended.name_en}</p>
                <p className="text-sm">
                  {t("pilgrim.wait")}: {rec.recommended.avg_wait_min} {t("pilgrim.min")} {crowdBadge(rec.recommended.crowd_level)}
                </p>
              </div>
              <h4 className="text-sm font-medium mb-1">{t("pilgrim.alternatives")}</h4>
              <ul className="text-sm space-y-1">
                {rec.alternatives.map((c) => (
                  <li key={c.id}>
                    {ar ? c.name_ar : c.name_en} — {c.avg_wait_min} {t("pilgrim.min")}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <form onSubmit={onBook} className="bg-white rounded-xl border p-4 space-y-3">
          <h3 className="font-semibold">{t("pilgrim.book")}</h3>
          <label className="block text-sm">
            {t("pilgrim.center")}
            <select
              value={bookCenter}
              onChange={(e) => setBookCenter(Number(e.target.value))}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            >
              {centers.map((c) => (
                <option key={c.id} value={c.id}>
                  {ar ? c.name_ar : c.name_en}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            {t("pilgrim.datetime")}
            <input
              type="datetime-local"
              required
              value={slotTime}
              onChange={(e) => setSlotTime(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            {t("pilgrim.notes")}
            <input
              value={bookNotes}
              onChange={(e) => setBookNotes(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </label>
          <button type="submit" className="w-full py-2 bg-nabd-primary text-white rounded-lg">
            {t("pilgrim.submitBook")}
          </button>
        </form>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <form onSubmit={onMed} className="bg-white rounded-xl border p-4 space-y-3">
          <h3 className="font-semibold">{t("pilgrim.meds")}</h3>
          <label className="block text-sm">
            {t("pilgrim.center")}
            <select
              value={medCenter}
              onChange={(e) => setMedCenter(Number(e.target.value))}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            >
              {centers.map((c) => (
                <option key={c.id} value={c.id}>
                  {ar ? c.name_ar : c.name_en}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            {t("pilgrim.medName")}
            <input
              required
              value={medName}
              onChange={(e) => setMedName(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </label>
          <button type="submit" className="w-full py-2 bg-nabd-teal text-white rounded-lg">
            {t("pilgrim.submitMed")}
          </button>
        </form>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold mb-2">{t("pilgrim.myAppts")}</h3>
            <ul className="text-sm space-y-2">
              {appts.length === 0 && <li className="text-slate-500">—</li>}
              {appts.map((a) => (
                <li key={a.id} className="border-b pb-2">
                  <strong>{ar ? a.center_name_ar : a.center_name_en}</strong>
                  <br />
                  {new Date(a.slot_time).toLocaleString(ar ? "ar-SA" : "en-US")} — {a.status}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold mb-2">{t("pilgrim.myMeds")}</h3>
            <ul className="text-sm space-y-2">
              {meds.length === 0 && <li className="text-slate-500">—</li>}
              {meds.map((m) => (
                <li key={m.id}>
                  {m.medication_name} — {m.status}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
