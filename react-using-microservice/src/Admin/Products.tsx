import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Product } from "../Interfaces/Product";

const Products = () => {
    const [products, setProducts] = useState([]);


    const getProducts = async () => {
        const response = await fetch("http://localhost:8000/api/products");

        const data = await response.json();

        setProducts(data);
    }

    useEffect(() => {
        getProducts();
    }, []);


    const deleteProduct = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this product")) {
            const response = await fetch(`http://localhost:8000/api/products/${id}`, {
                method: "DELETE"
            });

            if (response.status === 200) {
                setProducts(products.filter((p: Product) => p.id !== id));
            }
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h2">Products</h1>
            </div>

            <Link to="/admin/products/create" className="btn btn-success my-2">Add Product</Link>
            <div className="table-responsive">
                <table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Image</th>
                            <th scope="col">Title</th>
                            <th scope="col">Likes</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((p: Product) => {
                                return (
                                    <tr key={p.id}>
                                        <td>{p.id}</td>
                                        <td><img src={p.image} alt="image description" height="200" /></td>
                                        <td>{p.title}</td>
                                        <td>{p.like}</td>
                                        <td>
                                            <Link to={`/admin/products/${p.id}/edit`} className="btn btn-primary">Edit</Link>
                                            <button className="btn btn-danger mx-2" onClick={() => deleteProduct(p.id)}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Products;
