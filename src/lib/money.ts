/** Minor units are hundredths; preview rounding is half-up, not a live payment contract. */
export const RUBLES_PER_WRAP = 1.8;
export const STEAM_FEE_PERCENT = 5;
const MAX_MINOR = 999_999_999_999; // Catalog collectibles may cost more than the top-up input limit.

export function parseAmount(value: string, maxWholeDigits = 7): number | null {
  const clean = value.trim().replace(/[ \u00a0\u202f]/g, "").replace(",", ".");
  if (!Number.isInteger(maxWholeDigits) || maxWholeDigits < 1 || maxWholeDigits > 10) return null;
  if (!new RegExp(`^\\d{1,${maxWholeDigits}}(?:\\.\\d{1,2})?$`).test(clean)) return null;
  const [whole, fraction = ""] = clean.split(".");
  const minor = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(minor) && minor <= MAX_MINOR ? minor : null;
}
function validMinor(value: number) {
  if (!Number.isSafeInteger(value) || value < 0 || value > MAX_MINOR) throw new RangeError("Invalid money amount");
}
export function wrapsToRub(wrapsMinor: number) {
  validMinor(wrapsMinor);
  return Number((BigInt(wrapsMinor) * 9n + 2n) / 5n);
}
export function rubToWraps(rubMinor: number) {
  validMinor(rubMinor);
  return Number((BigInt(rubMinor) * 5n + 4n) / 9n);
}
export function steamQuote(amount: number) {
  validMinor(amount);
  const fee = Number((BigInt(amount) * 5n + 50n) / 100n);
  return { amount, fee, total: amount + fee };
}
export function sumPrices(prices: readonly number[]) {
  const wraps=prices.reduce((sum,price)=>{validMinor(price);return sum+price;},0);
  if(!Number.isSafeInteger(wraps))throw new RangeError("Invalid total");
  return {wraps,rub:Number((BigInt(wraps)*9n+2n)/5n)};
}
export function formatMinor(minor: number, digits = 2) {
  return (minor / 100).toLocaleString("ru-RU", { minimumFractionDigits:0, maximumFractionDigits:digits });
}
export function inputAmount(minor: number) {
  return (minor / 100).toFixed(2).replace(/\.00$/, "").replace(".", ",");
}
