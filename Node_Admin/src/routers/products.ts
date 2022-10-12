import express, { Request, Response } from "express";
import { appDataSource } from "../data-source";
import { Product } from "../entities/product";
import {iChannel} from '../app.js';

export const router = express.Router();

router.get("", async (req: Request, res: Response) => {
    const productRepo = appDataSource.getRepository(Product);
    const products = await productRepo.find();
    res.status(200).send(products);
});

router.get("/:id", async (req: Request, res: Response) => {
    const productRepo = appDataSource.getRepository(Product);
    const product = await productRepo.findOneBy({ id: Number(req.params.id) });

    if (!product)
        return res.status(404).send("Product not found");

    res.status(200).send(product);
});

router.post("", async (req: Request, res: Response) => {
    const productRepo = appDataSource.getRepository(Product);
    
    const product = productRepo.create(req.body);

    const result = await productRepo.save(product);

    iChannel.sendToQueue("created_product", Buffer.from(JSON.stringify(result)));

    res.status(200).send(result);
});

router.put("/:id", async (req: Request, res: Response) => {
    const productRepo = appDataSource.getRepository(Product);
    
    let product = await productRepo.findOneBy({id: Number(req.params.id)});

    if (!product)
        return res.status(404).send("Product with given id not found");

    product = productRepo.merge(product, req.body)

    const result = await productRepo.save(product);

    iChannel.sendToQueue("updated_product", Buffer.from(JSON.stringify(result)));

    res.status(200).send(result);
});

router.delete("/:id", async (req: Request, res: Response) => {
    const productRepo = appDataSource.getRepository(Product);

    let product = await productRepo.findOneBy({id: Number(req.params.id)});

    if (!product)
        return res.status(404).send("Product with given id not found");

    const result = await productRepo.delete(product);

    iChannel.sendToQueue("deleted_product", Buffer.from(req.params.id));

    res.status(200).send(product);
});

router.put("/like/:id", async (req: Request, res: Response) => {
    const productRepo = appDataSource.getRepository(Product);
    
    let product = await productRepo.findOneBy({id: Number(req.params.id)});

    if (!product)
        return res.status(404).send("Product with given id not found");

    product.like += 1;

    const result = await productRepo.save(product);

    res.status(200).send(result);
});