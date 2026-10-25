# Reconciliation rules overview

This project uses a practical, audit-friendly matching model designed for GST return review work. The logic avoids claiming legal breach from a raw difference alone.

## Matching hierarchy

1. Exact invoice number and GSTIN match
2. Invoice number normalization (remove punctuation, spaces, prefixes)
3. Date matching within tolerance
4. Taxable value and tax head comparison
5. Tolerance-based difference review
6. Fuzzy match with a confidence score
7. Manual review for uncertain cases

## Default tolerances

- Taxable value tolerance: ₹1,000 or 0.5%
- Tax head tolerance: ₹500 per head
- Date variation: ±2 days for standard suppliers
- Invoice similarity threshold: 80%

## Do not treat as legal proof

A mismatch between books and portal data does not automatically mean a statutory violation. It may reflect:

- period mismatch
- duplicate or amended invoice
- portal record not yet uploaded
- books data not imported correctly
- missing supplier details

The app flags such cases as review items rather than issuing a final statutory conclusion.
