import React, { useEffect, useState } from "react";
import {
  GET_ALL_BRANDS,
  CREATE_NEW_BRAND,
  DELETE_BRAND,
  UPDATE_BRAND,
} from "../../../../conf/main";
import { client } from "../../../../utils/apolloClient";
import { v4 as uuidv4 } from "uuid"; // Import uuid

function ConfigBrand() {
  const [brands, setBrands] = useState([]);
  const [isCreatePopupVisible, setIsCreatePopupVisible] = useState(false);
  const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null); // State to hold the brand being edited
  const [editedBrandName, setEditedBrandName] = useState("");

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = () => {
    client
      .query({ query: GET_ALL_BRANDS })
      .then((response) => {
        setBrands(response.data.brands_connection.nodes);
        console.log("response :", response);
        console.log("brands :", brands);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCreateBrand = async () => {
    if (!newBrandName.trim()) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    try {
      const response = await client.mutate({
        mutation: CREATE_NEW_BRAND,
        variables: { data: { BrandName: newBrandName } },
      });
      console.log("response :", response);
      if (response.data.createBrand) {
        console.log("Brand created:", response.data.createBrand);
        // Refresh the brand list
        setBrands((prevBrands) => [
          ...prevBrands,
          {
            BrandName: response.data.createBrand.BrandName,
            documentId: response.data.createBrand.documentId || uuidv4(), // Assign documentId or a new unique uuid if does not exist.
          },
        ]);
        // Reset form and close popup
        setNewBrandName("");
        setIsCreatePopupVisible(false);
      } else {
        console.error("Failed to create brand.");
      }
    } catch (error) {
      console.error("Error creating brand:", error);
    }
  };

  const handleRemoveBrand = (documentId) => {
    client
      .mutate({
        mutation: DELETE_BRAND,
        variables: { documentId },
      })
      .then((response) => {
        console.log("✅ Brand deleted:", response.data.deleteBrand.documentId);
        setBrands(brands.filter((brand) => brand.documentId !== documentId));
      });
  };

  const handleOpenEditPopup = (brand) => {
    setSelectedBrand(brand);
    setEditedBrandName(brand.BrandName);
    setIsEditPopupVisible(true);
  };

  const handleUpdateBrand = async () => {
    if (!editedBrandName.trim()) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    try {
      const response = await client.mutate({
        mutation: UPDATE_BRAND,
        variables: {
          documentId: selectedBrand.documentId,
          data: { BrandName: editedBrandName },
        },
      });
      if (response.data.updateBrand) {
        console.log("Brand updated:", response.data.updateBrand);
        // Update the brand list
        setBrands((prevBrands) =>
          prevBrands.map((brand) =>
            brand.documentId === selectedBrand.documentId
              ? { ...brand, BrandName: editedBrandName }
              : brand
          )
        );
        // Reset form and close popup
        setIsEditPopupVisible(false);
        setSelectedBrand(null);
        setEditedBrandName("");
      } else {
        console.error("Failed to update brand.");
      }
    } catch (error) {
      console.error("Error updating brand:", error);
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
            className="p-2 mb-2 items-center justify-center shadow-md rounded-md bg-blue-100 hover:bg-blue-200 transition-colors"
          >
            <div className="gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{brand.BrandName}</span>

                  <button
                    className="p-1 hover:bg-gray-200 rounded-full"
                    onClick={() => {
                      handleRemoveBrand(brand.documentId);
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
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No brands available.</p>
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
            <h2 className="text-xl text-blue-600 font-bold mb-4">
              Edit Brand
            </h2>
            {showWarning && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                ⚠️ Please enter a brand name.
              </div>
            )}
            <div>
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
