/** Price/stock/financing are live SAP facts — never answered from documents. */
export const LIVE_DATA_PATTERN =
  /\b(precio|precios|costo|inventario|stock|disponibilidad|cuota|financiaci[oó]n)\b/i;

export function isLiveDataQuery(query: string): boolean {
  return LIVE_DATA_PATTERN.test(query);
}