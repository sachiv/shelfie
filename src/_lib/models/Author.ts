"use server";

import sequelize from "@/db_connection";
import { DataTypes, Model } from "sequelize";

class Author extends Model {
  public id!: number;
  public name!: string;
  public biography!: string;
  public born_date!: Date;
  public image?: string;
  public created_by_id?: string;
}

Author.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    biography: {
      type: new DataTypes.TEXT(),
    },
    born_date: {
      type: new DataTypes.DATE(),
    },
    image: {
      type: new DataTypes.STRING(),
      allowNull: true,
    },
    created_by_id: {
      type: new DataTypes.STRING(),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "authors",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Author;
