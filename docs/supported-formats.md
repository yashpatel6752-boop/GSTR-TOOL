# Supported formats and limitations

## Supported file types

- GST portal JSON files
- ZIP container placeholders
- CSV purchase / sales register files
- XLSX / XLS workbook files

## Workflow assumptions

This prototype prioritizes local-first use and practical GST review. It does not attempt to implement every return schema or every foreign accounting package format.

## Known limitations

- No secure multi-user backend
- No real GST portal authentication or filing integration
- No production-grade automated mapping for all possible accounting exports
- No public GST API test access
- No multi-entity backend audit database

## Recommended next steps for production

- Add secure backend with login and RBAC
- Encrypt data at rest and in transit
- Add schema validation for all major GST portals and ERP packages
- Use a server-side integration only when an authorized GST API is available
