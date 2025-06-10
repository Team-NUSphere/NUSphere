import { BuildOptions, Model } from "sequelize";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DB = Record<string, TimetableModelStatic<any>>;

export type TimetableModelStatic<T extends Model> = typeof Model<T> & {
  new (values?: object, options?: BuildOptions): T;
  associate?: (db: DB) => void;
};
