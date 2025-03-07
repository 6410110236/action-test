import { client } from '../../../api/apolloClient';
import { GET_ALL_BRANDS, DELETE_BRAND, UPDATE_BRAND } from '../../../api/main';
import { uploadBrandAtEntryCreationAction, updateฺฺBrandAtEntryCreationAction } from '../../../api/uploadimage';
import useAuthStore from '../../../logic/authStore';

import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ConfigBrand from './ConfigBrand';


// Mock the Apollo Client
jest.mock('../../../api/apolloClient', () => ({
  client: {
    query: jest.fn(),
    mutate: jest.fn(),
  },
}));

// Mock the api functions
jest.mock('../../../api/uploadimage', () => ({
  uploadBrandAtEntryCreationAction: jest.fn(),
  updateฺฺBrandAtEntryCreationAction: jest.fn(),
}));

// Mock the useAuthStore
jest.mock('../../../logic/authStore', () => {
  const actual = jest.requireActual('../../../logic/authStore');
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(() => ({
        jwt: 'mockedJwt',
    })),
  };
});

describe('ConfigBrand', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockBrands = [
    { documentId: '1', BrandName: 'Brand 1' },
    { documentId: '2', BrandName: 'Brand 2' },
  ];

  it('renders without crashing', () => {
    client.query.mockResolvedValue({ data: { brands_connection: { nodes: [] } } });
    render(<ConfigBrand />);
    expect(screen.getByText('Brand Management')).toBeInTheDocument();
  });

  it('fetches and displays brands', async () => {
    client.query.mockResolvedValue({ data: { brands_connection: { nodes: mockBrands } } });
    render(<ConfigBrand />);

    await waitFor(() => {
      expect(screen.getByText('Brand 1')).toBeInTheDocument();
      expect(screen.getByText('Brand 2')).toBeInTheDocument();
    });
  });

  it('displays "No brands available." when there are no brands', async () => {
    client.query.mockResolvedValue({ data: { brands_connection: { nodes: [] } } });
    render(<ConfigBrand />);

    await waitFor(() => {
      expect(screen.getByText('No brands available.')).toBeInTheDocument();
    });
  });

  it('opens the create brand popup', async () => {
    client.query.mockResolvedValue({ data: { brands_connection: { nodes: [] } } });
    render(<ConfigBrand />);

    const createButton = screen.getByText('Create New Brand');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Create New Brand')).toBeInTheDocument();
    });
  });

  it('creates a new brand', async () => {
    client.query.mockResolvedValue({ data: { brands_connection: { nodes: [] } } });
    uploadBrandAtEntryCreationAction.mockResolvedValue({ success: true });
    client.query.mockResolvedValueOnce({ data: { brands_connection: { nodes: [] } } }).mockResolvedValueOnce({data: { brands_connection: { nodes: mockBrands } }});
    render(<ConfigBrand />);

    fireEvent.click(screen.getByText('Create New Brand'));
    fireEvent.change(screen.getByLabelText('Brand Name:'), { target: { value: 'New Brand' } });
    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(uploadBrandAtEntryCreationAction).toHaveBeenCalledWith(
        'New Brand',
        null,
        'mockedJwt'
      );
    });
    await waitFor(() => {
      expect(client.query).toHaveBeenCalledTimes(2);
    })
    await waitFor(() => {
      expect(screen.queryByText('Create New Brand')).not.toBeInTheDocument();
    });
  });

  it('shows a warning when creating a brand with an empty name', async () => {
    client.query.mockResolvedValue({ data: { brands_connection: { nodes: [] } } });
    render(<ConfigBrand />);

    fireEvent.click(screen.getByText('Create New Brand'));
    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(screen.getByText('⚠️ Please enter a brand name.')).toBeInTheDocument();
    });
  });

  it('opens the edit brand popup', async () => {
    client.query.mockResolvedValue({ data: { brands_connection: { nodes: mockBrands } } });
    render(<ConfigBrand />);

    await waitFor(() => {
        const editButton = screen.getAllByRole('button')[1];
        fireEvent.click(editButton);
    });
    await waitFor(() => {
      expect(screen.getByText('Edit Brand')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Brand 1')).toBeInTheDocument();
    });
  });

    it('update a brand', async () => {
        client.query.mockResolvedValue({ data: { brands_connection: { nodes: mockBrands } } });
        updateฺฺBrandAtEntryCreationAction.mockResolvedValue({ success: true });
        client.query.mockResolvedValueOnce({ data: { brands_connection: { nodes: mockBrands } } }).mockResolvedValueOnce({data: { brands_connection: { nodes: mockBrands } }});
        render(<ConfigBrand />);

        await waitFor(() => {
          const editButton = screen.getAllByRole('button')[1];
          fireEvent.click(editButton);
        });
        await waitFor(() => {
          fireEvent.change(screen.getByLabelText('Brand Name:'), { target: { value: 'Updated Brand' } });
          fireEvent.click(screen.getByText('Update'));
        });
        await waitFor(() => {
          expect(updateฺฺBrandAtEntryCreationAction).toHaveBeenCalledWith(
            'Updated Brand',
            null,
            '1',
            'mockedJwt'
          );
        });
        await waitFor(() => {
            expect(client.query).toHaveBeenCalledTimes(3);
          })
        await waitFor(() => {
            expect(screen.queryByText('Edit Brand')).not.toBeInTheDocument();
        });
      });

      it('shows a warning when update a brand with an empty name', async () => {
        client.query.mockResolvedValue({ data: { brands_connection: { nodes: mockBrands } } });
        render(<ConfigBrand />);
    
        await waitFor(() => {
          const editButton = screen.getAllByRole('button')[1];
          fireEvent.click(editButton);
        });
        await waitFor(() => {
          fireEvent.change(screen.getByLabelText('Brand Name:'), { target: { value: '' } });
          fireEvent.click(screen.getByText('Update'));
        });
    
        await waitFor(() => {
          expect(screen.getByText('⚠️ Please enter a brand name.')).toBeInTheDocument();
        });
      });

  it('opens the delete confirmation popup', async () => {
    client.query.mockResolvedValue({ data: { brands_connection: { nodes: mockBrands } } });
    render(<ConfigBrand />);

    await waitFor(() => {
      const deleteButton = screen.getAllByRole('button')[2];
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to delete this brand?')).toBeInTheDocument();
    });
  });

  it('deletes a brand', async () => {
    client.query.mockResolvedValue({ data: { brands_connection: { nodes: mockBrands } } });
    client.mutate.mockResolvedValue({ data: { deleteBrand: { documentId: '1' } } });
    render(<ConfigBrand />);

    await waitFor(() => {
        const deleteButton = screen.getAllByRole('button')[2];
        fireEvent.click(deleteButton);
      });
    await waitFor(() => {
      fireEvent.click(screen.getByText('Delete'));
    });

    await waitFor(() => {
      expect(client.mutate).toHaveBeenCalledWith({
        mutation: DELETE_BRAND,
        variables: { documentId: '1' },
        context: { headers: { Authorization: `Bearer mockedJwt` } },
      });
    });
    await waitFor(() => {
      expect(screen.queryByText('Brand 1')).not.toBeInTheDocument();
    });
  });

  it('cancels the delete operation', async () => {
    client.query.mockResolvedValue({ data: { brands_connection: { nodes: mockBrands } } });
    client.mutate.mockResolvedValue({ data: { deleteBrand: { documentId: '1' } } });
    render(<ConfigBrand />);

    await waitFor(() => {
        const deleteButton = screen.getAllByRole('button')[2];
        fireEvent.click(deleteButton);
      });
    await waitFor(() => {
      fireEvent.click(screen.getByText('Cancel'));
    });

    await waitFor(() => {
      expect(screen.getByText('Brand 1')).toBeInTheDocument();
      expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
    });
  });
});
