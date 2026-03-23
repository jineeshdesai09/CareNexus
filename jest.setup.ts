import '@testing-library/jest-dom'
import React from 'react'

// Polyfill Request, Response, fetch etc. for JSDOM
// Node 25 has these as globals, but JSDOM might hide them or provide its own incomplete ones
if (typeof global.Request === 'undefined') {
  // @ts-ignore
  global.Request = globalThis.Request
  // @ts-ignore
  global.Response = globalThis.Response
  // @ts-ignore
  global.Headers = globalThis.Headers
  // @ts-ignore
  global.fetch = globalThis.fetch
  // @ts-ignore
  global.ReadableStream = globalThis.ReadableStream
  // @ts-ignore
  global.WritableStream = globalThis.WritableStream
  // @ts-ignore
  global.TransformStream = globalThis.TransformStream
}

// Mocking Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  redirect: jest.fn(),
}))

// Mock Next.js actions/headers
jest.mock('next/headers', () => ({
  cookies: () => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  }),
}))

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Eye: () => React.createElement('div', { 'data-testid': 'eye-icon' }),
  EyeOff: () => React.createElement('div', { 'data-testid': 'eye-off-icon' }),
}))