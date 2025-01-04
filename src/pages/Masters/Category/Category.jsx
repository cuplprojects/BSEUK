import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ categoryName: '' });
  const [editCategory, setEditCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://localhost:7133/api/Categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error('Error fetching categories: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:7133/api/Categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newCategory, catID: 0 }),
      });

      if (!response.ok) throw new Error('Failed to add category');
      
      toast.success('Category added successfully!');
      fetchCategories();
      setNewCategory({ categoryName: '' });
    } catch (error) {
      toast.error('Error adding category: ' + error.message);
    }
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://localhost:7133/api/Categories/${editCategory.catID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editCategory),
      });

      if (!response.ok) throw new Error('Failed to update category');

      toast.success('Category updated successfully!');
      fetchCategories();
      setIsEditing(false);
      setEditCategory(null);
    } catch (error) {
      toast.error('Error updating category: ' + error.message);
    }
  };

  const handleDelete = async (catID) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`https://localhost:7133/api/Categories/${catID}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete category');

      toast.success('Category deleted successfully!');
      fetchCategories();
    } catch (error) {
      toast.error('Error deleting category: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>

      {/* Add Category Form */}
      {!isEditing && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={newCategory.categoryName}
              onChange={(e) => setNewCategory({ categoryName: e.target.value })}
              placeholder="Category Name"
              className="border p-2 rounded flex-grow"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Category
            </button>
          </div>
        </form>
      )}

      {/* Edit Category Form */}
      {isEditing && editCategory && (
        <form onSubmit={handleUpdate} className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={editCategory.categoryName}
              onChange={(e) =>
                setEditCategory({ ...editCategory, categoryName: e.target.value })
              }
              className="border p-2 rounded flex-grow"
              required
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditCategory(null);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Categories List */}
      <div className="bg-white shadow-md rounded">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Category Name</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.catID} className="border-b">
                <td className="px-6 py-4">{category.catID}</td>
                <td className="px-6 py-4">{category.categoryName}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(category)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.catID)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Category;