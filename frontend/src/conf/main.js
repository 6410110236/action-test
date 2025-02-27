import { gql } from "@apollo/client";

const conf = {
  apiUrlPrefix: process.env.REACT_APP_API_URL || "http://localhost:1337", // Add default API URL
  loginEndpoint: "/api/auth/local", // Verify this endpoint matches your backend
  jwtUserEndpoint: "/api/users/me?populate=*",
  jwtSessionStorageKey: "auth.jwt",
  roleSessionStorageKey: "auth.role",
};

// GraphQL query สำหรับดึงข้อมูล garages
export const GET_GARAGES = gql`
  query Query {
    garages {
      Color
      Distance
      Description
      Manual
      Picture {
        url
      }
      Price
      RegisterDate
      SecondaryKey
      StatusBuying
      VehicleRegistrationTypes
      VehicleTaxExpirationDate
      Warranty
      model {
        ModelName
        GearType
        EnergySource
        Seats
        brand_car {
          BrandName
        }
      }
      documentId
    }
  }
`;

export const GET_BRANDS = gql`
  query Query {
    brands {
      BrandName
      documentId
    }
  }
`;

export const GET_ALL_BRANDS = gql`
  query Brands_connection {
    brands_connection(pagination: { limit: -1 }) {
      nodes {
        documentId
        BrandName
      }
    }
  }
`;

export const CREATE_NEW_BRAND = gql`
  mutation Mutation($data: BrandInput!) {
    createBrand(data: $data) {
      BrandName
    }
  }
`;

export const DELETE_BRAND = gql`
  mutation Mutation($documentId: ID!) {
    deleteBrand(documentId: $documentId) {
      documentId
    }
  }
`;

export const GET_MODELS_FROM_BRAND = gql`
  query Brand($documentId: ID!) {
    brand(documentId: $documentId) {
      models_connection {
        nodes {
          ModelName
          documentId
        }
      }
    }
  }
`;

export async function updateAtEntryCreationAction(
  formData,
  image,
  selectedModelId,
  selectCarId
) {
  try {
    // Handle image upload
    let imageId = ""; // Change this to store the image ID instead of URL
    if (image) {
      const imageData = new FormData();
      imageData.append("files", image);
      imageData.append("ref", "api:garage.picture"); // Make sure this refers to the correct model
      imageData.append("field", "Picture");

      const uploadResponse = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/upload`,
        {
          method: "POST",
          body: imageData,
        }
      );

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
    console.log(`${process.env.REACT_APP_BASE_URL}/api/garages/` + selectCarId);

    // Create entry request
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/garages/` + selectCarId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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

export const GET_CARS = gql`
  query Query($filters: GarageFiltersInput) {
    garages(filters: $filters) {
      Color
      Distance
      Description
      Manual
      Picture {
        url
      }
      Price
      RegisterDate
      SecondaryKey
      StatusBuying
      VehicleRegistrationTypes
      VehicleTaxExpirationDate
      Warranty
      model {
        ModelName
        GearType
        EnergySource
        Seats
        brand_car {
          BrandName
        }
      }
      documentId
    }
  }
`;

export const DELETE_CAR = gql`
  mutation DeleteGarage($documentId: ID!) {
    deleteGarage(documentId: $documentId) {
      documentId
    }
  }
`;

export const GET_USER = gql`
  query UsersPermissionsUser($documentId: ID!) {
    usersPermissionsUser(documentId: $documentId) {
      username
      email
      role {
        name
      }
      ContactNumber
    }
  }
`;

export async function uploadAtEntryCreationAction(
  formData,
  image,
  selectedModelId,
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

      const uploadResponse = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/upload`,
        {
          method: "POST",
          body: imageData,
        }
      );

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
        users_permissions_user: jwtSell,
        Picture: imageId, // Store the image ID instead of URL
      },
      status: "PUBLISHED",
    };

    // Create entry request
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/garages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEntry),
      }
    );

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

export default conf;
