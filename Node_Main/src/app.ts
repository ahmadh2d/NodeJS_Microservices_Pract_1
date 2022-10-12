import express, { Request, Response } from "express";
import cors from "cors";
import { appDataSource } from "./data-source";
import amqp from "amqplib/callback_api";
import { Product } from "./entities/product";
import axios, { AxiosResponse } from 'axios';
// import { router as products } from "./routers/products";

appDataSource
    .initialize()
    .then((db) => {
        amqp.connect(
            "amqps://nguyioyw:lcWAk9aZUyTmxEK5fzq1AdWh6gFPeLvb@woodpecker.rmq.cloudamqp.com/nguyioyw",
            function (error0, connection) {
                if (error0) {
                    throw error0;
                }
                connection.createChannel(function (error1, channel) {
                    if (error1) {
                        throw error1;
                    }

                    channel.assertQueue("created_product", {durable: false});
                    channel.assertQueue("updated_product", {durable: false});
                    channel.assertQueue("deleted_product", {durable: false});

                    const app = express();

                    app.use(
                        cors({
                            origin: ["http://localhost:3000"],
                        })
                    );

                    app.use(express.json());

                    const productRepo = db.getMongoRepository(Product);

                    channel.consume("created_product", async (msg) => {
                        const eventProduct: Product = JSON.parse(msg.content.toString());

                        const product = new Product();
                        product.admin_id = parseInt(eventProduct.id);
                        product.title = eventProduct.title;
                        product.image = eventProduct.image;
                        product.like = eventProduct.like;

                        await productRepo.save(product);
                        console.log("Product created");
                    }, {noAck: true});
                    
                    channel.consume("updated_product", async (msg) => {
                        
                        const eventProduct: Product = JSON.parse(msg.content.toString());
                        let oldProduct = await productRepo.findOneBy({ admin_id: parseInt(eventProduct.id) });


                        productRepo.merge(oldProduct, {
                            title: eventProduct.title,
                            image: eventProduct.image,
                            like: eventProduct.like
                        });

                        await productRepo.save(oldProduct);

                        console.log("Product updated");
                    }, {noAck: true});
                    
                    channel.consume("deleted_product", async (msg) => {
                        
                        const productId: number = JSON.parse(msg.content.toString());

                        const result = await productRepo.delete({ admin_id: productId });

                        console.log("Product deleted " + result.affected);
                    }, {noAck: true});

                    app.get("/api/products", async (req: Request, res: Response) => {
                        const products = await productRepo.find();
                        return res.status(200).send(products);
                    });
                    
                    app.post("/api/products/:id/like", async (req: Request, res: Response) => {
                        const product = await productRepo.findOneBy(req.params.id);
                        
                        if (!product)
                            return res.status(404).send("Product of given id not found");
                        
                        let result: AxiosResponse;
                        try{
                            result = await axios.put(`http://localhost:8000/api/products/like/${product.admin_id}`, {});
                        }
                        catch(error) {
                            console.log(error);
                            return res.status(401).send("Failed! product not update");
                        }
                        
                        product.like +=1;
                        await productRepo.save(product);

                        res.status(200).send(product);
                    });

                    app.listen(8001, () =>
                        console.log("Listening on port 8001...")
                    );

                    process.on("beforeExit", () => {
                        console.log("Closing Connection...");
                        connection.close((err) => console.log("Failed to close amqp connection", err));
                    })
                });
            }
        );
    })
    .catch((error) =>
        console.log("Unable to connect to Type ORM with DB...\n", error)
    );
