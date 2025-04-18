import conf from "./main";

export async function uploadAtEntryCreationAction(
  formData,
  image,
  selectedModelId,
  jwtSell,
  idSeller
) {
  try {
    // Handle image upload
    let imageId = ""; // Change this to store the image ID instead of URL
    if (image) {
      const imageData = new FormData();
      imageData.append("files", image);
      imageData.append("ref", "api:garage.picture"); // Make sure this refers to the correct model
      imageData.append("field", "Picture");

      const uploadResponse = await fetch(`${conf.apiUrlPrefix}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtSell}`, // เพิ่ม JWT เข้าไปใน Header
        },
        body: imageData,
      });

      const uploadResult = await uploadResponse.json();
      if (uploadResult.error) {
        throw new Error(uploadResult.error.message);
      }

      imageId = uploadResult[0]?.id; // Get the image ID instead of URL
    }

    // Prepare data for entry creation
    const newEntry = {
      data: {
        model: selectedModelId,
        Color: formData.color,
        Description: formData.description,
        Distance: parseInt(formData.distance, 10) || 0,
        VehicleRegistrationTypes: formData.vehicleRegistrationType,
        Manual: formData.manual,
        Warranty: formData.warranty,
        RegisterDate: formData.registerDate,
        SecondaryKey: parseInt(formData.secondaryKey, 10) || 0,
        VehicleTaxExpirationDate: formData.vehicleTaxExpirationDate,
        Price: parseInt(formData.price, 10) || 0,
        users_permissions_user: idSeller,
        Picture: imageId, // Store the image ID instead of URL
      },
      status: "PUBLISHED",
    };

    // Create entry request
    const response = await fetch(`${conf.apiUrlPrefix}/api/garages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtSell}`,
      },
      body: JSON.stringify(newEntry),
    });

    const result = await response.json();
    if (response.status !== 201 || result.error) {
      console.log("New Entry:", newEntry);
      throw new Error(result.error?.message || "Failed to create entry.");
    }

    return {
      success: "Entry created successfully!",
      error: null,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      success: null,
      error: error.message,
    };
  }
}

export async function updateAtEntryCreationAction(
  formData,
  image,
  selectedModelId,
  selectCarId,
  jwtSell
) {
  try {
    // Handle image upload
    let imageId = ""; // Change this to store the image ID instead of URL
    if (image) {
      const imageData = new FormData();
      imageData.append("files", image);
      imageData.append("ref", "api:garage.picture"); // Make sure this refers to the correct model
      imageData.append("field", "Picture");

      const uploadResponse = await fetch(`${conf.apiUrlPrefix}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtSell}`, // เพิ่ม JWT เข้าไปใน Header
        },
        body: imageData,
      });

      const uploadResult = await uploadResponse.json();
      if (uploadResult.error) {
        throw new Error(uploadResult.error.message);
      }

      imageId = uploadResult[0]?.id; // Get the image ID instead of URL
    }

    // Prepare data for entry creation
    const newEntry = {
      data: {
        model: selectedModelId,
        Color: formData.color,
        Description: formData.description,
        Distance: parseInt(formData.distance, 10) || 0,
        VehicleRegistrationTypes: formData.vehicleRegistrationType,
        Manual: formData.manual,
        Warranty: formData.warranty,
        RegisterDate: formData.registerDate,
        SecondaryKey: parseInt(formData.secondaryKey, 10) || 0,
        VehicleTaxExpirationDate: formData.vehicleTaxExpirationDate,
        Price: parseInt(formData.price, 10) || 0,
        Picture: imageId, // Store the image ID instead of URL
      },
      status: "PUBLISHED",
    };

    console.log("newEntry : ", newEntry);
    console.log(`${conf.apiUrlPrefix}/api/garages/` + selectCarId);

    // Create entry request
    const response = await fetch(
      `${conf.apiUrlPrefix}/api/garages/` + selectCarId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtSell}`,
        },
        body: JSON.stringify(newEntry),
      }
    );

    const result = await response.json();
    if (response.status !== 200 || result.error) {
      console.log("New Entry:", newEntry);
      throw new Error(result.error?.message || "Failed to create entry.");
    }

    return {
      success: "Entry created successfully!",
      error: null,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      success: null,
      error: error.message,
    };
  }
}

export async function uploadBrandAtEntryCreationAction(
  newBrand,
  image,
  jwtSell
) {
  try {
    // Handle image upload
    let imageId = ""; // Change this to store the image ID instead of URL
    if (image) {
      const imageData = new FormData();
      imageData.append("files", image);
      imageData.append("ref", "api:garage.picture"); // Make sure this refers to the correct model
      imageData.append("field", "Picture");

      const uploadResponse = await fetch(`${conf.apiUrlPrefix}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtSell}`, // เพิ่ม JWT เข้าไปใน Header
        },
        body: imageData,
      });

      const uploadResult = await uploadResponse.json();
      if (uploadResult.error) {
        throw new Error(uploadResult.error.message);
      }

      imageId = uploadResult[0]?.id; // Get the image ID instead of URL
    }

    // Prepare data for entry creation
    const newEntry = {
      data: {
        BrandName: newBrand,
        Logo: imageId, // Store the image ID instead of URL
      },
      status: "PUBLISHED",
    };

    // Create entry request
    const response = await fetch(`${conf.apiUrlPrefix}/api/brands`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtSell}`,
      },
      body: JSON.stringify(newEntry),
    });

    const result = await response.json();
    if (response.status !== 201 || result.error) {
      console.log("New Entry:", newEntry);
      throw new Error(result.error?.message || "Failed to create entry.");
    }

    return {
      success: "Entry created successfully!",
      error: null,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      success: null,
      error: error.message,
    };
  }
}

export async function updateฺฺBrandAtEntryCreationAction(
  newBrand,
  image,
  selectBrandId,
  jwtSell
) {
  try {
    // Handle image upload
    let imageId = ""; // Change this to store the image ID instead of URL
    if (image) {
      const imageData = new FormData();
      imageData.append("files", image);
      imageData.append("ref", "api:garage.picture"); // Make sure this refers to the correct model
      imageData.append("field", "Picture");

      const uploadResponse = await fetch(`${conf.apiUrlPrefix}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtSell}`, // เพิ่ม JWT เข้าไปใน Header
        },
        body: imageData,
      });

      const uploadResult = await uploadResponse.json();
      if (uploadResult.error) {
        throw new Error(uploadResult.error.message);
      }

      imageId = uploadResult[0]?.id; // Get the image ID instead of URL
    }

    // Prepare data for entry creation
    const newEntry = {
      data: {
        BrandName: newBrand,
        Logo: imageId, // Store the image ID instead of URL
      },
      status: "PUBLISHED",
    };

    console.log("newEntry : ", newEntry);
    console.log(`${conf.apiUrlPrefix}/api/brands/` + selectBrandId);

    // Create entry request
    const response = await fetch(
      `${conf.apiUrlPrefix}/api/brands/` + selectBrandId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtSell}`,
        },
        body: JSON.stringify(newEntry),
      }
    );

    const result = await response.json();
    if (response.status !== 200 || result.error) {
      console.log("New Entry:", newEntry);
      throw new Error(result.error?.message || "Failed to create entry.");
    }

    return {
      success: "Entry created successfully!",
      error: null,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      success: null,
      error: error.message,
    };
  }
}

export async function uploadCategoryAtEntryCreationAction(
  newCategory,
  image,
  jwtSell
) {
  try {
    // Handle image upload
    let imageId = ""; // Change this to store the image ID instead of URL
    if (image) {
      const imageData = new FormData();
      imageData.append("files", image);
      imageData.append("ref", "api:garage.picture"); // Make sure this refers to the correct model
      imageData.append("field", "Picture");

      const uploadResponse = await fetch(`${conf.apiUrlPrefix}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtSell}`, // เพิ่ม JWT เข้าไปใน Header
        },
        body: imageData,
      });

      const uploadResult = await uploadResponse.json();
      if (uploadResult.error) {
        throw new Error(uploadResult.error.message);
      }

      imageId = uploadResult[0]?.id; // Get the image ID instead of URL
    }

    // Prepare data for entry creation
    const newEntry = {
      data: {
        Category: newCategory,
        Icon: imageId, // Store the image ID instead of URL
      },
      status: "PUBLISHED",
    };

    // Create entry request
    const response = await fetch(`${conf.apiUrlPrefix}/api/category-cars`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtSell}`,
      },
      body: JSON.stringify(newEntry),
    });

    const result = await response.json();
    if (response.status !== 201 || result.error) {
      console.log("New Entry:", newEntry);
      throw new Error(result.error?.message || "Failed to create entry.");
    }

    return {
      success: "Entry created successfully!",
      error: null,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      success: null,
      error: error.message,
    };
  }
}

export async function updateฺฺCategoryAtEntryCreationAction(
  newCategory,
  image,
  selectCategoryId,
  jwtSell
) {
  try {
    // Handle image upload
    let imageId = ""; // Change this to store the image ID instead of URL
    if (image) {
      const imageData = new FormData();
      imageData.append("files", image);
      imageData.append("ref", "api:garage.picture"); // Make sure this refers to the correct model
      imageData.append("field", "Picture");

      const uploadResponse = await fetch(`${conf.apiUrlPrefix}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtSell}`, // เพิ่ม JWT เข้าไปใน Header
        },
        body: imageData,
      });

      const uploadResult = await uploadResponse.json();
      if (uploadResult.error) {
        throw new Error(uploadResult.error.message);
      }

      imageId = uploadResult[0]?.id; // Get the image ID instead of URL
    }

    // Prepare data for entry creation
    const newEntry = {
      data: {
        Category: newCategory,
        Icon: imageId, // Store the image ID instead of URL
      },
      status: "PUBLISHED",
    };

    console.log("newEntry : ", newEntry);
    console.log(`${conf.apiUrlPrefix}/api/category-cars/` + selectCategoryId);

    // Create entry request
    const response = await fetch(
      `${conf.apiUrlPrefix}/api/category-cars/` + selectCategoryId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtSell}`,
        },
        body: JSON.stringify(newEntry),
      }
    );

    const result = await response.json();
    if (response.status !== 200 || result.error) {
      console.log("New Entry:", newEntry);
      throw new Error(result.error?.message || "Failed to create entry.");
    }

    return {
      success: "Entry created successfully!",
      error: null,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      success: null,
      error: error.message,
    };
  }
}