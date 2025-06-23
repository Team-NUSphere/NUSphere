/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable perfectionist/sort-classes */
import { BelongsToMixin } from "#db/types/associationtypes.js";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";

import UserTimetable from "./UserTimetable.js";

export interface UserEventType {
  day: string;
  description?: string;
  endTime: string;
  eventId?: string;
  name: string;
  startTime: string;
  venue?: string;
  weeks?: number[];
}

interface UserEvent
  extends BelongsToMixin<UserTimetable, number, "UserTimetable"> {}

class UserEvent extends Model<
  InferAttributes<UserEvent>,
  InferCreationAttributes<UserEvent>
> {
  declare description?: CreationOptional<string>;
  declare endTime: string;
  declare eventId: CreationOptional<string>;
  declare name: string;
  declare startTime: string;
  declare venue?: CreationOptional<string>;
  declare weeks?: CreationOptional<number[]>;
  declare day: string;

  declare timetableId: CreationOptional<string>;

  declare UserTimetable?: NonAttribute<UserTimetable>;

  static associate() {
    UserEvent.belongsTo(UserTimetable, {
      as: "UserTimetable",
      foreignKey: "timetableId",
    });
  }

  static initModel(sequelize: Sequelize) {
    UserEvent.init(
      {
        day: {
          type: DataTypes.STRING,
        },
        description: {
          allowNull: true,
          type: DataTypes.TEXT,
        },
        endTime: {
          type: DataTypes.DATE,
        },
        eventId: {
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          type: DataTypes.UUID,
          unique: true,
        },
        name: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        startTime: {
          type: DataTypes.DATE,
        },
        timetableId: {
          allowNull: false,
          type: DataTypes.UUID,
        },
        venue: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        weeks: {
          allowNull: true,
          type: DataTypes.ARRAY(DataTypes.INTEGER),
        },
      },
      {
        sequelize,
      },
    );
  }
}

export default UserEvent;

// export interface UserEventAttributes {
//   description?: string;
//   endTime?: string;
//   eventId?: string;
//   isRecurring: boolean;
//   name: string;
//   startTime?: string;
// }
// export interface UserEventInstance
//   extends Model<UserEventAttributes>,
//     UserEventAttributes {}

// export default (sequelize: Sequelize): DbModelStatic<UserEventInstance> => {
//   const UserEvent = sequelize.define("UserEvent", {
//     description: {
//       type: DataTypes.TEXT,
//     },
//     endTime: {
//       type: DataTypes.DATE,
//     },
//     eventId: {
//       allowNull: false,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//       type: DataTypes.UUID,
//       unique: true,
//     },
//     isRecurring: {
//       allowNull: false,
//       defaultValue: "false",
//       type: DataTypes.BOOLEAN,
//     },
//     name: {
//       allowNull: false,
//       type: DataTypes.STRING,
//     },
//     startTime: {
//       type: DataTypes.DATE,
//     },
//   }) as DbModelStatic<UserEventInstance>;

//   UserEvent.associate = (db: DB) => {
//     UserEvent.belongsTo(db.UserTimetable, { foreignKey: "timetableId" });
//   };
//   return UserEvent;
// };
