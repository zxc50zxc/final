import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { useTranslation } from "react-i18next";
import type { Center } from "../api/client";

const crowdColor = { low: "#22c55e", medium: "#eab308", high: "#ef4444" };

export default function CentersMap({ centers }: { centers: Center[] }) {
  const { i18n, t } = useTranslation();
  const ar = i18n.language === "ar";
  const center: [number, number] = centers.length ? [centers[0].lat, centers[0].lng] : [21.4, 39.9];

  return (
    <div className="h-72 md:h-96 w-full rounded-xl overflow-hidden border border-teal-200 shadow-sm">
      <MapContainer center={center} zoom={11} scrollWheelZoom className="h-full w-full">
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {centers.map((c) => (
          <CircleMarker
            key={c.id}
            center={[c.lat, c.lng]}
            radius={12}
            pathOptions={{ color: crowdColor[c.crowd_level], fillColor: crowdColor[c.crowd_level], fillOpacity: 0.7 }}
          >
            <Popup>
              <strong>{ar ? c.name_ar : c.name_en}</strong>
              <br />
              {t("pilgrim.wait")}: {c.avg_wait_min} {t("pilgrim.min")}
              <br />
              {t("staff.queue")}: {c.current_queue}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
