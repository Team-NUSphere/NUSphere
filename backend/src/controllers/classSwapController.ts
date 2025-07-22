import { swapManager } from "#db/index.js";
import Class from "#db/models/Class.js";
import MatchedRequest from "#db/models/MatchedRequest.js";
import Module from "#db/models/Module.js";
import SwapRequests from "#db/models/SwapRequests.js";
import { NextFunction, Request, Response } from "express";

// Create
export const handleCreateSwapRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.json(401).send("No User Found");
    return;
  }
  const uid = req.user.uid;
  const data = req.body as {
    fromClassNo: string;
    lessonType: string;
    moduleCode: string;
    toClassNos: string[];
  };

  try {
    const result = await swapManager.submitSwapRequest(
      data.moduleCode,
      data.lessonType,
      data.fromClassNo,
      data.toClassNos,
      uid,
    );

    if (!result) {
      res.status(409).send("duplicate request found");
      return;
    }

    res.json({
      id: result.request.id,
      status: result.cycleCreated ? "matched" : result.request.status,
    });
  } catch (error) {
    next(error);
  }
};

// Read
export const handleGetOwnRequests = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.status(401).send("No User Found");
    return;
  }
  try {
    const requests = await SwapRequests.findAll({
      include: [
        {
          as: "Match",
          model: MatchedRequest,
        },
      ],
      order: [["createdAt", "DESC"]],
      where: {
        status: "pending",
        uid: req.user.uid,
      },
    });

    res.json(
      requests.map((req) => ({
        fromClassNo: req.fromClassNo,
        id: req.id,
        lessonType: req.lessonType,
        moduleCode: req.moduleCode,
        status: req.Match ? "matched" : req.status,
        toClassNos: req.toClassNos,
      })),
    );
  } catch (error) {
    next(error);
  }
};

export const handleGetAllLessonClasses = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const moduleCode = req.params.moduleCode;
  try {
    const module = await Module.findByPk(moduleCode, {
      include: [
        {
          as: "Classes",
          model: Class,
        },
      ],
    });
    if (!module) {
      res.status(404).send(`No module by ${moduleCode} found`);
      return;
    }
    const classes = module.Classes;
    if (!classes) {
      return;
    }
    const result = module.lessonTypes.reduce<Record<string, string[]>>(
      (acc: Record<string, string[]>, lessonType) => {
        const classNos = classes
          .filter((cls) => cls.lessonType === lessonType)
          .map((cls) => cls.classNo);

        acc[lessonType] = [...new Set(classNos)].sort(); // sort here
        return acc;
      },
      {},
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Delete
export const handleCancelRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.status(401).send("No User Found");
    return;
  }
  const requestId = req.params.requestId;
  try {
    await swapManager.cancelRequest(requestId);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

// Fulfill
export const handleFulfilledRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.status(401).send("No User Found");
    return;
  }
  const requestId = req.params.requestId;
  try {
    await swapManager.fulfillSwap(requestId);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
