import React, { useEffect, useState } from "react";
import {
  GET_ALL_CATEGORIES_CAR,
  CREATE_NEW_CATEGORY_CAR,
  DELETE_CATEGORY_CAR,
  UPDATE_CATEGORY_CAR,
} from "../../../api/main";
import { client } from "../../../api/apolloClient";
import { v4 as uuidv4 } from "uuid"; // Import uuid

function ConfigCategoryCar() {
  const [categories, setCategories] = useState([]);
  const [isCreatePopupVisible, setIsCreatePopupVisible] = useState(false);
  const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editedCategory, setEditedCategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    client
      .query({ query: GET_ALL_CATEGORIES_CAR })
      .then((response) => {
        setCategories(response.data.categoryCars_connection.nodes);
        console.log("response :", response);
        console.log("categories :", categories);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    try {
      const response = await client.mutate({
        mutation: CREATE_NEW_CATEGORY_CAR,
        variables: { data: { Category: newCategory } },
      });
      console.log("response :", response);
      if (response.data.createCategoryCar) {
        console.log("Category created:", response.data.createCategoryCar);
    
        setCategories((prevCategoryCar) => [
          ...prevCategoryCar,
          {
            Category: response.data.createCategoryCar.Category,
            documentId: response.data.createCategoryCar.documentId || uuidv4(), // Assign documentId or a new unique uuid if does not exist.
          },
        ]);
        // Reset form and close popup
        setNewCategory("");
        setIsCreatePopupVisible(false);
      } else {
        console.error("Failed to create category.");
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleRemoveCategory = (documentId) => {
    client
      .mutate({
        mutation: DELETE_CATEGORY_CAR,
        variables: { documentId },
      })
      .then((response) => {
        console.log(
          "✅ Category deleted:",
          response.data.deleteCategoryCar.documentId
        );
        setCategories(
          categories.filter((category) => category.documentId !== documentId)
        );
      });
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
    try {
      const response = await client.mutate({
        mutation: UPDATE_CATEGORY_CAR,
        variables: {
          documentId: selectedCategory.documentId,
          data: { Category: editedCategory },
        },
      });
      if (response.data.updateCategoryCar) {
        console.log("Category updated:", response.data.updateCategoryCar);

        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.documentId === selectedCategory.documentId
              ? { ...category, Category: editedCategory }
              : category
          )
        );
        // Reset form and close popup
        setIsEditPopupVisible(false);
        setSelectedCategory(null);
        setEditedCategory("");
      } else {
        console.error("Failed to update category.");
      }
    } catch (error) {
      console.error("Error updating category:", error);
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
            className="p-2 mb-2 items-center justify-center shadow-md rounded-md bg-blue-100 hover:bg-blue-200 transition-colors"
          >
            <div className="gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{category.Category}</span>

                  <button
                    className="p-1 hover:bg-gray-200 rounded-full"
                    onClick={() => {
                      handleRemoveCategory(category.documentId);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                  <button
                    className="p-1 hover:bg-gray-200 rounded-full"
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
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No categories available.</p>
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
            <h2 className="text-xl text-blue-600 font-bold mb-4">Edit Category</h2>
            {showWarning && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                ⚠️ Please enter a category.
              </div>
            )}
            <div>
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
