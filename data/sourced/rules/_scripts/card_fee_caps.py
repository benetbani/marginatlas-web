"""The caps on card interchange fees in the United Kingdom: retained Regulation (EU) 2015/751, articles 3 (debit) and 4 (credit),
as amended, read from legislation.gov.uk's revised text. The cap is read out of each article's words, never typed.

Pull: https://www.legislation.gov.uk/eur/2015/751/article/3 -> DL/ifr_art3.html
      https://www.legislation.gov.uk/eur/2015/751/article/4 -> DL/ifr_art4.html
(DL here is /srv/atlas/runs/data-rules/dl; the sha256 of each pull is kept in the row's source.)
"""
import hashlib, html, re
from lib import R, src, write

DL = "/srv/atlas/runs/data-rules/dl"
ARTS = {3: ("card_interchange_cap_debit", "debit"), 4: ("card_interchange_cap_credit", "credit")}
rows = []
for art, (item, kind) in ARTS.items():
    raw = open(f"{DL}/ifr_art{art}.html", "rb").read()
    t = re.sub(r"<script.*?</script>|<style.*?</style>", "", raw.decode("utf-8"), flags=re.S)
    t = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", t)))
    m = re.search(r"interchange fee of more than (0[,.]\d) ?% of the value of the transaction for any (?:\[ F1 UK \] |UK )" + kind, t)
    assert m, f"article {art}: the cap's sentence not found"
    cap = float(m.group(1).replace(",", "."))
    url = f"https://www.legislation.gov.uk/eur/2015/751/article/{art}"
    s = src("legislation.gov.uk (The National Archives)", f"Regulation (EU) 2015/751, as retained and amended, article {art}", url)
    s["sha256"] = hashlib.sha256(raw).hexdigest()
    rows.append(R(item, "GB", cap, "% of each payment", "2026", s,
                  measure=f"The most the card's own bank may take from the shop's bank on a UK consumer {kind} card payment (the interchange fee)",
                  note="Applies when the card, the shop's bank and the shop are all in the UK. It is one part of what a shop pays: "
                       "the shop's own bank and the card scheme add their fees on top, and those are not capped. Cards issued in the EEA "
                       "and used online are not capped (the regulator's review of cross-border fees was open in 2026)."))
print([(r["item"], r["value"]) for r in rows])
write("card-fee-caps.json", "card-fee-caps",
      src("legislation.gov.uk (The National Archives)", "The UK's caps on card interchange fees, retained Regulation (EU) 2015/751",
          "https://www.legislation.gov.uk/eur/2015/751/contents"), rows, retrieved="2026-10-21")
