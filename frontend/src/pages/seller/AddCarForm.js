import { useState, useEffect } from "react";
import { client } from "../../api/apolloClient";
import {
  GET_BRANDS,
  GET_MODELS_FROM_BRAND,
} from "../../api/main";
import { uploadAtEntryCreationAction } from "../../api/uploadimage";
import useAuthStore from "../../logic/authStore";
import { Import, ImportIcon } from "lucide-react";

const object_cars = {
  brand: "",
  model: "",
  color: "",
  description: "",
  distance: "",
  vehicleRegistrationType: "",
  manual: "",
  warranty: "",
  registerDate: "",
  secondaryKey: "",
  vehicleTaxExpirationDate: "",
  price: "",
};

function AddCarForm() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [formData, setFormData] = useState(object_cars);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const jwtSell = useAuthStore((state) => state.user.documentId);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
    console.log("handleChange :", file);
  };

  const resetForm = () => {
    setFormData(object_cars);
    setShowWarning(false);
  };

  useEffect(() => {
    client
      .query({ query: GET_BRANDS })
      .then((response) => {
        setBrands(response.data.brands);
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedBrandId) {
      client
        .query({
          query: GET_MODELS_FROM_BRAND,
          variables: { documentId: selectedBrandId },
        })
        .then((response) => {
          setModels(response.data.brand.models_connection.nodes);
        })
        .catch((error) => {
          console.error("Error fetching models:", error);
        });
    }
  }, [selectedBrandId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setShowWarning(false);
  };

  const handleBrandChange = (e) => {
    const selectedBrandName = e.target.value;
    const selectedBrand = brands.find(
      (brand) => brand.BrandName === selectedBrandName
    );

    if (selectedBrand) {
      setSelectedBrandId(selectedBrand.documentId);
    }

    setFormData({
      ...formData,
      brand: selectedBrandName,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = ["brand", "model", "price"];
    const isFormEmpty = requiredFields.some((field) => !formData[field]);

    if (isFormEmpty) {
      setShowWarning(true);
      return;
    }

    const selectedModel = models.find(
      (model) => model.ModelName === formData.model
    );
    if (!selectedModel) {
      setShowWarning(true);
      return;
    }

    const { success, error } = await uploadAtEntryCreationAction(
      formData,
      image,
      selectedModel.documentId,
      jwtSell
    );

    if (error) {
      console.error("Error:", error);
      setShowWarning(true);
    } else {
      console.log(success);
      setIsPopupVisible(false);
      resetForm();
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsPopupVisible(true)}
        className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600"
      >
        ADD
      </button>

      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-[1000px] max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setIsPopupVisible(false)}
              className="absolute top-4 right-4 bg-red-500 text-white text-xl font-bold w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-red-600 transition-all duration-300"
            >
              &times;
            </button>
            <h2 className="text-xl text-blue-600 font-bold mb-6">
              Add New Vehicle
            </h2>

            {showWarning && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                ⚠️ กรุณากรอกข้อมูลให้ครบถ้วนก่อนเพิ่มรถยนต์ (Brand, Model,
                Price)
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
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
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleBrandChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a brand</option>
                    {brands.map((brand) => (
                      <option key={brand.documentId} value={brand.BrandName}>
                        {brand.BrandName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Model
                  </label>
                  <select
                    name="model"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    disabled={!selectedBrandId}
                  >
                    <option value="">Select a model</option>
                    {models.map((model) => (
                      <option key={model.documentId} value={model.ModelName}>
                        {model.ModelName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Distance
                </label>
                <input
                  type="number"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle Registration Type
                </label>
                <input
                  type="text"
                  name="vehicleRegistrationType"
                  value={formData.vehicleRegistrationType}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Manual
                </label>
                <input
                  type="text"
                  name="manual"
                  value={formData.manual}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Warranty
                </label>
                <input
                  type="text"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Register Date
                </label>
                <input
                  type="date"
                  name="registerDate"
                  value={formData.registerDate}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Secondary Key
                </label>
                <input
                  type="text"
                  name="secondaryKey"
                  value={formData.secondaryKey}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle Tax Expiration Date
                </label>
                <input
                  type="date"
                  name="vehicleTaxExpirationDate"
                  value={formData.vehicleTaxExpirationDate}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsPopupVisible(false)}
                  className="px-6 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-blue-600"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddCarForm;
