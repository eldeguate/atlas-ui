import { chromium } from "playwright";

const url = process.env.ATLAS_URL ?? "http://localhost:3000";
const out = process.env.OUT ?? "m1-real-rag-screenshot.png";
const query = "¿Qué frenos tiene la CT 100 ES?";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto(url, { waitUntil: "networkidle" });
await page.getByLabel("Escribe tu pregunta").fill(query);
await page.getByRole("button", { name: "Enviar" }).click();
await page.getByText("Fuentes").waitFor({ timeout: 60000 });
await page.waitForTimeout(1200);
await page.screenshot({ path: out, fullPage: true });

console.log(`saved ${out}`);
await browser.close();