/**
 * src/lib/uk/pnl/recipes.ts
 *
 * One recipe per trade: which costs move with each pound of sales and which are sized by the business, each with its
 * basis. Every share here is an ESTIMATE from the trade's research file (data/facts/industry/<file>.json, the cost
 * drivers' share of sales) and travels to the page with that kind. A trade with no recipe prints no money: the engine
 * withholds rather than reaching for a curated margin.
 *
 * THE PROTOCOL, the same for every trade (plan 2026-10-02-vertical-engine-03, task 6):
 *   P1  Each research cost driver takes exactly one class:
 *         variable     goods, ingredients, parts, supplies, lab fees, card and delivery fees: share = its % of sales
 *         commission   producers paid a share of what they take (barbers, nail technicians): share = its % of sales x
 *                      employed producers / all producers, from the research roles; the owner's own chair is paid by
 *                      the profit, which is what the owner keeps
 *         premises     rent, occupancy, facility: dropped, replaced by the measured rent proxy and the law's rates
 *         sized        wages, running costs, insurance, marketing, software: share = its % of sales, sized by the
 *                      business across businesses and fixed within one (model.ts)
 *   P2  The owner's pay is never a line: the owner keeps the profit.
 *   P3  utilitiesCarried is true only when a driver other than the premises one names utilities. Otherwise the premises
 *       driver ("rent and utilities", "rent and occupancy") took them with it, and the margin is overstated by them, a
 *       few per cent of sales, until the energy line (the master plan's plan 07) carries them; until then a page prints
 *       no money for such a trade.
 *   P4  retailHospitalityLeisure follows the 2026-27 multipliers' qualifying uses (plan 01 task 1 records the reading).
 *   P5  A recipe enters only when the London figures it gives pass tests/uk/pnl/recipes.test.ts (at least a quarter of
 *       registered businesses above break-even; a positive margin at the median below 60%). Grocery stores fail: the
 *       valuation's convenience stores (540 premises, 369 m2 on average) are not the register's 6,935 grocers, and the
 *       premises they give need more sales than five in six of them take.
 */
import type { Recipe } from "./inputs";

export const RECIPES: Readonly<Record<string, Recipe>> = {
  barbershops: {
    trade: "barbershops",
    research: "data/facts/industry/barbershops.json",
    retailHospitalityLeisure: true,
    utilitiesCarried: false,
    variable: [
      { key: "barbers' commission", driver: "Barber pay and commission", shareOfSales: 0.3, kind: "estimate", basis: "barber pay and commission 45% of sales, on the two employed chairs of three" },
      { key: "supplies and product", driver: "Supplies and product", shareOfSales: 0.08, kind: "estimate", basis: "supplies and product 8% of sales" },
    ],
    sized: [{ key: "running costs", driver: "Other operating", shareOfSales: 0.12, kind: "estimate", basis: "other operating costs 12% of sales" }],
  },
  "nail-salons": {
    trade: "nail-salons",
    research: "data/facts/industry/nail_salons.json",
    retailHospitalityLeisure: true,
    utilitiesCarried: true,
    variable: [
      { key: "technicians' commission", driver: "Technician labor and commissions", shareOfSales: (0.4 * 5) / 6, kind: "estimate", basis: "technician labour and commissions 40% of sales, on the five employed technicians of six" },
      { key: "supplies and consumables", driver: "Supplies and consumables", shareOfSales: 0.17, kind: "estimate", basis: "supplies and consumables 17% of sales" },
    ],
    sized: [{ key: "utilities, insurance, admin", driver: "Utilities, insurance, admin", shareOfSales: 0.08, kind: "estimate", basis: "utilities, insurance and admin 8% of sales" }],
  },
  restaurants: {
    trade: "restaurants",
    research: "data/facts/industry/restaurants.json",
    retailHospitalityLeisure: true,
    utilitiesCarried: true,
    variable: [
      { key: "food and drink", driver: "Food and beverage cost", shareOfSales: 0.32, kind: "estimate", basis: "food and beverage cost 32% of sales" },
      { key: "marketing and delivery fees", driver: "Marketing and delivery fees", shareOfSales: 0.04, kind: "estimate", basis: "marketing and delivery fees 4% of sales" },
    ],
    sized: [
      { key: "staff", driver: "Labor and payroll", shareOfSales: 0.3, kind: "estimate", basis: "labour and payroll 30% of sales" },
      { key: "utilities, supplies, running costs", driver: "Utilities, supplies and other operating", shareOfSales: 0.12, kind: "estimate", basis: "utilities, supplies and other operating costs 12% of sales" },
    ],
  },
  "bakeries-retail": {
    trade: "bakeries-retail",
    research: "data/facts/industry/bakeries_retail.json",
    retailHospitalityLeisure: true,
    utilitiesCarried: false,
    variable: [{ key: "ingredients and packaging", driver: "Ingredients and packaging", shareOfSales: 0.32, kind: "estimate", basis: "ingredients and packaging 32% of sales" }],
    sized: [
      { key: "staff", driver: "Labor and baking staff", shareOfSales: 0.34, kind: "estimate", basis: "labour and baking staff 34% of sales" },
      { key: "running costs", driver: "Other operating", shareOfSales: 0.1, kind: "estimate", basis: "other operating costs 10% of sales" },
    ],
  },
  "sports-fitness": {
    trade: "sports-fitness",
    research: "data/facts/industry/sports_fitness.json",
    retailHospitalityLeisure: true,
    utilitiesCarried: true,
    variable: [],
    sized: [
      { key: "trainers and instructors", driver: "Payroll, trainers and instructors", shareOfSales: 0.33, kind: "estimate", basis: "payroll, trainers and instructors 33% of sales" },
      { key: "equipment upkeep", driver: "Equipment upkeep and depreciation", shareOfSales: 0.08, kind: "estimate", basis: "equipment upkeep and depreciation 8% of sales" },
      { key: "marketing", driver: "Marketing and member acquisition", shareOfSales: 0.08, kind: "estimate", basis: "marketing and member acquisition 8% of sales" },
      { key: "utilities, insurance, software", driver: "Utilities, insurance and software", shareOfSales: 0.06, kind: "estimate", basis: "utilities, insurance and software 6% of sales" },
    ],
  },
  "auto-repair-shops": {
    trade: "auto-repair-shops",
    research: "data/facts/industry/auto_repair_shops.json",
    retailHospitalityLeisure: true,
    utilitiesCarried: false,
    variable: [{ key: "parts and materials", driver: "Parts and materials", shareOfSales: 0.35, kind: "estimate", basis: "parts and materials 35% of sales" }],
    sized: [
      { key: "technicians", driver: "Technician wages and benefits", shareOfSales: 0.24, kind: "estimate", basis: "technician wages and benefits 24% of sales" },
      { key: "insurance, tools, shop supplies", driver: "Insurance, tools and shop supplies", shareOfSales: 0.09, kind: "estimate", basis: "insurance, tools and shop supplies 9% of sales" },
    ],
  },
  "dental-practices": {
    trade: "dental-practices",
    research: "data/facts/industry/dental_practices.json",
    retailHospitalityLeisure: false,
    utilitiesCarried: false,
    variable: [
      { key: "lab fees", driver: "Dental lab fees", shareOfSales: 0.1, kind: "estimate", basis: "dental lab fees 10% of sales" },
      { key: "clinical supplies", driver: "Clinical supplies", shareOfSales: 0.06, kind: "estimate", basis: "clinical supplies 6% of sales" },
    ],
    sized: [
      { key: "staff (not dentists)", driver: "Staff wages (non-dentist)", shareOfSales: 0.27, kind: "estimate", basis: "staff wages, not dentists, 27% of sales" },
      { key: "equipment, insurance, admin", driver: "Equipment, insurance and admin", shareOfSales: 0.08, kind: "estimate", basis: "equipment, insurance and admin 8% of sales" },
    ],
  },
};
