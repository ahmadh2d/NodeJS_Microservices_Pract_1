import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "./entities/product";

export const appDataSource = new DataSource({
    type: "mongodb",
    host: "localhost",
    port: 27017,
    username: "",
    password: "",
    database: "yt_node_ms_main",
    entities: [Product],
    synchronize: true,
    logging: true
});
