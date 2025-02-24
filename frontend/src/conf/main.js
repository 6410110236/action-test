import { gql } from '@apollo/client';

const conf = {
    apiUrlPrefix: process.env.REACT_APP_API_URL || 'http://localhost:1337', // Add default API URL
    loginEndpoint: '/api/auth/local', // Verify this endpoint matches your backend
    jwtUserEndpoint: '/api/users/me?populate=*',
    jwtSessionStorageKey: 'auth.jwt',
    roleSessionStorageKey: 'auth.role'
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

export const MUTATE_TO_GARAGE = gql`
  mutation Mutation($data: GarageInput!, $status: PublicationStatus) {
  createGarage(data: $data, status: $status) {
    model {
      ModelName
      documentId
    }
    Color
    Description
    Distance
    VehicleRegistrationTypes
    Manual
    Warranty
    RegisterDate
    SecondaryKey
    VehicleTaxExpirationDate
    Price
    users_permissions_user {
      documentId
    }
  }
}
`
export const GET_CARS = gql`
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

export const DELETE_CAR = gql`
  mutation DeleteGarage($documentId: ID!) {
    deleteGarage(documentId: $documentId) {
      documentId
    }
  }
`;

export const GET_USER = gql`
  query UsersPermissionsUser {
  usersPermissionsUser(documentId:"s5zlmm3u7a6bgopyrd846aoy") {
    ContactNumber
    documentId
    username
    email
    Picture {
      url
    }
    role {
      name
    }
  }
}
`;


export default conf;