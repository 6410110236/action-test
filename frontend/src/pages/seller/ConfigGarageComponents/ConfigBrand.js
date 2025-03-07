import React, { useEffect, useState } from "react";
import { GET_ALL_BRANDS, DELETE_BRAND, UPDATE_BRAND } from "../../../api/main";
import { client } from "../../../api/apolloClient";
import { uploadBrandAtEntryCreationAction, updateฺฺBrandAtEntryCreationAction } from "../../../api/uploadimage";
import useAuthStore from "../../../logic/authStore";

function ConfigBrand() {
  const [brands, setBrands] = useState([]);
  const [isCreatePopupVisible, setIsCreatePopupVisible] = useState(false);
  const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null); // State to hold the brand being edited
  const [editedBrandName, setEditedBrandName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  // New state for delete confirmation
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
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
    fetchBrands();
  }, []);

  const fetchBrands = () => {
    client
      .query({ query: GET_ALL_BRANDS, fetchPolicy: "network-only" })
      .then((response) => {
        setBrands(response.data.brands_connection.nodes);
        console.log("response :", response);
        console.log("brands :", brands);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCreateBrand = async (e) => {
    e.preventDefault();

    if (!newBrandName.trim()) {
      setShowWarning(true);
      return;
    }

    setShowWarning(false);

    try {
      const response = await uploadBrandAtEntryCreationAction(
        newBrandName,
        image,
        jwtSell
      );
      console.log("response :", response);
      fetchBrands();
      setIsCreatePopupVisible(false);
      setNewBrandName("");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error creating brand:", error);
    }
  };

  const handleDelete = (documentId) => {
    // Show delete confirmation popup
    setBrandToDelete(documentId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    // Use Apollo Client to call the mutation
    client
      .mutate({
        mutation: DELETE_BRAND,
        variables: { documentId: brandToDelete },
        context: {
          headers: {
            Authorization: `Bearer ${jwtSell}`, // ✅ Send JWT in the Header
          },
        },
      })
      .then((response) => {
        console.log("✅ Brand deleted:", response.data.deleteBrand.documentId);
        setBrands(brands.filter((brand) => brand.documentId !== brandToDelete)); // Update state after deletion
        setShowDeleteConfirmation(false); // Close popup
        setBrandToDelete(null);
      })
      .catch((error) => {
        console.error("❌ Error deleting brand:", error);
        setShowDeleteConfirmation(false);
        setBrandToDelete(null);
      });
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setBrandToDelete(null);
  };

  const handleOpenEditPopup = (brand) => {
    setSelectedBrand(brand);
    setEditedBrandName(brand.BrandName);
    setIsEditPopupVisible(true);
  };

  const handleUpdateBrand = async (e) => {
    e.preventDefault();

    if (!editedBrandName.trim()) {
      setShowWarning(true);
      return;
    }

    setShowWarning(false);
    const { success, error } = await updateฺฺBrandAtEntryCreationAction(
          editedBrandName,
          image,
          selectedBrand.documentId,
          jwtSell
        );
        fetchBrands();
    
        if (error) {
          console.error("Error:", error);
        } else {
          console.log(success);
          setIsEditPopupVisible(false);
        }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">Brand Management</h2>
      <p>
        Manage your car brands here. You can create, update, and delete brands.
      </p>
      <div className="my-4">
        {" "}
        {/* Added a div with my-4 for margin */}
        <button
          onClick={() => setIsCreatePopupVisible(true)}
          className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600"
        >
          Create New Brand
        </button>
      </div>
      {brands.length > 0 ? (
        brands.map((brand) => (
          <div
            key={brand.documentId}
            className="p-2 mb-2 items-center shadow-md rounded-md bg-blue-100 hover:bg-blue-200 transition-colors flex justify-between" // Changed: flex and justify-between
          >
            {/* Brand Name */}
            <div className="flex-1">
              {" "}
              {/* Changed: Add flex-1 */}
              <span className="font-medium">{brand.BrandName}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {" "}
              {/* Changed: flex and gap-2 */}
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={() => handleOpenEditPopup(brand)}
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
                  handleDelete(brand.documentId);
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
        <p>No brands available.</p>
      )}
      {/* Delete Confirmation Popup */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this brand?</p>
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
              Create New Brand
            </h2>

            {showWarning && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                ⚠️ Please enter a brand name.
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
                htmlFor="brandName"
                className="block text-sm font-medium text-gray-700"
              >
                Brand Name:
              </label>
              <input
                type="text"
                id="brandName"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
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
                onClick={handleCreateBrand}
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
            <h2 className="text-xl text-blue-600 font-bold mb-4">Edit Brand</h2>
            {showWarning && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                ⚠️ Please enter a brand name.
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
                htmlFor="editBrandName"
                className="block text-sm font-medium text-gray-700"
              >
                Brand Name:
              </label>
              <input
                type="text"
                id="editBrandName"
                value={editedBrandName}
                onChange={(e) => setEditedBrandName(e.target.value)}
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
                onClick={handleUpdateBrand}
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

export default ConfigBrand;
