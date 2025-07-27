import { sequelize } from "#db/index.js";
import Class from "#db/models/Class.js";
import ForumGroup from "#db/models/ForumGroup.js";
import Module from "#db/models/Module.js";
import { InferCreationAttributes } from "sequelize";

import { ModuleCode, ModuleType } from "../types/nusmodstypes.js";
import { fetchModInfo, fetchModList } from "./nusmodsAPI.js";

async function populateModuleTable() {
  await sequelize.sync();

  const modList: ModuleCode[] = await fetchModList();
  console.log(modList);
  for (const moduleCode of modList) {
    const moduleDetails: ModuleType | null = await fetchModInfo(moduleCode);
    if (!moduleDetails) continue;

    const {
      department,
      description,
      faculty,
      gradingBasisDescription,
      moduleCredit,
      semesterData,
      title,
    } = moduleDetails;

    const timetable = semesterData.find((sem) => sem.semester == 1)?.timetable;
    console.log(`${moduleCode}: ${title}`);
    console.log(timetable);
    if (!timetable) continue;
    const lessonTypeSet = new Set<string>();
    const defaultClasses: string[] = [];

    const timetableFormatted: InferCreationAttributes<Class>[] = timetable.map(
      (data) => {
        if (!lessonTypeSet.has(data.lessonType)) {
          lessonTypeSet.add(data.lessonType);
          defaultClasses.push(data.classNo);
        }
        if (Array.isArray(data.weeks)) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { size, ...rest } = data;
          return rest as InferCreationAttributes<Class>;
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { size, weeks, ...rest } = data;
          const newData = {
            ...rest,
            endDate: weeks.end,
            startDate: weeks.start,
            weekInterval: weeks.weekInterval,
            weeks: weeks.weeks,
          };
          return newData as InferCreationAttributes<Class>;
        }
      },
    );

    const ModuleGroupFormatted: InferCreationAttributes<ForumGroup> = {
      aiCache: undefined,
      aiCacheUpdated: undefined,
      description: description,
      groupId: undefined,
      groupName: `${moduleCode}: ${title}`,
      ownerId: moduleCode,
      ownerType: "Module",
      postCount: 0,
    };

    await Module.create(
      {
        Classes: timetableFormatted,
        defaultClasses: defaultClasses,
        department: department,
        description: description,
        faculty: faculty,
        gradingBasis: gradingBasisDescription,
        lessonTypes: [...lessonTypeSet],
        moduleCredit: parseFloat(moduleCredit),
        ModuleGroup: ModuleGroupFormatted,
        moduleId: moduleCode,
        title: title,
      },
      {
        include: [
          {
            as: "Classes",
            model: Class,
          },
          {
            as: "ModuleGroup",
            model: ForumGroup,
          },
        ],
      },
    );
  }
}

await populateModuleTable();
