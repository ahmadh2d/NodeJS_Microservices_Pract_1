import { PropsWithRef, SyntheticEvent, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

const EditProduct = (props: PropsWithRef<any>) => {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [isRedirect, setIsRedirect] = useState(false);

    const { id } = useParams();

    const getProduct = async () => {
        console.log(id);
        const response = await fetch(`http://localhost:8000/api/products/${id}`);

        const product = await response.json();

        // setProducts(data);

        setTitle(product.title);
        setImage(product.image);
    }

    useEffect(() => {
        getProduct();
    }, []);

    const addProduct = async (e: SyntheticEvent) => {
        e.preventDefault();

        console.log(title, image);
        const response = await fetch(`http://localhost:8000/api/products/${id}`, {
            method: "PUT",
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
              <h1 className="h2">Edit Products</h1>
            </div>

            <form onSubmit={(e) => addProduct(e)}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" defaultValue={title} className="form-control" name="title" id="title" onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="image">Image</label>
                    <input type="text" defaultValue={image}
                        className="form-control" name="image" id="image" onChange={(e) => setImage(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-outline-secondary">Update</button>
            </form>
        </main>
    );
};

export default EditProduct;
