import MatchedRequest from "#db/models/MatchedRequest.js";
import SwapCycle from "#db/models/SwapCycle.js";
import SwapRequests from "#db/models/SwapRequests.js";
import User from "#db/models/User.js";
import crypto from "crypto";
import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import TelegramBot from "node-telegram-bot-api";

const botToken = getEnvVar();
const secretKey = crypto.createHash("sha256").update(botToken).digest();
function getEnvVar(): string {
  const apiKey = process.env.TELEGRAM_BOT_TOKEN;
  if (!apiKey) {
    throw new Error("Missing API_KEY in environment");
  }
  return apiKey;
}

const checkTelegramHash = (user: Record<string, number | string>): boolean => {
  const { hash, ...rest } = user;
  const dataCheckString = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${rest[key].toString()}`)
    .join("\n");
  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  return hmac === hash;
};

export const handleTelegramAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  console.log("Telegram authenticating");
  if (!req.user) {
    res.status(401).send("User not authenticated");
    return;
  }
  const telegramUser = req.body as Record<string, number | string>;
  if (!checkTelegramHash(telegramUser)) {
    res.status(403).send("Invalid Telegram hash — possible tampering detected");
    return;
  }

  try {
    if (req.user.telegramId) {
      res.status(200).send("Telegram already linked");
      req.user.telegramUsername = telegramUser.username as string;
      await req.user.save();
      return;
    }
    const id = telegramUser.id as number;
    req.user.telegramId = id;
    req.user.telegramUsername = telegramUser.username as string;
    await req.user.save();
    res.status(200).send("Telegram account linked successfully");
  } catch (err) {
    next(err);
  }
};

const bot = new TelegramBot(botToken, { polling: false });

async function sendSwapCycleMessage(
  swapCycle: SwapCycle,
  moduleCode: string,
  lessonType: string,
): Promise<void> {
  // Ensure MatchedRequests are loaded with SwapRequests and User
  const cycle = await SwapCycle.findByPk(swapCycle.id, {
    include: [
      {
        as: "Requests",
        include: [
          {
            as: "Request",
            include: [
              {
                as: "User",
                model: User,
              },
            ],
            model: SwapRequests,
          },
        ],
        model: MatchedRequest,
      },
    ],
  });

  if (!cycle || !cycle.Requests || cycle.Requests.length === 0) {
    throw new Error(
      "SwapCycle has no associated MatchedRequests or is not found.",
    );
  }

  // Sort MatchedRequests by position (make sure order is continuous)
  const sortedRequests = cycle.Requests.sort((a, b) => a.position - b.position);

  const messageLines = sortedRequests.map(
    (match: MatchedRequest, index: number) => {
      const username = match.Request?.User?.telegramUsername;
      const telegramId = match.Request?.User?.telegramId;
      const displayName =
        username && username.trim() !== ""
          ? `@${username}`
          : // Backup if user doesnt haver username
            `[User](tg://user?id=${telegramId?.toString() ?? "unknown"})`;
      return `${(index + 1).toString()}. ${displayName} (${match.fromClassNo} → ${match.toClassNo})`;
    },
  );

  const message = `A pairing has been found for your swap request (${moduleCode}: ${lessonType}):\n${messageLines.join(
    "\n",
  )}\n\nPlease form a group to coordinate class swap.`;

  await Promise.all(
    sortedRequests.map(async (match: MatchedRequest, index: number) => {
      const telegramId = match.Request?.User?.telegramId;
      if (!telegramId) {
        console.warn(
          `No telegramId for user ${match.Request?.User?.telegramUsername ?? "unknown"}`,
        );
        return;
      }
      try {
        // Add delay to avoid rate limits (20 messages per minute)
        await new Promise((resolve) => setTimeout(resolve, index * 100));
        await bot.sendMessage(telegramId, message, { parse_mode: "Markdown" });
      } catch (error) {
        console.error(
          `Failed to send message to ${telegramId.toString()}:`,
          error,
        );
      }
    }),
  );
}

export { sendSwapCycleMessage };
