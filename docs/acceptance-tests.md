# Acceptance test results checklist

The following test scenarios should be executed in a browser and recorded with expected vs actual result.

## 1. Automatic client detection from a JSON file
- Expected: GSTIN is extracted and client is recognized
- Status: manual sample test recommended

## 2. Correct identification of taxpayer's GSTIN
- Expected: taxpayer GSTIN is used rather than supplier GSTIN
- Status: manual sample test recommended

## 3. Multiple clients in one batch
- Expected: import summary identifies each GSTIN separately
- Status: manual sample test recommended

## 4. Duplicate file detection
- Expected: repeated file names or fingerprint match is flagged
- Status: manual sample test recommended

## 5. Incomplete or unfamiliar workbook import
- Expected: import accepts valid rows and isolates invalid rows
- Status: manual sample test recommended

## 6. Exact invoice matching and amount mismatches
- Expected: matched and mismatch rows are shown clearly
- Status: implemented with sample data

## 7. Missing in books / missing in portal
- Expected: relevant rows are flagged
- Status: implemented with sample data

## 8. AI connection test
- Expected: live API works when key is supplied
- Status: requires real API key

## 9. CSV export
- Expected: summary and exceptions export to CSV
- Status: implemented in browser
