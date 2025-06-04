"use server";

import sequelize from "@/db_connection";
import { DataTypes, Model } from "sequelize";

class Book extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public published_date!: Date;
  public author_id!: number;
  public author?: {
    id: number;
    name: string;
  };
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    description: {
      type: new DataTypes.TEXT(),
    },
    published_date: {
      type: new DataTypes.DATE(),
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "books",
    createdAt: "created_at",
    updatedAt: "updated_at",
    underscored: true,
  }
);

export default Book;
