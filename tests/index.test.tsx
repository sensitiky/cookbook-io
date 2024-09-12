import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Index from '@/app/index';
import { useAuth } from '@/hooks/useContext';

// Mock the useAuth hook
jest.mock('@/hooks/useContext', () => ({
  useAuth: jest.fn(),
}));

describe('Index', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<Index />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByTestId('Login')).toBeTruthy();
    expect(getByTestId("Don't have an account?")).toBeTruthy();
  });

  it('updates email and password inputs correctly', () => {
    const { getByPlaceholderText } = render(<Index />);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('calls handleLogin with correct parameters', async () => {
    const { getByPlaceholderText, getByTestId } = render(<Index />);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByTestId('Login');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('handles login error correctly', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Login failed'));
    const { getByPlaceholderText, getByTestId } = render(<Index />);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByTestId('Login');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(console.error).toHaveBeenCalledWith(
        'Login failed',
        expect.any(Error)
      );
    });
  });
});
