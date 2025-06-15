import { BuildOptions, Model } from "sequelize";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DB = Record<string, hasAssociate>;

export type DbModelStatic<T extends Model> = typeof Model<T> & {
  new (values?: object, options?: BuildOptions): T;
  associate?: (db: DB) => void;
};

export interface hasAssociate {
  associate: () => void;
}
