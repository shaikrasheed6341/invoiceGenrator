import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";
import fs from "fs";

const router = express.Router();

router.get("/generate-invoice", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).send("Quotation ID is required");

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Fix for Linux
    });
    const page = await browser.newPage();

    // Navigate to the invoice page with the quotation ID
    await page.goto(`http://localhost:5173/invoice/${id}`, { waitUntil: "networkidle2" });

    // Ensure the invoice container loads
    await page.waitForSelector(".invoice-container", { timeout: 5000 });

    // Debugging: Take a screenshot to verify if the invoice is displayed
    await page.screenshot({ path: "debug.png", fullPage: true });

    // Add a small delay to ensure rendering
    await page.waitForTimeout(3000);

    // Generate PDF and save it
    const pdfPath = `invoice_${id}.pdf`;
    await page.pdf({ path: pdfPath, format: "A4", printBackground: true });

    await browser.close();

    // Send file to frontend
    res.download(pdfPath, `invoice_${id}.pdf`, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Error generating invoice");
      }
      // Remove file after sending to free storage
      fs.unlinkSync(pdfPath);
    });

  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).send("Failed to generate invoice");
  }
});

export default router;
