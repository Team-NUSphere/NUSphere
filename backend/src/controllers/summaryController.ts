import { NextFunction, Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey: apiKey });

export const handleRunSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  console.log("handleRunSummary called");
  try {
    const { input } = req.body;
    console.log("Running summary with input:", input);

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `If it is academic module related, then imagine you are an expert on NUS modules. Below are multiple student forum posts about a specific module. Analyze them carefully and write a concise and structured summary of the overall student sentiment in 4–5 sentences, strictly focused on the most relevant and recurring insights.
 If there is insufficient information, state clearly: “Not enough information to summarise.”
Use the following format and avoid repetition or vague statements:

    Grading Scheme: [Concise but specific breakdown of components like exams, projects, participation, etc.]

    Lecturer: [Summary of the lecturer’s teaching style, effectiveness, and student feedback—include names if frequently mentioned.]

    Workload & Difficulty: [Overview of time commitment, assignment frequency, and perceived academic challenge.]

    Tips to Do Well: [Practical and proven advice shared by students (e.g., use of past year papers, attending tutorials, focusing on certain topics).]

    Bell Curve: [Student perception of grade competitiveness, whether it's steep or lenient, and any known trends.]

Focus only on the most useful and commonly agreed-upon points. If not academic module related, just give a brief summary in 4-5 sentences.
:\n\n${input}`,
    });

    const text = response.text;

    if (!text) {
      throw new Error("No output text returned from Gemini response.");
    }

    res.json(text);
  } catch (error) {
    console.error("Gemini API error:", error);
    next(error);
  }
};
