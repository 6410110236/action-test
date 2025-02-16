"use client"

import { useState } from "react"
import { Upload } from "lucide-react"

const Alert = ({ children }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
    {children}
  </div>
)

function AddCarForm() {
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [image, setImage] = useState(null)
  const [showWarning, setShowWarning] = useState(false)
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    gear: "",
    gasoline: "",
    seats: "",
    color: "",
    description: "",
    distance: "",
    vehicleRegistrationType: "",
    manual: "",
    warranty: "",
    registerDate: "",
    secondaryKey: "",
    vehicleTaxExpirationDate: "",
  })

  const resetForm = () => {
    setFormData({
      brand: "",
      model: "",
      gear: "",
      gasoline: "",
      seats: "",
      color: "",
      description: "",
      distance: "",
      vehicleRegistrationType: "",
      manual: "",
      warranty: "",
      registerDate: "",
      secondaryKey: "",
      vehicleTaxExpirationDate: "",
    })
    setImage(null)
    setShowWarning(false)
  }

  const handleButtonClick = () => {
    setIsPopupVisible(true)
  }

  const handleClosePopup = () => {
    resetForm()
    setIsPopupVisible(false)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
    console.log(e.target.files[0])
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    setShowWarning(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Check if any field has data
    const hasData = Object.values(formData).some((value) => value !== "") || image !== null

    if (!hasData) {
      setShowWarning(true)
    } else {
      console.log("Form Data:", formData)
      handleClosePopup()
    }
  }

  return (
    <div>
      <button
        onClick={handleButtonClick}
        className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600"
      >
        ADD
      </button>

      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl text-blue-600 font-bold mb-6">Add New Vehicle</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {showWarning && (
                <Alert>
                  <p>No data Alert</p>
                </Alert>
              )}

              <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 text-center bg-blue-50 relative">
                {image ? (
                  <img
                    src={image || "/placeholder.svg"}
                    alt="Uploaded"
                    className="w-full h-32 object-cover rounded-md"
                  />
                ) : (
                  <label htmlFor="imageUpload" className="flex flex-col items-center cursor-pointer">
                    <Upload className="w-8 h-8 text-blue-500 mb-2" />
                    <span className="text-blue-500">Click to upload image</span>
                  </label>
                )}
                <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  "brand",
                  "model",
                  "gear",
                  "gasoline",
                  "seats",
                  "color",
                  "description",
                  "distance",
                  "vehicleRegistrationType",
                  "manual",
                  "warranty",
                  "registerDate",
                  "secondaryKey",
                  "vehicleTaxExpirationDate",
                ].map((field, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700">
                      {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </label>
                    <input
                      type={field.includes("Date") ? "date" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={`Enter ${field.toLowerCase()}`}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={handleClosePopup}
                  className="px-6 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddCarForm

