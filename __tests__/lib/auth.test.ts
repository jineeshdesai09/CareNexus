import { requireAdmin } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}))

jest.mock('@/app/lib/session', () => ({
  getSession: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

describe('Auth Helpers - requireAdmin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect if no session exists', async () => {
    (getSession as jest.Mock).mockResolvedValue(null);
    
    await requireAdmin();
    
    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('should redirect if user is not an admin', async () => {
    (getSession as jest.Mock).mockResolvedValue(1);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ UserID: 1, Role: 'DOCTOR' });
    
    await requireAdmin();
    
    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('should return user if user is an admin', async () => {
    const adminUser = { UserID: 1, Role: 'ADMIN' };
    (getSession as jest.Mock).mockResolvedValue(1);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(adminUser);
    
    const result = await requireAdmin();
    
    expect(result).toEqual(adminUser);
    expect(redirect).not.toHaveBeenCalled();
  });
})