import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "./entities/product";

export const appDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "1234",
    database: "yt_node_ms_admin",
    entities: [Product],
    synchronize: true,
    logging: true
})
