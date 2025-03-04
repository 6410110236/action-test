import { gql } from "@apollo/client";
import config from "../config";
const conf = {
  apiUrlPrefix: config.serverUrlPrefix, // Add default API URL
  loginEndpoint: "/api/auth/local", // Verify this endpoint matches your backend
  jwtUserEndpoint: "/api/users/me?populate=*",
  jwtSessionStorageKey: "auth.jwt",
  roleSessionStorageKey: "auth.role",
  stripe: {
    publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
    successUrl: `${window.location.origin}/payment/success`,
    cancelUrl: `${window.location.origin}/payment/cancel`,
    currency: "thb",
  },
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

export const GET_SPECIFIC_CAR = gql`
  query Garages($documentId: ID!) {
  garage(documentId: $documentId) {
    Color
    Description
    Distance
    Manual
    Picture {
      url
      documentId
    }
    Price
    RegisterDate
    SecondaryKey
    StatusBuying
    VehicleRegistrationTypes
    VehicleTaxExpirationDate
    Warranty
    createdAt
    documentId
    model {
      Seats
      ModelName
      GearType
      EnergySource
      brand_car {
        BrandName
      }
      category_car {
        Category
      }
      createdAt
      documentId
      updatedAt
    }
    updatedAt
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

export const UPDATE_BRAND = gql`
  mutation Mutation($documentId: ID!, $data: BrandInput!) {
    updateBrand(documentId: $documentId, data: $data) {
      BrandName
    }
  }
`;

export const GET_ALL_CATEGORIES_CAR = gql`
  query Query {
    categoryCars_connection(pagination: { limit: -1 }) {
      nodes {
        Category
        documentId
      }
    }
  }
`;

export const CREATE_NEW_CATEGORY_CAR = gql`
  mutation Mutation($data: CategoryCarInput!) {
    createCategoryCar(data: $data) {
      Category
    }
  }
`;

export const DELETE_CATEGORY_CAR = gql`
  mutation Mutation($documentId: ID!) {
    deleteCategoryCar(documentId: $documentId) {
      documentId
    }
  }
`;

export const UPDATE_CATEGORY_CAR = gql`
  mutation Mutation($documentId: ID!, $data: CategoryCarInput!) {
    updateCategoryCar(documentId: $documentId, data: $data) {
      Category
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
      Picture {
      url
      }

      role {
        name
      }
      ContactNumber
    }
  }
`;


export const CREATE_PAYMENT_INTENT = gql`
  mutation CreatePaymentIntent($amount: Int!, $carId: ID!) {
    createPaymentIntent(amount: $amount, carId: $carId) {
      clientSecret
      paymentIntentId
    }
  }
`;

export default conf;
