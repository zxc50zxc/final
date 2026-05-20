import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import {
  centerAppointments,
  centerMedRequests,
  getCenters,
  updateCenter,
  updateMedRequest,
  Center,
} from "../api/client";

export default function Staff() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const ar = i18n.language === "ar";
  const [center, setCenter] = useState<Center | null>(null);
  const [queue, setQueue] = useState(0);
  const [waitMin, setWaitMin] = useState(0);
  const [appts, setAppts] = useState<
    { id: number; slot_time: string; status: string; notes?: string; user_name?: string }[]
  >([]);
  const [meds, setMeds] = useState<
    { id: number; medication_name: string; status: string; user_name?: string }[]
  >([]);

  const centerId = user?.center_id;

  useEffect(() => {
    if (!centerId) return;
    (async () => {
      const centers = await getCenters();
      const c = centers.find((x) => x.id === centerId);
      if (c) {
        setCenter(c);
        setQueue(c.current_queue);
        setWaitMin(c.avg_wait_min);
      }
      const [a, m] = await Promise.all([centerAppointments(centerId), centerMedRequests(centerId)]);
      setAppts(a);
      setMeds(m);
    })();
  }, [centerId]);

  const onUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!centerId) return;
    const updated = await updateCenter(centerId, { current_queue: queue, avg_wait_min: waitMin });
    setCenter(updated);
  };

  const setMedStatus = async (id: number, status: string) => {
    await updateMedRequest(id, status);
    if (centerId) setMeds(await centerMedRequests(centerId));
  };

  if (!centerId) {
    return <p className="p-8 text-center text-slate-600">{t("common.error")}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-nabd-primary">{t("staff.title")}</h1>
      {center && (
        <p className="text-lg text-nabd-teal font-semibold">{ar ? center.name_ar : center.name_en}</p>
      )}

      <form onSubmit={onUpdate} className="bg-white rounded-xl border p-4 grid sm:grid-cols-3 gap-4 items-end">
        <label className="block text-sm">
          {t("staff.queue")}
          <input
            type="number"
            min={0}
            value={queue}
            onChange={(e) => setQueue(Number(e.target.value))}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          {t("staff.waitTime")}
          <input
            type="number"
            min={0}
            value={waitMin}
            onChange={(e) => setWaitMin(Number(e.target.value))}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </label>
        <button type="submit" className="py-2 px-4 bg-nabd-teal text-white rounded-lg font-semibold">
          {t("staff.update")}
        </button>
      </form>

      <section className="bg-white rounded-xl border p-4">
        <h2 className="font-semibold mb-3">{t("staff.appts")}</h2>
        <ul className="text-sm space-y-2">
          {appts.length === 0 && <li className="text-slate-500">—</li>}
          {appts.map((a) => (
            <li key={a.id} className="border-b pb-2">
              {new Date(a.slot_time).toLocaleString(ar ? "ar-SA" : "en-US")} — {a.status}
              {a.notes && <span className="text-slate-500"> ({a.notes})</span>}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white rounded-xl border p-4">
        <h2 className="font-semibold mb-3">{t("staff.medRequests")}</h2>
        <ul className="text-sm space-y-3">
          {meds.length === 0 && <li className="text-slate-500">—</li>}
          {meds.map((m) => (
            <li key={m.id} className="flex flex-wrap gap-2 items-center justify-between border-b pb-2">
              <span>
                <strong>{m.medication_name}</strong> — {m.status}
              </span>
              <select
                value={m.status}
                onChange={(e) => setMedStatus(m.id, e.target.value)}
                className="border rounded px-2 py-1 text-xs"
              >
                <option value="submitted">submitted</option>
                <option value="under_review">under_review</option>
                <option value="ready">ready</option>
                <option value="dispensed">dispensed</option>
                <option value="rejected">rejected</option>
              </select>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
