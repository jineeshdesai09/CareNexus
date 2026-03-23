/**
 * @jest-environment node
 */
import { GET } from '@/app/api/create-admin/route'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}))

describe('API Route /api/create-admin', () => {
  it('should return "Admin already exists" if an admin is found', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ Email: 'admin@test.com' })
    
    const response = await GET()
    const body = await response.json()
    
    expect(body.message).toBe('Admin already exists')
    expect(prisma.user.create).not.toHaveBeenCalled()
  })

  it('should create admin user if none exists', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null)
    
    const response = await GET()
    const body = await response.json()
    
    expect(body.message).toBe('Admin user created')
    expect(prisma.user.create).toHaveBeenCalled()
  })
})