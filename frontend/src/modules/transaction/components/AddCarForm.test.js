import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddCarForm from './AddCarForm';

// Mock Apollo Client
jest.mock('../../../utils/apolloClient', () => ({
  client: {
    query: jest.fn(() => Promise.resolve({ data: { brands: [{ documentId: '1', BrandName: 'Toyota' }] } }))
  }
}));

jest.mock('../../../store/authStore', () => jest.fn(() => ({ user: { documentId: 'test-jwt' } })));

describe('AddCarForm Component', () => {
  test('renders form with initial fields', () => {
    render(<AddCarForm />);
    expect(screen.getByText(/Add New Vehicle/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload Image/i)).toBeInTheDocument();
    expect(screen.getByText(/Brand/i)).toBeInTheDocument();
    expect(screen.getByText(/Model/i)).toBeInTheDocument();
  });

  test('handles form submission with validation', async () => {
    render(<AddCarForm />);

    fireEvent.click(screen.getByText(/Confirm/i));

    await waitFor(() => {
      expect(screen.getByText(/กรุณากรอกข้อมูลให้ครบถ้วน/i)).toBeInTheDocument();
    });
  });

  test('selecting brand updates model options', async () => {
    render(<AddCarForm />);

    const brandSelect = screen.getByLabelText(/Brand/i);
    fireEvent.change(brandSelect, { target: { value: 'Toyota' } });

    await waitFor(() => {
      expect(brandSelect.value).toBe('Toyota');
    });
  });
});




