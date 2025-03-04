import React, { useEffect, useState } from "react";
import {
  GET_ALL_CATEGORIES_CAR,
  DELETE_CATEGORY_CAR,
  UPDATE_CATEGORY_CAR,
} from "../../../api/main";
import { client } from "../../../api/apolloClient";
import {
  uploadCategoryAtEntryCreationAction,
  updateฺฺCategoryAtEntryCreationAction,
} from "../../../api/uploadimage";
import useAuthStore from "../../../logic/authStore";

function ConfigCategoryCar() {
  const [categories, setCategories] = useState([]);
  const [isCreatePopupVisible, setIsCreatePopupVisible] = useState(false);
  const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editedCategory, setEditedCategory] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  // New state for delete confirmation
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const jwtSell = useAuthStore((state) => state.jwt);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
    console.log("handleChange :", file);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    client
      .query({ query: GET_ALL_CATEGORIES_CAR, fetchPolicy: "network-only" })
      .then((response) => {
        setCategories(response.data.categoryCars_connection.nodes);
        console.log("response :", response);
        console.log("categories :", categories);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!newCategory.trim()) {
      setShowWarning(true);
      return;
    }

    setShowWarning(false);

    try {
      const response = await uploadCategoryAtEntryCreationAction(
        newCategory,
        image,
        jwtSell
      );
      console.log("response :", response);
      fetchCategories();
      setIsCreatePopupVisible(false);
      setNewCategory("");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error creating brand:", error);
    }
  };

  const handleDelete = (documentId) => {
    // Show delete confirmation popup
    setCategoryToDelete(documentId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    // Use Apollo Client to call the mutation
    client
      .mutate({
        mutation: DELETE_CATEGORY_CAR,
        variables: { documentId: categoryToDelete },
        context: {
          headers: {
            Authorization: `Bearer ${jwtSell}`, // ✅ Send JWT in the Header
          },
        },
      })
      .then((response) => {
        console.log(
          "✅ Category deleted:",
          response.data.deleteCategoryCar.documentId
        );
        setCategories(
          categories.filter(
            (category) => category.documentId !== categoryToDelete
          )
        ); // Update state after deletion
        setShowDeleteConfirmation(false); // Close popup
        setCategoryToDelete(null);
      })
      .catch((error) => {
        console.error("❌ Error deleting Category:", error);
        setShowDeleteConfirmation(false);
        setCategoryToDelete(null);
      });
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setCategoryToDelete(null);
  };

  const handleOpenEditPopup = (category) => {
    setSelectedCategory(category);
    setEditedCategory(category.Category);
    setIsEditPopupVisible(true);
  };

  const handleUpdateCategory = async () => {
    if (!editedCategory.trim()) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    const { success, error } = await updateฺฺCategoryAtEntryCreationAction(
      editedCategory,
      image,
      selectedCategory.documentId,
      jwtSell
    );
    fetchCategories();

    if (error) {
      console.error("Error:", error);
    } else {
      console.log(success);
      setIsEditPopupVisible(false);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">Category Management</h2>
      <p>
        Manage your car categories here. You can create, update, and delete
        categories.
      </p>
      <div className="my-4">
        <button
          onClick={() => setIsCreatePopupVisible(true)}
          className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600"
        >
          Create New Category
        </button>
      </div>
      {categories.length > 0 ? (
        categories.map((category) => (
          <div
            key={category.documentId}
            className="p-2 mb-2 items-center shadow-md rounded-md bg-blue-100 hover:bg-blue-200 transition-colors flex justify-between"
          >
            {/* Category Name */}
            <div className="flex-1">
              <span className="font-medium">{category.Category}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={() => handleOpenEditPopup(category)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 20h9" fill="black" />
                  <path
                    d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
                    fill="black"
                  />
                </svg>
              </button>

              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={() => {
                  handleDelete(category.documentId);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No categories available.</p>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">
              Are you sure you want to delete this category?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Popup */}
      {isCreatePopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-1/3">
            <button
              onClick={() => setIsCreatePopupVisible(false)}
              className="absolute top-4 right-4 bg-red-500 text-white text-xl font-bold w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-red-600 transition-all duration-300"
            >
              &times;
            </button>
            <h2 className="text-xl text-blue-600 font-bold mb-4">
              Create New Category
            </h2>

            {showWarning && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                ⚠️ Please enter a category name.
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
              <label
                htmlFor="Category"
                className="block text-sm font-medium text-gray-700"
              >
                Category:
              </label>
              <input
                type="text"
                id="Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setIsCreatePopupVisible(false)}
                className="px-6 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCategory}
                className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Popup */}
      {isEditPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-1/3">
            <button
              onClick={() => setIsEditPopupVisible(false)}
              className="absolute top-4 right-4 bg-red-500 text-white text-xl font-bold w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-red-600 transition-all duration-300"
            >
              &times;
            </button>
            <h2 className="text-xl text-blue-600 font-bold mb-4">
              Edit Category
            </h2>
            {showWarning && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                ⚠️ Please enter a category.
              </div>
            )}
            <div>
            <label className="block text-sm font-medium text-gray-700">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
              <label
                htmlFor="editCategory"
                className="block text-sm font-medium text-gray-700"
              >
                Category:
              </label>
              <input
                type="text"
                id="editCategory"
                value={editedCategory}
                onChange={(e) => setEditedCategory(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setIsEditPopupVisible(false)}
                className="px-6 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCategory}
                className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfigCategoryCar;
