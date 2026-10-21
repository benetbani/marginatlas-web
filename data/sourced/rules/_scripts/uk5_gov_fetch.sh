#!/usr/bin/env bash
# uk5_gov_fetch.sh: pull the gov.uk pages behind uk5-country-rows.json through gov.uk's content API into DL, then run
# `python3 uk5_country_rows.py` from this folder. Pulled 2026-10-21; each row keeps its pull's sha256.
set -uo pipefail
DL=/srv/atlas/runs/data-rules/dl/gov-uk5
mkdir -p "$DL"
for p in submit-vat-return prepare-file-annual-accounts-for-limited-company pay-corporation-tax company-tax-returns \
  guidance/filing-your-companys-confirmation-statement annual-accounts limited-company-formation corporation-tax register-employer \
  guidance/food-business-registration become-sole-trader apply-start-up-loan workplace-pensions dismissal \
  guidance/find-out-if-and-when-you-need-to-use-making-tax-digital-for-income-tax \
  government/news/companies-house-fees-are-changing-from-1-february-2026 \
  government/publications/implementing-the-plan-to-make-work-pay-and-employment-rights-act/plan-to-make-work-pay-and-employment-rights-act-timeline-update; do
  f="$DL/$(echo "$p" | tr '/' '_').json"
  echo "$(curl -sS -m 60 -o "$f" -w '%{http_code}' "https://www.gov.uk/api/content/$p") $p"
done
