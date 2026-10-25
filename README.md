# GST Practice Suite

A lightweight, browser-based GST compliance application for CA practice work. It is designed for local-first use, practical reconciliation, return drafting, and review workflows.

## What this project includes

- Dashboard and client master
- GST file import (JSON / ZIP / XLSX / CSV)
- Books import and basic column detection
- Reconciliation engine for matched / mismatch / missing records
- GST return draft screens for GSTR-1 and GSTR-3B (plus annual formats)
- Static statutory rule registry and validation outcomes
- CSV export for summary and exceptions
- AI integration hook for OpenRouter-compatible APIs
- Notes on GST Portal API limitations

## Repository contents

- `index.html` — main app shell
- `styles.css` — UI styling
- `app.js` — app logic and sample data
- `data/sample-gstr2b.json` — sample GST JSON
- `data/sample-purchase-register.csv` — sample books data
- `templates/purchase-register-template.csv` — Excel-ready template
- `templates/sales-register-template.csv` — sales workbook template
- `docs/reconciliation-rules.md` — reconciliation logic notes
- `docs/acceptance-tests.md` — test checklist
- `docs/supported-formats.md` — supported formats and limitations

## How to run

1. Open the repository folder in a browser, or serve locally with a static web server.
2. Open `index.html` directly in the browser for a quick start.
3. Optional local server example:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## GST Portal API status

There is no public GST portal API for normal browser-based testing. The GST portal is not a public REST API for arbitrary taxpayer access. This app therefore works with uploaded GST JSON / ZIP / Excel / CSV exports and tracks them locally.

## AI integration

The app includes an AI integration hook for OpenRouter-compatible providers or any standard chat-completion-compatible endpoint. To use it, add a live key in Settings and keep the provider configured.

## Supported workflow note

This is a practical local-first prototype. It is not a full production multi-user secure server application.

## Current limitations

- No shared secure backend or authentication layer
- No real GST portal auth integration
- No full production-grade ERP import engine for every accounting package
- No real GST e-filing or portal submission capability

## Useful official sources

- CBIC GST: https://cbic-gst.gov.in/
- GST Portal: https://www.gst.gov.in/
- GST Portal tutorials: https://tutorial.gst.gov.in/

## License

This project is a demonstration and practice tool. It is not affiliated with or endorsed by the GST portal or any government authority.
