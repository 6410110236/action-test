import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import SellUser from './SellUser';
import { GET_CARS, DELETE_CAR } from '../../api/main';
import useAuthStore from '../../logic/authStore';

// Mock the useAuthStore
jest.mock('../../logic/authStore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the console.error to avoid cluttering the test output
console.error = jest.fn();

describe('SellUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCars = [
    {
      documentId: '1',
      Price: 10000,
      model: { ModelName: 'Model 1', brand_car: { BrandName: 'Brand 1' } },
      Picture: [{ url: '/image1.jpg' }],
    },
    {
      documentId: '2',
      Price: 20000,
      model: { ModelName: 'Model 2', brand_car: { BrandName: 'Brand 2' } },
      Picture: [{ url: '/image2.jpg' }],
    },
  ];

  const mockJwt = 'test-jwt';
  const mockUserId = 'test-user-id';

  const mocks = [
    {
      request: {
        query: GET_CARS,
        variables: {
          filters: {
            users_permissions_user: {
              documentId: {
                eq: mockUserId,
              },
            },
          },
        },
      },
      result: {
        data: {
          garages: mockCars,
        },
      },
    },
    {
      request: {
        query: DELETE_CAR,
        variables: { documentId: '1' },
        context: {
          headers: {
            Authorization: `Bearer ${mockJwt}`,
          },
        },
      },
      result: {
        data: {
          deleteGarage: {
            documentId: '1',
          },
        },
      },
    },
  ];

  const errorMocks = [
    {
      request: {
        query: GET_CARS,
         variables: {
          filters: {
            users_permissions_user: {
              documentId: {
                eq: mockUserId,
              },
            },
          },
        },
      },
      error: new Error('An error occurred'),
    },
      {
        request: {
          query: DELETE_CAR,
          variables: { documentId: '1' },
          context: {
            headers: {
              Authorization: `Bearer ${mockJwt}`,
            },
          },
        },
        error: new Error('An error occurred'),
      },
  ];

  it('should render loading state initially', async () => {
    useAuthStore.mockReturnValue({ jwt: mockJwt, user: { documentId: mockUserId } });
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <SellUser />
      </MockedProvider>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument;
  });
  
  it('should render cars when data is fetched', async () => {
    useAuthStore.mockReturnValue({ jwt: mockJwt, user: { documentId: mockUserId } });
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SellUser />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Model 1')).toBeInTheDocument();
      expect(screen.getByText('Model 2')).toBeInTheDocument();
      expect(screen.getByText('Brand 1')).toBeInTheDocument();
      expect(screen.getByText('Brand 2')).toBeInTheDocument();
      expect(screen.getByText(/\$10,000/)).toBeInTheDocument();
      expect(screen.getByText(/\$20,000/)).toBeInTheDocument();
      expect(screen.getByText('You have 2 item(s) in your cart')).toBeInTheDocument();

    });
  });

  it('should show "No cars available." when there are no cars', async () => {
    useAuthStore.mockReturnValue({ jwt: mockJwt, user: { documentId: mockUserId } });
    const noCarMocks = [
      {
        request: {
          query: GET_CARS,
          variables: {
            filters: {
              users_permissions_user: {
                documentId: {
                  eq: mockUserId,
                },
              },
            },
          },
        },
        result: {
          data: {
            garages: [],
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={noCarMocks} addTypename={false}>
        <SellUser />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No cars available.')).toBeInTheDocument();
    });
  });

  it('should handle error when fetching cars', async () => {
     useAuthStore.mockReturnValue({ jwt: mockJwt, user: { documentId: mockUserId } });
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <SellUser />
      </MockedProvider>
    );

     await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "❌ Error fetching data:",
        new Error("An error occurred")
      );
    });
  });

  it('should delete a car when confirmDelete is called', async () => {
    useAuthStore.mockReturnValue({ jwt: mockJwt, user: { documentId: mockUserId } });
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SellUser />
      </MockedProvider>
    );

    await waitFor(async () => {
      const deleteButton = screen.getAllByRole('button')[1]; 
      fireEvent.click(deleteButton);

      // Wait for the confirmation modal to appear
      await waitFor(() => {
          expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: 'Delete' });
      fireEvent.click(confirmButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Model 1')).not.toBeInTheDocument();
      });
      expect(screen.getByText('You have 1 item(s) in your cart')).toBeInTheDocument();
    });
  });

  it('should not delete a car when cancelDelete is called', async () => {
    useAuthStore.mockReturnValue({ jwt: mockJwt, user: { documentId: mockUserId } });
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
        <SellUser />
        </MockedProvider>
    );
    
    await waitFor(async () => {
      const deleteButton = screen.getAllByRole('button')[1]; // delete button Model 1
      fireEvent.click(deleteButton);

      // Wait for the confirmation modal to appear
        await waitFor(() => {
            expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
        });

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
        });
        expect(screen.getByText('Model 1')).toBeInTheDocument();
      });
  });

   it('should handle error when delete car', async () => {
    useAuthStore.mockReturnValue({ jwt: mockJwt, user: { documentId: mockUserId } });
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <SellUser />
      </MockedProvider>
    );

    await waitFor(async () => {
        const deleteButton = screen.getAllByRole('button')[1];
        fireEvent.click(deleteButton);
         await waitFor(() => {
          expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
      });
        const confirmButton = screen.getByRole('button', { name: 'Delete' });
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith(
              "❌ Error deleting car:",
              new Error("An error occurred")
            );
          expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
        });
    });
   });
});
