/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable perfectionist/sort-classes */
import {
  BelongsToManyMixin,
  BelongsToMixin,
  HasManyMixin,
} from "#db/types/associationtypes.js";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Op,
  Sequelize,
} from "sequelize";

import Class from "./Class.js";
import Enrollment from "./Enrollment.js";
import Module from "./Module.js";
import User from "./User.js";
import UserEvent, { UserModelType } from "./UserEvents.js";

interface UserTimetable
  extends HasManyMixin<UserEvent, string, "Event", "Events"> {}
interface UserTimetable
  extends HasManyMixin<Enrollment, string, "Enrollment", "Enrollments"> {}
interface UserTimetable extends BelongsToMixin<User, string, "User"> {}
interface UserTimetable
  extends BelongsToManyMixin<Module, string, "Module", "Modules"> {}

class UserTimetable extends Model<
  InferAttributes<UserTimetable>,
  InferCreationAttributes<UserTimetable>
> {
  declare timetableId: CreationOptional<string>;

  declare uid: CreationOptional<string>;

  declare Events?: NonAttribute<UserEvent[]>;
  declare User?: NonAttribute<User>;
  declare Enrollments?: NonAttribute<Enrollment[]>;
  declare Modules?: NonAttribute<Module[]>;

  // Create
  async makeNewEvent(event: UserModelType) {
    const userEvent = await UserEvent.create({
      day: event.day,
      description: event.description,
      endTime: event.endTime,
      eventId: event.eventId,
      name: event.name,
      startTime: event.startTime,
      timetableId: this.timetableId,
      venue: event.venue,
      weeks: event.weeks,
    });
    this.Events = await this.getEvents();
    return userEvent;
  }

  async registerNewModule(moduleCode: string) {
    const module = await Module.findByPk(moduleCode);

    if (!module) throw new Error("No such module exists");

    await Enrollment.addNewEnrollment(
      this.timetableId,
      moduleCode,
      module.defaultClasses,
    );
    this.Modules = await this.getModules();
    this.Enrollments = await this.getEnrollments();
    const lessonTypes = module.lessonTypes;
    const filters = module.defaultClasses.map((defaultClass, idx) => ({
      [Op.and]: [{ classNo: defaultClass }, { lessonType: lessonTypes[idx] }],
    }));
    const classes = await module.getClasses({
      where: {
        [Op.or]: filters,
      },
    });

    return classes;
  }
  // Read
  async getAllEvents(): Promise<UserEvent[]> {
    this.Events ??= await this.getEvents();
    return this.Events;
  }

  async getAllModules() {
    this.Modules ??= await this.getModules();
    return this.Modules;
  }

  async getAllClasses() {
    this.Enrollments = await this.getEnrollments({
      include: [
        {
          as: "Module",
          include: [
            {
              as: "Classes",
              model: Class,
            },
          ],
          model: Module,
        },
      ],
    });

    const allClasses = this.Enrollments.flatMap((enrollment) => {
      const module = enrollment.Module;
      const classNos = enrollment.classes;
      const lessonTypes = module?.lessonTypes ?? [];

      return classNos.flatMap((classNo, idx) =>
        (module?.Classes ?? []).filter(
          (lesson) =>
            lesson.classNo === classNo &&
            lesson.lessonType === lessonTypes[idx],
        ),
      );
    });

    return allClasses;
  }

  async getAllEventsAndClasses() {
    const allEvents = await this.getAllEvents();
    const allClasses = await this.getAllClasses();
    return {
      classes: allClasses,
      events: allEvents,
    };
  }

  // Update
  async editOrMakeEvent(event: UserModelType) {
    if (!event.eventId)
      throw new Error("There is no eventId to reference update");
    await this.getAllEvents();
    let userEvent = this.Events?.find(
      (uevent) => uevent.eventId === event.eventId,
    );
    if (!userEvent) {
      userEvent = await UserEvent.create({
        day: event.day,
        description: event.description,
        endTime: event.endTime,
        eventId: event.eventId,
        name: event.name,
        startTime: event.startTime,
        timetableId: this.timetableId,
        venue: event.venue,
        weeks: event.weeks,
      });
    } else {
      userEvent.set({ ...event });
      await userEvent.save();
    }
    this.Events = await this.getEvents();
    return userEvent;
  }

  async editClasses(moduleCode: string, lessonType: string, classNo: string) {
    return (
      await this.getEnrollments({
        include: [
          {
            as: "Module",
            model: Module,
          },
        ],
        limit: 1,
        where: {
          [Op.and]: [
            { moduleId: moduleCode },
            { timetableId: this.timetableId },
          ],
        },
      })
    )[0].editClass(lessonType, classNo);
  }

  // Delete
  async deleteEvent(eventId: string) {
    await this.getAllEvents();
    const event = this.Events?.find((event) => event.eventId === eventId);
    if (event) await event.destroy();
    this.Events = await this.getEvents();
    return this.Events;
  }

  async unregisterModule(moduleCode: string) {
    await Enrollment.unregister(this.timetableId, moduleCode);
    this.Enrollments = await this.getEnrollments();
    this.Modules = await this.getModules();
    return this.Modules;
  }

  static associate() {
    UserTimetable.hasMany(UserEvent, {
      as: "Events",
      foreignKey: "timetableId",
    });
    UserTimetable.belongsTo(User, { as: "User", foreignKey: "uid" });
    UserTimetable.belongsToMany(Module, {
      as: "Modules",
      foreignKey: "timetableId",
      otherKey: "moduleId",
      through: Enrollment,
    });
    UserTimetable.hasMany(Enrollment, {
      as: "Enrollments",
      foreignKey: "timetableId",
    });
  }

  static initModel(sequelize: Sequelize) {
    UserTimetable.init(
      {
        timetableId: {
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          type: DataTypes.UUID,
        },
        uid: {
          allowNull: false,
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
      },
    );
  }
}

export default UserTimetable;

// export interface UserTimetableAttributes {
//   id: number;
// }

// export interface UserTimetableInstance
//   extends Model<UserTimetableAttributes>,
//     UserTimetableAttributes {}

// export default (sequelize: Sequelize): DbModelStatic<UserTimetableInstance> => {
//   const UserTimetable = sequelize.define("UserTimetable", {
//     timetableId: {
//       autoIncrement: true,
//       primaryKey: true,
//       type: DataTypes.INTEGER,
//     },
//   }) as DbModelStatic<UserTimetableInstance>;

//   UserTimetable.associate = (db: DB) => {
//     UserTimetable.hasMany(db.UserEvent, { foreignKey: "timetableId" });
//     UserTimetable.belongsTo(db.User, { foreignKey: "uid" });
//     UserTimetable.belongsToMany(db.Class, {
//       foreignKey: "timetableId",
//       through: "SelectedClasses",
//     });
//   };
//   return UserTimetable;
// };
