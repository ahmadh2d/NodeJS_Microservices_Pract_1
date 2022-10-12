import React, { useEffect, useState } from "react";
import { Product } from "../Interfaces/Product";

const Main = () => {
    const [products, setProducts] = useState([] as Product[]);


    const getProducts = async () => {
        const response = await fetch("http://localhost:8001/api/products");

        const data = await response.json();

        setProducts(data);
    }

    const likeProduct = async (id: number) => {
        const response = await fetch(`http://localhost:8001/api/products/${id}/like`, {
            method: "POST"
        });

        if (response.status === 200) {
            setProducts(products.map((product: Product) => {
                if (product.id === id)
                    product.like++;
                
                return product;
            }));
        }
    }

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <main>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Dashboard</h1>
            </div>

            <div className="album py-5 bg-light">
                <div className="container">
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                        {
                            products.map((product: Product) => {
                                return (
                                    <div className="col" key={product.id}>
                                        <div className="card shadow-sm">
                                            <img className="bd-placeholder-img card-img-top"
                                                width="100%" height="225" src={product.image} alt={product.title} />

                                            <div className="card-body">
                                                <p className="card-text">
                                                    {product.title}
                                                </p>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="btn-group">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-secondary"
                                                            onClick={() => likeProduct(product.id)}
                                                        >
                                                            Like
                                                        </button>
                                                    </div>
                                                    <small className="text-muted">{product.like} Likes</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }


                    </div>
                </div>
            </div>
        </main>
    );
};

export default Main;
