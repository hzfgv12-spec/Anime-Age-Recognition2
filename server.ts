import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase limit to accommodate base64 anime character images comfortably
app.use(express.json({ limit: "15mb" }));

// Endpoint to proxy anime role recognition and age analytics to Gemini server-side
app.post("/api/analyze", async (req, res) => {
  try {
    const { image, mimeType } = req.body;
    
    if (!image || !mimeType) {
      return res.status(400).json({ error: "親，上傳的圖片資料或 Mime 類型不可為空唷！" });
    }

    let apiKey = (req.headers["x-gemini-api-key"] as string) || (req.headers["x-api-key"] as string) || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: "尚未配置 Gemini API 連接。請點擊上方「輸入金鑰設定」按鈕手動輸入您的 Gemini API 金鑰，或在平台的 Settings > Secrets 控制板中配置 GEMINI_API_KEY。" 
      });
    }

    // Lazy initialization of the Gemini SDK client
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, "");

    const promptText = `你是一個極度專業的二次元動漫、ACG 畫風考據大師及動漫角色特徵分析學家。請為本張動漫角色圖片進行深度的視覺鑑定與年齡估測：
1. 鑑定年齡估測：若為經典、有名氣的動漫經典角色（例如芙莉蓮、阿尼亞、神樂、雷姆、 saber 等），請直接寫出其中文名並給予該角色在官方、原著設定中的考據年齡（例如芙莉蓮寫「1000+ 歲 (外表約青少年)」）；若為同人或原創插畫，請依據角色外觀特徵、五官比例、頭身比、作畫風格、服飾考究，給予一個精準、合理的估算年齡或年齡區間（如「16-17 歲」）。
2. 解析其髮色、髮型、眼部刻畫、衣裝服飾等標誌性特徵。
3. 鑑定二次元萌屬性/性格調性（如純情傲嬌、冷笑無口、元氣犬系、中二病、病嬌等）。
4. 撰寫一句極具角色張力與靈魂的二次元日式配音金句（中文翻譯，可帶微量日文諧音）。

請務必嚴格遵循指定的 JSON Schema 格式回傳，不可在 JSON 之外輸出任何額外的 markdown 或對白。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: cleanBase64
          }
        },
        {
          text: promptText
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            characterName: { type: Type.STRING, description: "角色名稱（若能認出）或極具畫面特徵的形象命名，例如「銀髮貓耳魔法少女」" },
            estimatedAge: { type: Type.STRING, description: "鑑定出來的年齡或合理特點範圍，如 '16' '15~17' 或仙魔類角色標註 '3000+ (外表 14)'" },
            estimatedAgeGroup: { 
              type: Type.STRING, 
              enum: ["兒童", "青少年", "青年", "成年", "長者", "不詳/長生不老"]
            },
            visualEvidence: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "判斷年齡或設定的視覺細節推斷依據，例如：臉部寬高比例、大眼睛佔比、衣裝制服特質、甚至作畫線條手感等多方位分析，提供 2-3 項分析理由"
            },
            features: {
              type: Type.OBJECT,
              properties: {
                hairColor: { type: Type.STRING, description: "髮色，如 櫻花粉 / 水晶靛" },
                hairStyle: { type: Type.STRING, description: "髮型，如 雙馬尾附齊瀏海 / 斜瀏海短髮" },
                eyeStyle: { type: Type.STRING, description: "眼睛外觀狀態與氣色，如 金色豎瞳、明亮透澈" },
                clothing: { type: Type.STRING, description: "衣裝衣著，如 英倫風學院制服制裝 / 哥德風裙裝" },
                accessory: { type: Type.STRING, description: "代表性首飾/隨身佩戴裝飾（若無，可填無或描寫一些附屬物品）" }
              },
              required: ["hairColor", "hairStyle", "eyeStyle", "clothing", "accessory"]
            },
            personalityVibe: {
              type: Type.OBJECT,
              properties: {
                primaryVibe: { type: Type.STRING, description: "最具代表性的二次元萌屬性/性格調性（如：冰山無口、傲嬌、中二病、強氣大姐姐、天然呆）" },
                description: { type: Type.STRING, description: "更詳細的性格神韻、表情風格與萌點特化分析" }
              },
              required: ["primaryVibe", "description"]
            },
            confidenceScore: { type: Type.INTEGER, description: "本次精準識別的信心指數 (0-100)" },
            animeArchetype: { type: Type.STRING, description: "角色典型定位原型，如 傲嬌系學園會長 / 戰力天花板精靈 / 鄰家天然妹系角色" },
            customCardQuote: { type: Type.STRING, description: "專為此角色特製的動漫台詞配音，要活靈活現（例如：‘哼，我才不是特意在這裡等你呢，只是剛好路過而已！’）" }
          },
          required: [
            "characterName", "estimatedAge", "estimatedAgeGroup", "visualEvidence", 
            "features", "personalityVibe", "confidenceScore", "animeArchetype", "customCardQuote"
          ]
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("Gemini AI 無法對該圖給予適當的解析。");
    }

    const data = JSON.parse(textOutput.trim());
    return res.json(data);
  } catch (error: any) {
    console.error("AI 辨識異常:", error);
    return res.status(500).json({ error: error.message || "二次元角色年齡鑑定程序發生底層異常，請確認 API 密鑰狀態。" });
  }
});

// Serve static elements and plug in hot module loader in dev
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Express / Server.ts] Anime age-recognition engine listening at http://0.0.0.0:${PORT}`);
  });
}

setupServer();
