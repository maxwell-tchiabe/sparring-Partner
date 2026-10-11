# Monitoring Architecture Explanation

> A comprehensive guide to the observability stack for sparring-partner backend

---

## Table of Contents
- [Overview](#overview)
- [Architecture Diagram](#architecture-diagram)
- [Components](#components)
- [Data Flow](#data-flow)
- [Metrics (Prometheus + Grafana)](#metrics)
- [Logs (Promtail + Loki)](#logs)
- [Traces (OpenTelemetry + Tempo)](#traces)
- [Alerting (Alertmanager)](#alerting)
- [Configuration Files](#configuration-files)
- [Ports Reference](#ports-reference)
- [Common Queries](#common-queries)

---

## Overview

The monitoring stack implements the **three pillars of observability**: metrics, logs, and traces. Each pillar is handled by dedicated tools that work together to provide full visibility into the application.

### The Three Pillars

```
┌─────────────────────────────────────────────────────────────────┐
│                      OBSERVABILITY                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 METRICS          📝 LOGS              🔍 TRACES             │
│  (What happened?)    (What was said?)     (What happened?)      │
│                                                                 │
│  Prometheus          Promtail + Loki      OpenTelemetry + Tempo │
│  + Grafana                                                          │
│                                                                 │
│  • Request counts    • Container logs     • Request flows       │
│  • Latency           • Error messages     • Service calls       │
│  • Error rates       • Application logs   • Performance spans   │
│  • System health     • Access logs        • Distributed tracing │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Architecture Diagram

### High-Level Architecture

```
                          ┌──────────────────────────────────────────────────┐
                          │                EXTERNAL USERS                    │
                          └──────────────────────────────────────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DOCKER NETWORK                                 │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      APPLICATION NETWORK                            │   │
│  │                                                                     │   │
│  │    ┌──────────────────────────────────────────────────────────┐    │   │
│  │    │                     TRAEFIK                               │    │   │
│  │    │  • Reverse Proxy (Port 80/443)                           │    │   │
│  │    │  • TLS Termination (Let's Encrypt)                      │    │   │
│  │    │  • Rate Limiting                                         │    │   │
│  │    │  • CORS Headers                                          │    │   │
│  │    │  • Metrics: :8080/metrics                                │    │   │
│  │    └──────────────────────────────────────────────────────────┘    │   │
│  │                              │                                     │   │
│  │                              ▼                                     │   │
│  │    ┌──────────────────────────────────────────────────────────┐    │   │
│  │    │                     FASTAPI API                            │    │   │
│  │    │  • AI Companion Backend (Port 8080)                       │    │   │
│  │    │  • Metrics: :8080/metrics                                  │    │   │
│  │    │  • Traces: OTLP → Tempo                                    │    │   │
│  │    └──────────────────────────────────────────────────────────┘    │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      MONITORING NETWORK                             │   │
│  │                                                                     │   │
│  │         ┌─────────┐        ┌─────────┐        ┌─────────┐          │   │
│  │         │PROMETHEUS│        │  LOKI   │        │  TEMPO  │          │   │
│  │         │  :9090   │        │  :3100  │        │  :3200  │          │   │
│  │         └─────────┘        └─────────┘        └─────────┘          │   │
│  │              │                  ▲                  ▲               │   │
│  │              │                  │                  │               │   │
│  │              ▼                  │                  │               │   │
│  │         ┌─────────┐        ┌─────────┐                           │   │
│  │         │ALERTMGR │        │ PROMTAIL│                           │   │
│  │         │  :9093  │        │  :9080  │                           │   │
│  │         └─────────┘        └─────────┘                           │   │
│  │              │                                                     │   │
│  │              ▼                                                     │   │
│  │         ┌─────────┐                                               │   │
│  │         │ GRAFANA │                                               │   │
│  │         │  :3000  │                                               │   │
│  │         └─────────┘                                               │   │
│  │              ▲                                                     │   │
│  │              │                                                     │   │
│  │    ┌─────────┴─────────────────────────────────────────┐          │   │
│  │    │                                                   │          │   │
│  │    │    Queries: Prometheus, Loki, Tempo               │          │   │
│  │    │    Dashboards: Auto-provisioned                   │          │   │
│  │    │                                                   │          │   │
│  │    └───────────────────────────────────────────────────┘          │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. Prometheus (Metrics Storage & Querying)

**Port**: 9090 | **Version**: v2.50.1 | **Retention**: 15 days

Prometheus is a time-series database that scrapes metrics from configured targets.

#### What It Monitors:

```
┌────────────────────────────────────────────────────────────────┐
│                     PROMETHEUS SCRAPING                         │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Job: prometheus                                                │
│  ├── Target: localhost:9090                                     │
│  └── Metrics: Prometheus self-monitoring                        │
│                                                                 │
│  Job: traefik                                                   │
│  ├── Target: traefik:8080                                       │
│  └── Metrics:                                                   │
│      ├── traefik_service_requests_total                         │
│      ├── traefik_service_request_duration_seconds               │
│      ├── traefik_service_open_connections                       │
│      └── traefik_entrypoint_requests_total                      │
│                                                                 │
│  Job: fastapi                                                   │
│  ├── Target: api:8080/metrics                                   │
│  └── Metrics:                                                   │
│      ├── http_requests_total (counter)                          │
│      ├── http_request_duration_seconds (histogram)              │
│      ├── http_requests_in_progress (gauge)                      │
│      └── process_* (system metrics)                             │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

#### Configuration Schema (`prometheus.yml`):

```yaml
global:
  scrape_interval: 15s    # How often to scrape targets
  evaluation_interval: 15s  # How often to evaluate alert rules

rule_files:
  - /etc/prometheus/alerts.yml  # Alert rule definitions

alerting:
  alertmanagers:
    - static_configs:
        - targets: ["alertmanager:9093"]  # Where to send alerts

scrape_configs:
  # Scrape Prometheus itself
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  # Scrape Traefik metrics
  - job_name: "traefik"
    static_configs:
      - targets: ["traefik:8080"]

  # Scrape FastAPI metrics
  - job_name: "fastapi"
    metrics_path: /metrics
    static_configs:
      - targets: ["api:8080"]
```

---

### 2. Grafana (Visualization & Dashboards)

**Port**: 3000 | **Version**: 10.3.3 | **URL**: monitoring.evochat.maxwelltbtech.com

Grafana provides visualization dashboards for all three pillars.

#### Dashboard Structure:

```
┌────────────────────────────────────────────────────────────────┐
│                     GRAFANA DASHBOARDS                          │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 FastAPI Dashboard (fastapi.json)                           │
│  ├── Total Requests                                             │
│  ├── Requests Count (rate)                                      │
│  ├── Requests Average Duration                                  │
│  ├── Percent of 2xx Requests                                    │
│  └── Percent of 5xx Requests                                    │
│                                                                 │
│  🔍 Tempo Dashboard (tempo.json)                                │
│  ├── FastAPI Status (UP/DOWN)                                   │
│  ├── Request Latency (p50/p95/p99)                              │
│  ├── Error Rate (5xx)                                           │
│  ├── Request Rate                                               │
│  ├── Active Requests                                            │
│  ├── Service Dependency Map                                     │
│  ├── Request Duration by Endpoint                               │
│  ├── Recent Traces (search & view)                              │
│  └── Trace Metrics                                              │
│                                                                 │
│  🐳 Docker Dashboard (docker.json)                             │
│  ├── Container CPU Usage                                        │
│  ├── Container Memory Usage                                     │
│  ├── Network I/O                                                │
│  └── Container Status                                           │
│                                                                 │
│  🔄 Traefik Dashboard (traefik.json)                           │
│  ├── Request Rate by Service                                    │
│  ├── Response Codes Distribution                                │
│  ├── Request Duration by Service                                │
│  └── Entry Point Metrics                                        │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

#### Datasources Configuration (`datasources.yml`):

```yaml
datasources:
  # Prometheus - Default metrics source
  - name: Prometheus
    type: prometheus
    uid: prometheus
    url: http://prometheus:9090
    isDefault: true
  
  # Loki - Logs source
  - name: Loki
    type: loki
    uid: loki
    url: http://loki:3100
  
  # Tempo - Traces source with correlation
  - name: Tempo
    type: tempo
    uid: tempo
    url: http://tempo:3200
    jsonData:
      # Correlation: Click trace → see logs
      tracesToLogsV2:
        datasourceUid: 'loki'
        spanStartTimeShift: '-1h'
        spanEndTimeShift: '1h'
        query: '{container="api"} | json | trace_id="${__span.traceId}"'
```

---

### 3. Promtail (Log Collector)

**Port**: 9080 | **Version**: 2.9.4

Promtail is a log agent that collects logs from Docker containers and ships them to Loki.

#### How It Works:

```
┌────────────────────────────────────────────────────────────────┐
│                    PROMTAIL LOG COLLECTION                      │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Docker Socket: /var/run/docker.sock                            │
│  │                                                              │
│  ▼                                                              │
│  ┌─────────────────────────────────────────────┐               │
│  │  Scrape Config: docker_sd_configs           │               │
│  │  ├── Discovers all running containers       │               │
│  │  ├── Refresh interval: 5s                   │               │
│  │  └── Relabeling:                            │               │
│  │      • container_name → container           │               │
│  │      • compose_service → compose_service    │               │
│  └─────────────────────────────────────────────┘               │
│                    │                                             │
│                    ▼                                             │
│  ┌─────────────────────────────────────────────┐               │
│  │  Targets:                                   │               │
│  │  ├── /var/lib/docker/containers/*/*-json.log│               │
│  │  └── /var/log/**/*.log                      │               │
│  └─────────────────────────────────────────────┘               │
│                    │                                             │
│                    ▼                                             │
│  Ship to: http://loki:3100/loki/api/v1/push                     │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

#### Configuration (`promtail-config.yml`):

```yaml
server:
  http_listen_port: 9080

positions:
  filename: /tmp/positions.yaml  # Track read positions

clients:
  - url: http://loki:3100/loki/api/v1/push  # Loki endpoint

scrape_configs:
  - job_name: docker
    docker_sd_configs:
      - host: unix:///var/run/docker.sock
        refresh_interval: 5s
    
    relabel_configs:
      # Extract container name (remove leading /)
      - source_labels: ['__meta_docker_container_name']
        regex: '/(.*)'
        target_label: 'container'
      
      # Extract compose service name
      - source_labels: ['__meta_docker_container_label_com_docker_compose_service']
        target_label: 'compose_service'
```

---

### 4. Loki (Log Storage & Querying)

**Port**: 3100 | **Version**: 2.9.4 | **Retention**: 7 days (168 hours)

Loki is a log aggregation system that stores logs indexed by labels.

#### Storage Architecture:

```
┌────────────────────────────────────────────────────────────────┐
│                      LOKI STORAGE                               │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Path Prefix: /tmp/loki                                         │
│  │                                                              │
│  ├── tsdb-index/          (Active Index Directory)              │
│  │   └── index_2026-10-04  (Daily index files)                  │
│  │                                                              │
│  ├── tsdb-cache/          (Index Cache)                         │
│  │   └── 24h TTL                                               │
│  │                                                              │
│  ├── chunks/              (Log Chunks)                          │
│  │   ├── chunk-abc123                                         │
│  │   ├── chunk-def456                                         │
│  │   └── ...                                                  │
│  │                                                              │
│  ├── compactor/           (Compaction)                          │
│  │   └── Optimizes storage                                     │
│  │                                                              │
│  └── retention: 168h (7 days)                                   │
│                                                                 │
│  Schema: v13 (tsdb)                                             │
│  Replication Factor: 1                                          │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

#### Log Labels Structure:

```
┌────────────────────────────────────────────────────────────────┐
│                   LOG LABELS EXAMPLE                            │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  {                                                               │
│    container: "api",           ← Docker container name          │
│    compose_service: "api",     ← Docker Compose service name    │
│    job: "docker",              ← Promtail scrape job            │
│    instance: "api:8080",       ← Container instance             │
│    stream: "stdout"            ← Output stream                  │
│  }                                                               │
│                                                                 │
│  Query Example:                                                 │
│  {container="api"} | json | level="error"                       │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

### 5. Tempo (Distributed Tracing)

**Port**: 3200 | **Version**: 2.3.1 | **Retention**: 72 hours (3 days)

Tempo stores distributed traces received via OpenTelemetry protocol.

#### How Tracing Works:

```
┌────────────────────────────────────────────────────────────────┐
│                 OPEN TELEMETRY TRACING FLOW                     │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FastAPI Application                                            │
│  │                                                              │
│  │  import trace                                               │
│  │  tracer = trace.get_tracer(__name__)                        │
│  │                                                              │
│  │  with tracer.start_as_current_span("chat-request"):         │
│  │      # Business logic                                       │
│  │      # Spans automatically created for:                     │
│  │      • HTTP requests                                        │
│  │      • Database queries                                     │
│  │      • External API calls                                   │
│  │                                                              │
│  ▼                                                              │
│  ┌─────────────────────────────────────────────┐               │
│  │  OTLP Exporter                              │               │
│  │  • Endpoint: http://tempo:4317              │               │
│  │  • Protocol: gRPC                          │               │
│  │  • Sampling: 10% (TraceIdRatioBased)        │               │
│  │  • Batch Size: default (512 spans)          │               │
│  └─────────────────────────────────────────────┘               │
│                    │                                             │
│                    ▼                                             │
│  ┌─────────────────────────────────────────────┐               │
│  │  Tempo Distributor                          │               │
│  │  • Receives OTLP traces                     │               │
│  │  • Routes to Ingester                       │               │
│  └─────────────────────────────────────────────┘               │
│                    │                                             │
│                    ▼                                             │
│  ┌─────────────────────────────────────────────┐               │
│  │  Tempo Ingester                             │               │
│  │  • trace_idle_period: 10s                   │               │
│  │  • max_block_bytes: 1MB                     │               │
│  │  • max_block_duration: 5m                   │               │
│  └─────────────────────────────────────────────┘               │
│                    │                                             │
│                    ▼                                             │
│  ┌─────────────────────────────────────────────┐               │
│  │  Storage: /tmp/tempo/blocks                 │               │
│  │  • WAL: /tmp/tempo/wal                      │               │
│  │  • Retention: 72 hours                      │               │
│  └─────────────────────────────────────────────┘               │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

#### Trace Structure Example:

```
┌────────────────────────────────────────────────────────────────┐
│                     TRACE EXAMPLE                               │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Trace ID: abc123def456                                         │
│  │                                                              │
│  └── Span: POST /api/chat (HTTP request)                       │
│       ├── Duration: 2.3s                                        │
│       ├── Attributes:                                           │
│       │   ├── http.method: POST                                 │
│       │   ├── http.status_code: 200                             │
│       │   └── http.route: /api/chat                             │
│       │                                                         │
│       ├── Child Span: auth.verify_token                        │
│       │   └── Duration: 15ms                                    │
│       │                                                         │
│       ├── Child Span: langchain.process                        │
│       │   └── Duration: 1.8s                                    │
│       │   ├── Child Span: groq.api_call                        │
│       │   │   └── Duration: 1.5s                                │
│       │   └── Child Span: qdrant.search                        │
│       │       └── Duration: 200ms                               │
│       │                                                         │
│       └── Child Span: database.insert                          │
│           └── Duration: 50ms                                    │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

### 6. Alertmanager (Alert Routing)

**Port**: 9093 | **Version**: v0.27.0

Alertmanager handles alerts sent by Prometheus, deduplicates, groups, and routes them to receivers.

#### Alert Flow:

```
┌────────────────────────────────────────────────────────────────┐
│                   ALERT ROUTING FLOW                            │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Prometheus detects alert condition                             │
│  │                                                              │
│  │  Example: up{job="fastapi"} == 0                            │
│  │                                                              │
│  ▼                                                              │
│  Alert Fired: API_Down (severity: critical)                    │
│  │                                                              │
│  ▼                                                              │
│  ┌─────────────────────────────────────────────┐               │
│  │  Alertmanager Route                         │               │
│  │  • Receiver: email-alerts                   │               │
│  │  • Group By: [alertname]                    │               │
│  │  • Group Wait: 30s (wait for more alerts)   │               │
│  │  • Group Interval: 5m (check for new alerts)│               │
│  │  • Repeat Interval: 4h (resend if ongoing)  │               │
│  └─────────────────────────────────────────────┘               │
│                    │                                             │
│                    ▼                                             │
│  ┌─────────────────────────────────────────────┐               │
│  │  Email Receiver                             │               │
│  │  • SMTP: smtp.gmail.com:587                 │               │
│  │  • From: ALERTMANAGER_EMAIL_FROM            │               │
│  │  • To: ALERTMANAGER_EMAIL_TO                │               │
│  │  • Send Resolved: true                      │               │
│  └─────────────────────────────────────────────┘               │
│                    │                                             │
│                    ▼                                             │
│  📧 Email Sent to Operations Team                              │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

#### Active Alerts:

```
┌────────────────────────────────────────────────────────────────┐
│                    ALERT RULES                                  │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FastAPI Alerts:                                                │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  API_Down                                               │    │
│  │  ├── Expression: up{job="fastapi"} == 0                 │    │
│  │  ├── Duration: 1m                                       │    │
│  │  ├── Severity: CRITICAL                                 │    │
│  │  └── Impact: API completely unavailable                 │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  HighErrorRate                                         │    │
│  │  ├── Expression: rate(http_requests_total{status=~"5.."}[5m]) > 0.05 │
│  │  ├── Duration: 2m                                       │    │
│  │  ├── Severity: CRITICAL                                 │    │
│  │  └── Impact: >5% of requests returning 5xx errors       │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  HighLatency                                           │    │
│  │  ├── Expression: p99 latency > 2s                       │    │
│  │  ├── Duration: 5m                                       │    │
│  │  ├── Severity: WARNING                                  │    │
│  │  └── Impact: Slow API responses                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Traefik Alerts:                                                │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  TraefikDown                                           │    │
│  │  ├── Expression: up{job="traefik"} == 0                 │    │
│  │  ├── Duration: 1m                                       │    │
│  │  ├── Severity: CRITICAL                                 │    │
│  │  └── Impact: No traffic reaching backend                │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### End-to-End Request Flow

```
┌────────────────────────────────────────────────────────────────┐
│              REQUEST LIFECYCLE & OBSERVABILITY                  │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. USER REQUEST                                                │
│     └─► POST https://api.example.com/api/chat                   │
│                                                                 │
│  2. TRAEFIK (Reverse Proxy)                                     │
│     ├─► Metrics Collected:                                      │
│     │   • Request count                                         │
│     │   • Duration                                              │
│     │   • Response code                                         │
│     │   • Source IP                                             │
│     │                                                           │
│     └─► Forwarded to FastAPI                                    │
│                                                                 │
│  3. FASTAPI APPLICATION                                         │
│     ├─► Prometheus Metrics:                                     │
│     │   • http_requests_total{status="200"}                    │
│     │   • http_request_duration_seconds                         │
│     │                                                           │
│     ├─► OpenTelemetry Traces:                                   │
│     │   • Root span created (POST /api/chat)                   │
│     │   • Child spans for:                                      │
│     │     - Auth verification                                   │
│     │     - LLM processing                                      │
│     │     - Vector DB search                                    │
│     │     - Database operations                                 │
│     │                                                           │
│     └─► Application Logs:                                       │
│         • "Processing chat request..."                          │
│         • "User authenticated successfully"                     │
│         • "LLM response generated in 2.1s"                      │
│                                                                 │
│  4. DATA EXPORT                                                 │
│     ├─► Metrics → Prometheus (scraped every 15s)               │
│     ├─► Traces → Tempo (OTLP gRPC)                             │
│     └─► Logs → Promtail → Loki                                 │
│                                                                 │
│  5. VISUALIZATION                                               │
│     └─► Grafana queries all three data sources                 │
│         • Metrics: Rate of 5xx errors                          │
│         • Traces: Slow request investigation                   │
│         • Logs: Error message context                          │
│                                                                 │
│  6. ALERTING                                                    │
│     └─► If error rate > 5% for 2 minutes:                      │
│         • Prometheus fires HighErrorRate alert                 │
│         • Alertmanager receives alert                          │
│         • Email sent to operations team                        │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Metrics

### Available Metrics from FastAPI

```
┌────────────────────────────────────────────────────────────────┐
│                 FASTAPI METRICS SCHEMA                          │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  http_requests_total                                             │
│  ├── Type: Counter                                              │
│  ├── Labels:                                                    │
│  │   ├── method: GET, POST, PUT, DELETE                         │
│  │   ├── status: 200, 201, 400, 401, 404, 500                  │
│  │   ├── handler: endpoint path                                 │
│  │   └── status_code: HTTP status code                         │
│  └── Usage: Request rate, error rate calculation               │
│                                                                 │
│  http_request_duration_seconds                                   │
│  ├── Type: Histogram                                            │
│  ├── Buckets: 0.1, 0.3, 1.2, 5.0 (from Traefik)              │
│  ├── Labels:                                                    │
│  │   ├── method: HTTP method                                   │
│  │   ├── handler: endpoint path                                 │
│  │   └── status: HTTP status code                              │
│  └── Usage: Latency percentiles (p50, p95, p99)                │
│                                                                 │
│  http_requests_in_progress                                       │
│  ├── Type: Gauge                                               │
│  └── Usage: Current concurrent requests                        │
│                                                                 │
│  process_resident_memory_bytes                                   │
│  ├── Type: Gauge                                               │
│  └── Usage: Memory usage monitoring                            │
│                                                                 │
│  process_cpu_seconds_total                                       │
│  ├── Type: Counter                                             │
│  └── Usage: CPU usage calculation                              │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Common Prometheus Queries

```promql
# Request Rate (requests per second)
rate(http_requests_total[5m])

# Error Rate (percentage of 5xx errors)
rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100

# 99th Percentile Latency
histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))

# Requests by Status Code
sum by (status) (rate(http_requests_total[5m]))

# Up/Down Status
up{job="fastapi"}
```

---

## Logs

### Log Structure

```
┌────────────────────────────────────────────────────────────────┐
│                    LOG ENTRY EXAMPLE                            │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Timestamp: 2026-10-04T23:04:13Z                                │
│  Level: INFO                                                    │
│  Labels: {                                                      │
│    container: "api",                                            │
│    compose_service: "api"                                       │
│  }                                                              │
│  Message: {"event": "request_started", "path": "/api/chat"}   │
│                                                                 │
│  ──────────────────────────────────────────────────────────── │
│                                                                 │
│  Timestamp: 2026-10-04T23:04:15Z                                │
│  Level: WARNING                                                 │
│  Labels: {                                                      │
│    container: "api",                                            │
│    compose_service: "api"                                       │
│  }                                                              │
│  Message: Using severities from other vendors...               │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Common Loki Queries

```logql
# All logs from API container
{container="api"}

# Only error logs
{container="api"} | json | level="error"

# Logs with specific trace ID (correlation)
{container="api"} | json | trace_id="abc123def456"

# Search for specific text
{container="api"} |= "Timeout"

# Filter by compose service
{compose_service="traefik"} | json | level="error"
```

---

## Traces

### Trace-Logs Correlation

```
┌────────────────────────────────────────────────────────────────┐
│              TRACE ↔ LOGS CORRELATION                           │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  In Grafana Tempo UI:                                           │
│                                                                 │
│  1. Find trace: abc123def456                                    │
│  2. Click "Related Logs" button                                 │
│  3. Tempo queries Loki:                                        │
│     {container="api"} | json | trace_id="abc123def456"         │
│  4. Shows all logs from this request                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  TRACE VIEW                                             │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │  POST /api/chat (2.3s)                                  │   │
│  │  ├── auth.verify_token (15ms)                           │   │
│  │  ├── langchain.process (1.8s)                           │   │
│  │  └── database.insert (50ms)                             │   │
│  │                                                         │   │
│  │  [View Related Logs]  ← Click this button               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ↓ Opens:                                                      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  LOGS VIEW                                              │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │  23:04:13 INFO  Processing chat request                 │   │
│  │  23:04:13 INFO  User authenticated                      │   │
│  │  23:04:14 INFO  Calling LLM                             │   │
│  │  23:04:15 INFO  LLM response received                   │   │
│  │  23:04:15 INFO  Inserting to database                   │   │
│  │  23:04:15 INFO  Request completed                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Configuration Files

### File Structure

```
backend/monitoring/
├── prometheus/
│   ├── prometheus.yml          # Main Prometheus config
│   └── alerts.yml              # Alert rules
├── grafana/
│   └── provisioning/
│       ├── datasources/
│       │   └── datasources.yml # Auto-configure data sources
│       └── dashboards/
│           ├── dashboards.yml  # Dashboard provisioning config
│           ├── fastapi.json    # FastAPI dashboard
│           ├── docker.json     # Docker dashboard
│           └── traefik.json    # Traefik dashboard
├── loki/
│   └── loki-config.yml         # Loki storage config
├── promtail/
│   └── promtail-config.yml     # Log collection config
├── tempo/
│   └── tempo.yml               # Distributed tracing config
└── alertmanager/
    └── alertmanager.yml        # Alert routing config
```

### Environment Variables Required

```bash
# Grafana
GRAFANA_ADMIN_PASSWORD=admin

# Alertmanager (SMTP for email alerts)
ALERTMANAGER_SMTP_USER=your-email@gmail.com
ALERTMANAGER_SMTP_PASSWORD=your-app-password
ALERTMANAGER_EMAIL_FROM=alerts@yourdomain.com
ALERTMANAGER_EMAIL_TO=ops-team@yourdomain.com

# Traefik (Let's Encrypt)
ACME_EMAIL=your-email@domain.com
CF_DNS_API_TOKEN=your-cloudflare-token

# Application
DOMAIN_NAME=api.yourdomain.com
IMAGE_TAG=staging
```

---

## Ports Reference

```
┌────────────────────────────────────────────────────────────────┐
│                     PORTS REFERENCE                             │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  EXTERNAL (Exposed to Internet)                                 │
│  ├── 80    → Traefik (HTTP)                                    │
│  ├── 443   → Traefik (HTTPS)                                   │
│  └── 3000  → Grafana (via Traefik: monitoring.example.com)     │
│                                                                 │
│  INTERNAL (Docker Network Only)                                 │
│  ├── 8080  → FastAPI Application                               │
│  ├── 8080  → Traefik Metrics (traefik:8080/metrics)            │
│  ├── 9090  → Prometheus                                        │
│  ├── 9093  → Alertmanager                                      │
│  ├── 3100  → Loki                                              │
│  ├── 3200  → Tempo                                             │
│  ├── 4317  → Tempo OTLP gRPC                                   │
│  └── 9080  → Promtail                                          │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Common Queries

### Troubleshooting Scenarios

#### 1. API is Down

```
┌────────────────────────────────────────────────────────────────┐
│  Problem: API Down                                             │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Steps:                                                         │
│  1. Check Prometheus: up{job="fastapi"} == 0                  │
│  2. Check Grafana FastAPI dashboard: Request Rate = 0         │
│  3. Check Loki: {container="api"} | json | level="error"     │
│  4. Check Tempo: Look for failed traces                       │
│  5. Check Alertmanager: Should have API_Down alert            │
│                                                                 │
│  Query in Loki:                                                │
│  {container="api"} |= "Traceback" | json                      │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

#### 2. High Latency

```
┌────────────────────────────────────────────────────────────────┐
│  Problem: Slow API Responses                                   │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Steps:                                                         │
│  1. Check Grafana: p99 latency > 2s?                          │
│  2. Prometheus query:                                          │
│     histogram_quantile(0.99, sum(rate(                         │
│       http_request_duration_seconds_bucket[5m])) by (le))      │
│  3. Find slow traces in Tempo: Sort by duration               │
│  4. Drill into slow span to find bottleneck                   │
│  5. Check logs for that trace:                                 │
│     {container="api"} | json | trace_id="<trace-id>"          │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

#### 3. High Error Rate

```
┌────────────────────────────────────────────────────────────────┐
│  Problem: 5xx Errors                                          │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Steps:                                                         │
│  1. Grafana: Check "Percent of 5xx Requests" panel            │
│  2. Prometheus:                                                │
│     rate(http_requests_total{status=~"5.."}[5m])              │
│  3. Loki: Filter error logs                                   │
│     {container="api"} | json | status_code=~"5.."             │
│  4. Tempo: Find traces with errors (status=error)             │
│  5. Correlate: Find common pattern in logs/traces             │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Summary

```
┌────────────────────────────────────────────────────────────────┐
│                    MONITORING STACK SUMMARY                     │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  COMPONENT          PURPOSE              RETENTION              │
│  ─────────────────────────────────────────────────────────────│
│  Prometheus         Metrics storage      15 days                │
│  Grafana            Visualization        N/A                    │
│  Promtail           Log collection       N/A (ships to Loki)   │
│  Loki               Log storage          7 days                 │
│  Tempo              Trace storage        3 days                 │
│  Alertmanager       Alert routing        N/A                    │
│                                                                 │
│  KEY FEATURES:                                                 │
│  ✅ Auto-provisioned dashboards                               │
│  ✅ Trace ↔ Log correlation in Grafana                        │
│  ✅ Email alerting with grouping & deduplication               │
│  ✅ 10% trace sampling (configurable)                         │
│  ✅ 15s metric scrape interval                                │
│  ✅ Comprehensive FastAPI + Traefik metrics                   │
│                                                                 │
│  ACCESS:                                                       │
│  📊 Grafana: https://monitoring.evochat.maxwelltbtech.com     │
│  📧 Alerts: Email to ALERTMANAGER_EMAIL_TO                    │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Next Steps

1. **Access Grafana** at `https://monitoring.evochat.maxwelltbtech.com`
2. **Explore Dashboards**: FastAPI, Docker, Traefik
3. **Test Alerts**: Stop the API container and verify email alerts
4. **Trace Investigation**: Click any request in Tempo → View related logs
5. **Custom Queries**: Use PromQL (metrics) and LogQL (logs) for deeper investigation

---

*Generated: 2026-10-04 | Version: 1.0*
