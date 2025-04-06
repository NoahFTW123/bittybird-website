import { useState, useEffect } from "react";
import "../css/admin.css"
import axios from "axios";
import CreateFolderAndUploadPhotos from "../components/Developer/uploadPhotos";

const API_URL = import.meta.env.VITE_API_URL;

const AdminPage = () => {
    const [action, setAction] = useState("");
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [productData, setProductData] = useState({
        name: "",
        productFolder: "",
        description: "",
        price: "",
        tags: [],
        materials: [],
        size: [],
        personalize: "",
        thumbnail: "",
        photos: [],
    });
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/products`);
            if (!response.ok) throw new Error("Failed to fetch products");

            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error retrieving products", error);
        }
    }

    const handleActionChange = (e) => {
        setAction(e.target.value);
        setSelectedProduct("");
        setProductData({
            name: "",
            productFolder: "",
            description: "",
            price: "",
            tags: [],
            materials: [],
            size: [],
            personalize: "",
            thumbnail: "",
            photos: [],
        });
    }

    const handleProductSelection = async (e) => {
        const productId = e.target.value;
        setSelectedProduct(productId);

        try {
            const response = await fetch(`${API_URL}/products/${productId}`);
            if (!response.ok) throw new Error("Failed to fetch products");

            const data = await response.json();
            setProductData(data);
        } catch (error) {
            console.error("Error retrieving product details", error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "tags" || name === "materials" || name === "size" || name === "photos") {
            setProductData((prevData) => ({
                ...prevData,
                [name]: value.split(",").map((item) => item.trim()), // Convert to array
            }));
        } else {
            setProductData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    }

    const handleAddProduct = async () => {
        try {
            await axios.post(`${API_URL}/products/`, productData);
            alert("Added product");
            fetchProducts();
        } catch (error) {
            console.error("Error adding product", error);
        }
    }

    const handleUpdateProduct = async () => {
        try {
            await axios.put(`${API_URL}/products/${selectedProduct}`, productData);
            alert("Updated product");
            fetchProducts();
        } catch (error) {
            console.error("Error updating product", error);
        }
    }

    const handleDeleteProduct = async () => {
        if (!confirmDelete) {
            alert("Are you sure you want to delete this product?");
            return;
        }

        try {
            await axios.delete(`${API_URL}/products/${selectedProduct}`);
            alert("Deleting product");
            fetchProducts();
            setConfirmDelete(false);
            setSelectedProduct("");
        } catch (error) {
            console.error("Error deleting product", error);
        }
    }

    return (
        <div className="admin-page-body">
            <h1>Admin - Product Management</h1>

            <select className="option-select" value={action} onChange={handleActionChange}>
                <option value="">Select Action</option>
                <option value="photos">Add Photos</option>
                <option value="add">Add Product</option>
                <option value="update">Update Product</option>
                <option value="delete">Delete Product</option>
            </select>

            {action === "photos" && (
                <CreateFolderAndUploadPhotos/>
            )}

            {action === "add" && (
                <div>
                    <h2>Add Products</h2>
                    <input type="textarea" name="name" placeholder="Product Name" value={productData.name}
                           onChange={handleChange}/>
                    <input type="textarea" name="storageFolder" placeholder="Photo Storage Folder" value={productData.name}
                           onChange={handleChange}/>
                    <input type="textarea" name="description" placeholder="Product Description"
                           value={productData.description}
                           onChange={handleChange}/>
                    <input type="textarea" name="price" placeholder="Product Price" value={productData.price}
                           onChange={handleChange}/>
                    <input type="textarea" name="tags" placeholder="Product Tags" value={productData.tags}
                           onChange={handleChange}/>
                    <input type="textarea" name="materials" placeholder="Product Materials"
                           value={productData.materials}
                           onChange={handleChange}/>
                    <input type="textarea" name="size" placeholder="Product Size" value={productData.size}
                           onChange={handleChange}/>
                    <input type="textarea" name="personalize" placeholder="Enter Personalization details or N/A"
                           value={productData.personalize}
                           onChange={handleChange}/>
                    <input type="textarea" name="thumbnail" placeholder="Product Thumbnail"
                           value={productData.thumbnail}
                           onChange={handleChange}/>
                    <input type="textarea" name="photos" placeholder="Product Photos" value={productData.photos}
                           onChange={handleChange}/>
                    <button className="btn" onClick={handleAddProduct}>Add Product</button>
                </div>
            )}

            {action === "update" && (
                <div>
                    <h2>Update Products</h2>
                    <select className="option-select" value={selectedProduct} onChange={handleProductSelection}>
                        <option value="">Select Product</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                    </select>

                    {selectedProduct && (
                        <>
                            <input type="textarea" name="name" value={productData.name} onChange={handleChange}/>
                            <input type="textarea" name="storageFolder" value={productData.storageFolder}
                                   onChange={handleChange}/>
                            <input type="textarea" name="description" value={productData.description}
                                   onChange={handleChange}/>
                            <input type="textarea" name="price" value={productData.price} onChange={handleChange}/>
                            <input type="textarea" name="tags" value={productData.tags} onChange={handleChange}/>
                            <input type="textarea" name="materials" value={productData.materials}
                                   onChange={handleChange}/>
                            <input type="textarea" name="size" value={productData.size} onChange={handleChange}/>
                            <input type="textarea" name="thumbnail" value={productData.thumbnail}
                                   onChange={handleChange}/>
                            <input type="textarea" name="photos" value={productData.photos} onChange={handleChange}/>
                            <button className="btn" onClick={handleUpdateProduct}>Update Product</button>
                        </>
                    )}
                </div>
            )}

            {action === "delete" && (
                <div>
                    <h2>Delete Products</h2>
                    <select className="option-select" value={selectedProduct} onChange={handleProductSelection}>
                        <option value="">Select Product</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                    </select>

                    {selectedProduct && (
                        <>
                            <button onClick={() => setConfirmDelete(true)}>Confirm Delete</button>

                            {confirmDelete && (
                                <div>
                                    <p>Are you sure you want to delete this product?</p>
                                    <button className="btn" onClick={handleDeleteProduct}>Yes, Delete</button>
                                    <button className="btn" onClick={() => setConfirmDelete(false)}>Cancel</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default AdminPage;
