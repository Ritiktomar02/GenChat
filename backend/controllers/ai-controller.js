import { generateResult } from "../config/ai-connection.js";

export { generateResult };

export const getResult = async (req, res) => {
  try {
    const { prompt } = req.query;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const result = await generateResult(prompt);
    res.json({ result });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("AI error:", error);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
