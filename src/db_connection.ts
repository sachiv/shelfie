import pg from "pg";
import { Sequelize } from "sequelize";
import { SequelizeOptions } from "sequelize-typescript";
import { options } from "../db/config/config.mjs";

const dbOptions: SequelizeOptions = {
  ...options,
  dialect: "postgres",
  dialectModule: pg,
};

const sequelize = new Sequelize(dbOptions);

export default sequelize;
