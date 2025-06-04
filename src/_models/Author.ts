import sequelize from "@/db_connection";
import { DataTypes, Model } from "sequelize";

class Author extends Model {
  public id!: number;
  public name!: string;
  public biography!: string;
  public born_date!: Date;
}

Author.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
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
  },
  {
    sequelize,
    tableName: "authors",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Author;
