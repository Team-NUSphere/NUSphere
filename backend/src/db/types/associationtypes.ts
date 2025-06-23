/* eslint-disable perfectionist/sort-named-imports */
/* eslint-disable perfectionist/sort-object-types */
/* eslint-disable perfectionist/sort-modules */

// Credits: https://dev.to/thetos_/typing-sequelize-association-mixins-using-typescript-492b
import {
  Model,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type BelongsToCreateAssociationMixin,
  type HasManyGetAssociationsMixin,
  type HasManyCountAssociationsMixin,
  type HasManyHasAssociationsMixin,
  type HasManySetAssociationsMixin,
  type HasManyAddAssociationsMixin,
  type HasManyRemoveAssociationsMixin,
  type HasManyHasAssociationMixin,
  type HasManyAddAssociationMixin,
  type HasManyRemoveAssociationMixin,
  type HasManyCreateAssociationMixin,
  type HasOneGetAssociationMixin,
  type HasOneSetAssociationMixin,
  type HasOneCreateAssociationMixin,
  type BelongsToManyGetAssociationsMixin,
  type BelongsToManyCreateAssociationMixin,
  type BelongsToManyRemoveAssociationMixin,
  type BelongsToManyAddAssociationMixin,
  type BelongsToManyHasAssociationMixin,
  type BelongsToManyRemoveAssociationsMixin,
  type BelongsToManyAddAssociationsMixin,
  type BelongsToManySetAssociationsMixin,
  type BelongsToManyHasAssociationsMixin,
  type BelongsToManyCountAssociationsMixin,
} from "sequelize";

// define helper types
type PostfixProperties<PropTypes, Postfix extends string> = {
  [P in keyof PropTypes as `${Exclude<P, symbol>}${Postfix}`]: PropTypes[P];
};

type Prettify<T> = { [P in keyof T]: T[P] };

// association mixin interfaces
export type BelongsToMixin<
  AssociatedModel extends Model,
  PrimaryKeyType,
  Name extends string,
> = PostfixProperties<
  {
    get: BelongsToGetAssociationMixin<AssociatedModel>;
    set: BelongsToSetAssociationMixin<AssociatedModel, PrimaryKeyType>;
    create: BelongsToCreateAssociationMixin<AssociatedModel>;
  },
  Capitalize<Name>
>;

export type HasOneMixin<
  AssociatedModel extends Model,
  PrimaryKeyType,
  Name extends string,
> = PostfixProperties<
  {
    get: HasOneGetAssociationMixin<AssociatedModel>;
    set: HasOneSetAssociationMixin<AssociatedModel, PrimaryKeyType>;
    create: HasOneCreateAssociationMixin<AssociatedModel>;
  },
  Capitalize<Name>
>;

export type HasManyMixin<
  AssociatedModel extends Model,
  PrimaryKeyType,
  SingularName extends string,
  PluralName extends string,
> = Prettify<
  PostfixProperties<
    {
      get: HasManyGetAssociationsMixin<AssociatedModel>;
      count: HasManyCountAssociationsMixin;
      has: HasManyHasAssociationsMixin<AssociatedModel, PrimaryKeyType>;
      set: HasManySetAssociationsMixin<AssociatedModel, PrimaryKeyType>;
      add: HasManyAddAssociationsMixin<AssociatedModel, PrimaryKeyType>;
      remove: HasManyRemoveAssociationsMixin<AssociatedModel, PrimaryKeyType>;
    },
    Capitalize<PluralName>
  > &
    PostfixProperties<
      {
        has: HasManyHasAssociationMixin<AssociatedModel, PrimaryKeyType>;
        add: HasManyAddAssociationMixin<AssociatedModel, PrimaryKeyType>;
        remove: HasManyRemoveAssociationMixin<AssociatedModel, PrimaryKeyType>;
        create: HasManyCreateAssociationMixin<AssociatedModel>;
      },
      Capitalize<SingularName>
    >
>;

export type BelongsToManyMixin<
  AssociatedModel extends Model,
  PrimaryKeyType,
  SingularName extends string,
  PluralName extends string,
> = Prettify<
  PostfixProperties<
    {
      get: BelongsToManyGetAssociationsMixin<AssociatedModel>;
      count: BelongsToManyCountAssociationsMixin;
      has: BelongsToManyHasAssociationsMixin<AssociatedModel, PrimaryKeyType>;
      set: BelongsToManySetAssociationsMixin<AssociatedModel, PrimaryKeyType>;
      add: BelongsToManyAddAssociationsMixin<AssociatedModel, PrimaryKeyType>;
      remove: BelongsToManyRemoveAssociationsMixin<
        AssociatedModel,
        PrimaryKeyType
      >;
    },
    Capitalize<PluralName>
  > &
    PostfixProperties<
      {
        has: BelongsToManyHasAssociationMixin<AssociatedModel, PrimaryKeyType>;
        add: BelongsToManyAddAssociationMixin<AssociatedModel, PrimaryKeyType>;
        remove: BelongsToManyRemoveAssociationMixin<
          AssociatedModel,
          PrimaryKeyType
        >;
        create: BelongsToManyCreateAssociationMixin<AssociatedModel>;
      },
      Capitalize<SingularName>
    >
>;
