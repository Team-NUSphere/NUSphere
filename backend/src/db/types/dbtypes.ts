import { BuildOptions, Model, Sequelize } from "sequelize";

export type DB = Record<string, hasAssociateAndInit>;

export type DbModelStatic<T extends Model> = typeof Model<T> & {
  new (values?: object, options?: BuildOptions): T;
  associate?: (db: DB) => void;
};

export interface hasAssociateAndInit {
  associate: () => void;
  initModel: (sequelize: Sequelize) => void;
}
