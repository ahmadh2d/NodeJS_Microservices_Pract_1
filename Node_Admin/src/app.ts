import express, { Request, Response } from "express";
import cors from "cors";
import { appDataSource } from "./data-source";
import { router as products } from "./routers/products";
import amqp from "amqplib/callback_api";

export let iChannel: amqp.Channel;

amqp.connect(
    "amqps://nguyioyw:lcWAk9aZUyTmxEK5fzq1AdWh6gFPeLvb@woodpecker.rmq.cloudamqp.com/nguyioyw",
    function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            appDataSource
                .initialize()
                .then(() => {
                    const app = express();

                    app.use(
                        cors({
                            origin: ["http://localhost:3000"],
                        })
                    );

                    app.use(express.json());

                    app.use("/api/products", products);
                    iChannel = channel;

                    app.listen(8000, () =>
                        console.log("Listening on port 8000...")
                    );
                })
                .catch((error) =>
                    console.log(
                        "Unable to connect to Type ORM with DB...\n",
                        error
                    )
                );

            process.on("beforeExit", () => {
                console.log("Closing Connection...");
                connection.close((err) =>
                    console.log("Failed to close amqp connection", err)
                );
            });
        });
    }
);
