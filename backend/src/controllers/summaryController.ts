import Comment from "#db/models/Comment.js";
import ForumGroup from "#db/models/ForumGroup.js";
import Post from "#db/models/Post.js";
import { GoogleGenAI } from "@google/genai";
import { differenceInMinutes } from "date-fns";
import "dotenv/config";
import { NextFunction, Request, Response } from "express";

let genAI: GoogleGenAI | null = null;

function getEnvVar(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing API_KEY in environment");
  }
  return apiKey;
}

function getGenAI(): GoogleGenAI {
  if (!genAI) {
    const apiKey = getEnvVar();
    if (!apiKey) {
      throw new Error("Missing API_KEY in environment");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

export const handleRunSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<string> => {
  console.log("handleRunSummary called");
  try {
    const { input } = req.body as { input: string };
    console.log("Running summary with input:", input);

    const response = await getGenAI().models.generateContent({
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
      model: "gemini-2.5-flash",
    });

    const text = response.text;

    if (!text) {
      throw new Error("No output text returned from Gemini response.");
    }

    res.json(text);
    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    next(error);
    return "";
  }
};

export const handleGetPostSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const postId = req.params.postId;
  try {
    const post = await Post.findByPk(postId, {
      include: [
        {
          as: "Replies",
          limit: 50,
          model: Comment,
          order: [
            ["likes", "DESC"],
            ["createdAt", "DESC"],
          ],
          separate: true,
        },
      ],
    });
    if (!post) {
      res.status(404).send(`Post of postId ${postId} cannot be found`);
      return;
    }
    if (
      post.aiCache &&
      differenceInMinutes(new Date(), post.aiCacheUpdated) > 60
    ) {
      res.json(post.aiCache);
      return;
    }
    const commentList = post.Replies ?? [];
    const commentsText = commentList
      .map((comment) => comment.comment)
      .join(" ");
    const fullInput = `Title: ${post.title}\n\nDetails: ${post.details}\n\nComments: ${commentsText}`;
    req.body = { input: fullInput };
    const cache = await handleRunSummary(req, res, next);
    await post.update({
      aiCache: cache,
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetGroupSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const groupId = req.params.groupId;
  try {
    const group = await ForumGroup.findByPk(groupId, {
      include: [
        {
          as: "Posts",
          include: [
            {
              as: "Replies",
              limit: 30,
              model: Comment,
              order: [["createdAt", "DESC"]],
              separate: true,
            },
          ],
          limit: 30,
          model: Post,
          order: [
            ["likes", "DESC"],
            ["createdAt", "DESC"],
          ],
          separate: true,
        },
      ],
    });
    if (!group) {
      res.status(404).send(`Group by groupId ${groupId} not found`);
      return;
    }
    if (
      group.aiCache &&
      differenceInMinutes(new Date(), group.aiCacheUpdated) > 60
    ) {
      res.json(group.aiCache);
      return;
    }
    const posts = group.Posts;
    if (!posts) {
      res.json("No posts in this group");
      return;
    }
    const formatted = posts
      .map((post) => {
        const commentsText = (post.Replies ?? [])
          .map((comment) => comment.comment)
          .join(" ");
        return `\n\nPost Title: ${post.title}\nPost Details: ${post.details}\nComments: ${commentsText}\n`;
      })
      .join("");
    req.body = { input: formatted };
    const cache = await handleRunSummary(req, res, next);
    await group.update({
      aiCache: cache,
    });
  } catch (error) {
    next(error);
  }
};
