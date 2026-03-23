/**
 * @jest-environment node
 */
import { createPatient } from '@/app/actions/patient'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    hospital: { findFirst: jest.fn() },
    patient: { 
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}))

jest.mock('@/app/lib/session', () => ({
  getSession: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

describe('Patient Actions - createPatient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if unauthorized', async () => {
    (getSession as jest.Mock).mockResolvedValue(null);
    const formData = new FormData();
    
    await expect(createPatient(formData)).rejects.toThrow('Unauthorized');
  });

  it('should create patient and redirect', async () => {
    (getSession as jest.Mock).mockResolvedValue(1);
    (prisma.hospital.findFirst as jest.Mock).mockResolvedValue({ HospitalID: 1, OpeningPatientNo: 1000 });
    (prisma.patient.findFirst as jest.Mock).mockResolvedValue(null); // No last patient
    
    const formData = new FormData();
    formData.append('PatientName', 'John Doe');
    formData.append('Gender', 'Male');
    formData.append('DOB', '1990-01-01');
    formData.append('MobileNo', '1234567890');
    
    await createPatient(formData);
    
    expect(prisma.patient.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        PatientName: 'John Doe',
        PatientNo: 1000, // From hospital opening patient no
      })
    }));
    
    expect(redirect).toHaveBeenCalledWith('/reception/patients/directory?success=1');
  });
})