import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const ProductForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const [products, setProducts] = useState([]); // Store product list
  const [editId, setEditId] = useState(null); // Track product being edited
  const [msg, setMsg] = useState("");

  // Fetch products from backend on load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://67768c0e12a55a9a7d0c1cac.mockapi.io/crud/Product");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  // Handle form submission for create or update
  const onSubmit = async (data) => {
    if (editId) {
      // Update product
      try {
        const response = await axios.put(`https://67768c0e12a55a9a7d0c1cac.mockapi.io/crud/Product/${editId}`, data);
        setProducts((prev) => prev.map((p) => (p.id === editId ? response.data : p)));
        setMsg("Product updated successfully!");
        setEditId(null);
      } catch (error) {
        console.error("Failed to update product", error);
        setMsg("Failed to update the product.");
      }
    } else {
      // Create new product
      try {
        const response = await axios.post("https://67768c0e12a55a9a7d0c1cac.mockapi.io/crud/Product", data);
        setProducts((prev) => [...prev, response.data]);
        setMsg("Product created successfully!");
      } catch (error) {
        console.error("Failed to create product", error);
        setMsg("Failed to create the product.");
      }
    }
    reset();
  };

  // Handle edit button click
  const handleEdit = (product) => {
    setEditId(product.id);
    setValue("name", product.name);
    setValue("price", product.price);
    setValue("category", product.category);
    setValue("material", product.material);
    setValue("description", product.description);
    setValue("quantity", product.quantity);
    setValue("isAvailable", product.isAvailable);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://67768c0e12a55a9a7d0c1cac.mockapi.io/crud/Product/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setMsg("Product deleted successfully!");
      alert("Product deleted successfully!")
    } catch (error) {
      console.error("Failed to delete product", error);
      setMsg("Failed to delete the product.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Manage Products</h2>
      {msg && <div className={`alert ${msg.includes("success") ? "alert-success" : "alert-danger"}`}>{msg}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded bg-light">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Product Name
          </label>
          <input
            id="name"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            {...register("name", { required: "Product Name is required." })}
          />
          {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            id="price"
            type="number"
            className={`form-control ${errors.price ? "is-invalid" : ""}`}
            {...register("price", {
              required: "Price is required.",
              min: { value: 1, message: "Price must be greater than 0." },
            })}
          />
          {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            id="category"
            className={`form-select ${errors.category ? "is-invalid" : ""}`}
            {...register("category", { required: "Category is required." })}
          >
            <option value="">Select a category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home">Home</option>
          </select>
          {errors.category && <div className="invalid-feedback">{errors.category.message}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="material" className="form-label">
            Material
          </label>
          <input
            id="material"
            className={`form-control ${errors.material ? "is-invalid" : ""}`}
            {...register("material", { required: "Material is required." })}
          />
          {errors.material && <div className="invalid-feedback">{errors.material.message}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            rows="3"
            {...register("description", {
              required: "Description is required.",
              minLength: { value: 10, message: "Description must be at least 10 characters long." },
            })}
          ></textarea>
          {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
            {...register("quantity", {
              required: "Quantity is required.",
              min: { value: 1, message: "Quantity must be at least 1." },
            })}
          />
          {errors.quantity && <div className="invalid-feedback">{errors.quantity.message}</div>}
        </div>

        <div className="mb-3 form-check">
          <input
            id="isAvailable"
            type="checkbox"
            className="form-check-input"
            {...register("isAvailable")}
          />
          <label htmlFor="isAvailable" className="form-check-label">
            Is Available
          </label>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          {editId ? "Update Product" : "Add Product"}
        </button>
      </form>

      <h3 className="mt-5">Product List</h3>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.category}</td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => handleEdit(product)}>
                  <FaEdit />
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(product.id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductForm;