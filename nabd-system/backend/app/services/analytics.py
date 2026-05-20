import plotly.graph_objects as go
from sqlalchemy.orm import Session

from app.models.center import HealthCenter


def build_heatmap_figure(db: Session) -> dict:
    centers = db.query(HealthCenter).all()
    names = [c.name_en for c in centers]
    waits = [c.avg_wait_min for c in centers]
    queues = [c.current_queue for c in centers]

    fig = go.Figure(
        data=go.Heatmap(
            z=[waits, queues],
            x=names,
            y=["Avg Wait (min)", "Queue Size"],
            colorscale="RdYlGn_r",
        )
    )
    fig.update_layout(title="Center Load Heatmap", height=400)
    return fig.to_json()


def build_peak_hours_figure() -> dict:
    hours = list(range(6, 24))
    visitors = [12, 18, 35, 52, 68, 75, 80, 72, 65, 58, 45, 38, 42, 55, 70, 78, 60, 40]
    fig = go.Figure(data=go.Bar(x=hours, y=visitors, marker_color="#00A896"))
    fig.update_layout(
        title="Peak Visitor Hours (Simulated)",
        xaxis_title="Hour",
        yaxis_title="Visitors",
        height=400,
    )
    return fig.to_json()


def build_wait_comparison(db: Session) -> dict:
    centers = db.query(HealthCenter).all()
    fig = go.Figure(
        data=go.Bar(
            x=[c.name_en for c in centers],
            y=[c.avg_wait_min for c in centers],
            marker_color=["#22c55e" if c.crowd_level == "low" else "#eab308" if c.crowd_level == "medium" else "#ef4444" for c in centers],
        )
    )
    fig.update_layout(title="Average Wait Time by Center", xaxis_tickangle=-45, height=400)
    return fig.to_json()


def get_kpis(db: Session) -> dict:
    centers = db.query(HealthCenter).all()
    total_queue = sum(c.current_queue for c in centers)
    crowded = sum(1 for c in centers if c.crowd_level == "high")
    avg_wait = round(sum(c.avg_wait_min for c in centers) / len(centers), 1) if centers else 0
    return {
        "total_centers": len(centers),
        "total_in_queue": total_queue,
        "crowded_centers": crowded,
        "avg_wait_minutes": avg_wait,
    }
