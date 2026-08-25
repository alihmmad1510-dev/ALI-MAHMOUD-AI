import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY غير موجود");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey
});

app.post("/api/chat", async (req, res) => {

  try {

    const message = req.body?.message;

    if (!message) {
      return res.status(400).json({
        error: "الرسالة فارغة"
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message
    });

    res.json({
      reply: response.text || "لم يصل رد من AI."
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "حدث خطأ أثناء الاتصال بالـAI"
    });
  }
});

app.get("/api/health", (req, res) => {

  res.json({
    ok: true,
    app: "ALI MAHMOUD AI"
  });

});

app.listen(PORT, () => {

  console.log(
    `ALI MAHMOUD AI Server running on port ${PORT}`
  );

}); 