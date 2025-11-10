const express = require("express");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const app = express();
const port = process.env.PORT || 3000;

app.get("/fetch-html", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).json({ error: "Missing 'url' query parameter" });

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    );

    await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 30000 });
    const html = await page.content();

    await browser.close();
    res.status(200).json({ html });
  } catch (err) {
    res.status(500).json({ error: err.message || "Unknown error" });
  }
});

app.listen(port, () => {
  console.log(`Stealth Puppeteer proxy running on port ${port}`);
});

