import React, { SyntheticEvent, useState } from "react";
import { Navigate } from "react-router-dom";

const CreateProduct = () => {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [isRedirect, setIsRedirect] = useState(false);

    const addProduct = async (e: SyntheticEvent) => {
        e.preventDefault();

        console.log(title, image);
        const response = await fetch("http://localhost:8000/api/products", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                title,
                image
            })
        });

        if (response.status === 200)
            setIsRedirect(true);
    }

    if(isRedirect)
        return <Navigate to="/admin/products" />;

    return (
        <main>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h2">Add Product</h1>
            </div>

            <form onSubmit={(e) => addProduct(e)}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" className="form-control" name="title" id="title" onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="image">Image</label>
                    <input type="text" className="form-control" name="image" id="image" onChange={(e) => setImage(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-outline-secondary">Save</button>
            </form>
        </main>
    );
};

export default CreateProduct;
