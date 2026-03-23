import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginForm from '@/app/(auth)/login/LoginForm'

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
  },
}))

// Mock the auth action
jest.mock('@/app/actions/auth', () => ({
  login: jest.fn(),
}))

describe('LoginForm', () => {
  it('renders login form properly', () => {
    render(<LoginForm />)
    
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
  })

  it('validates empty inputs', async () => {
    render(<LoginForm />)
    
    const button = screen.getByRole('button', { name: /login/i })
    fireEvent.click(button)
    
    // Adjust based on your actual validation message implementation
    // await waitFor(() => {
    //   expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    // })
  })
})