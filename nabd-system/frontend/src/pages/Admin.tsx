import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Plot from "react-plotly.js";
import { getChart, getKpis } from "../api/client";

interface Kpis {
  total_centers: number;
  total_in_queue: number;
  crowded_centers: number;
  avg_wait_minutes: number;
}

type PlotJson = { data: object[]; layout: object };

export default function Admin() {
  const { t } = useTranslation();
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [heatmap, setHeatmap] = useState<PlotJson | null>(null);
  const [peak, setPeak] = useState<PlotJson | null>(null);
  const [waitChart, setWaitChart] = useState<PlotJson | null>(null);

  useEffect(() => {
    (async () => {
      const [k, h, p, w] = await Promise.all([
        getKpis(),
        getChart("/analytics/heatmap"),
        getChart("/analytics/peak-hours"),
        getChart("/analytics/wait-comparison"),
      ]);
      setKpis(k);
      setHeatmap(h);
      setPeak(p);
      setWaitChart(w);
    })();
  }, []);

  const chart = (fig: PlotJson | null) =>
    fig ? (
      <Plot data={fig.data} layout={{ ...fig.layout, autosize: true }} useResizeHandler style={{ width: "100%" }} />
    ) : (
      <p className="text-slate-500 p-8">{t("common.loading")}</p>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-nabd-primary">{t("admin.title")}</h1>

      {kpis && (
        <section>
          <h2 className="font-semibold mb-4">{t("admin.kpis")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard label={t("admin.centers")} value={kpis.total_centers} />
            <KpiCard label={t("admin.totalQueue")} value={kpis.total_in_queue} />
            <KpiCard label={t("admin.crowded")} value={kpis.crowded_centers} />
            <KpiCard label={t("admin.avgWait")} value={`${kpis.avg_wait_minutes} ${t("pilgrim.min")}`} />
          </div>
        </section>
      )}

      <section className="bg-white rounded-xl border p-4">
        <h2 className="font-semibold mb-2">{t("admin.heatmap")}</h2>
        {chart(heatmap)}
      </section>

      <section className="bg-white rounded-xl border p-4">
        <h2 className="font-semibold mb-2">{t("admin.peak")}</h2>
        {chart(peak)}
      </section>

      <section className="bg-white rounded-xl border p-4">
        <h2 className="font-semibold mb-2">{t("admin.waitChart")}</h2>
        {chart(waitChart)}
      </section>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gradient-to-br from-nabd-primary/10 to-nabd-teal/10 rounded-xl p-4 text-center">
      <p className="text-2xl font-bold text-nabd-primary">{value}</p>
      <p className="text-sm text-slate-600 mt-1">{label}</p>
    </div>
  );
}
