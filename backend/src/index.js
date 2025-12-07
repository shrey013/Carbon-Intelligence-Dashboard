import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

dotenv.config();

const app = express();
// const PORT = process.env.PORT || 5000;
const PORT = 5000;

// ---------- MIDDLEWARE ----------
app.use(express.json());
app.use(
  cors({
    origin: "*", // for simple public demo; you can later restrict to your frontend domain
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// ---------- HEALTH CHECK ----------
app.get("/", (req, res) => {
  res.json({ status: "Backend running successfully 🚀" });
});

// ---------- GPT CHAT ROUTE ----------
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res
        .status(500)
        .json({ error: "OPENAI_API_KEY is missing in backend .env file" });
    }

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message must be a non-empty string" });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are Carbon AI, a concise assistant explaining carbon emissions, sectors, and reduction strategies in very simple language."
          },
          { role: "user", content: message }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error("GPT Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Something went wrong with GPT API. Check backend logs."
    });
  }
});

// ---------- EMISSION CALCULATOR ROUTE ----------
app.post("/api/calc", (req, res) => {
  try {
    const { electricity = 0, fuel = 0, travel = 0 } = req.body;

    // Simple realistic calculation
    const emission =
      electricity * 0.82 + // kg CO2 per kWh
      fuel * 2.31 + // kg CO2 per litre petrol
      travel * 0.121; // kg CO2 per passenger-km

    return res.json({ totalEmission: emission.toFixed(2) });
  } catch (err) {
    console.error("Calc error:", err.message);
    return res.status(500).json({ error: "Error in calc route" });
  }
});

// ---------- START SERVER ----------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
