import Module from "#db/models/Module.js";
import { NextFunction, Request, Response } from "express";
import { Op, Sequelize } from "sequelize";

export const handleGetModList = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const params = req.query;
  if (params.q && params.page) {
    if (!(typeof params.q == "string" && typeof params.page == "string")) {
      res.sendStatus(422);
      return;
    }
    try {
      const { modules: modList } = await searchMod(
        params.q,
        parseInt(params.page),
        10,
      );
      res.json(modList);
    } catch (error) {
      next(error);
    }
    return;
  } else {
    try {
      const { modules: modList } = await searchMod(
        "",
        parseInt(typeof params.page === "string" ? params.page : "1"),
        20,
      );
      res.json(modList);
    } catch (error) {
      next(error);
    }
    return;
  }
};

const searchMod = async (searchValue: string, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await Module.findAndCountAll({
    attributes: ["moduleId", "title", "faculty", "moduleCredit"],
    limit: pageSize,
    offset: offset,
    order: [
      [
        Sequelize.literal(
          `CASE WHEN "Module"."moduleId" ILIKE '${searchValue}%' THEN 0 ELSE 1 END`,
        ),
        "ASC",
      ],
      ["moduleId", "ASC"],
    ],
    where: {
      [Op.or]: [
        { moduleId: { [Op.iLike]: `${searchValue}%` } },
        { title: { [Op.iLike]: `%${searchValue}%` } },
      ],
    },
  });
  return {
    currentPage: page,
    modules: rows,
    totalCount: count,
    totalPages: Math.ceil(count / pageSize),
  };
};

export const handleGetModDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const moduleCode = req.params.moduleCode;
  try {
    const modDetails = await searchModDetails(moduleCode);
    if (modDetails) {
      res.json(modDetails.toJSON());
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
};

const searchModDetails = async (moduleCode: string) => {
  const modDetails = await Module.findOne({ where: { moduleId: moduleCode } });
  return modDetails;
};
