import prisma from '@/lib/db';

export async function getPatients({ q = '', p = 1, n = 10 }: { q?: string, p?: number, n?: number }) {
  const total = await prisma.patient.count({
    where: {
      OR: [{ firstName: { contains: q } }, { lastName: { contains: q } }, { email: { contains: q } }]
    }
  });

  const patients = await prisma.patient.findMany({
    where: {
      OR: [{ firstName: { contains: q } }, { lastName: { contains: q } }, { email: { contains: q } }]
    },
    skip: (p - 1) * n,
    take: n
  });

  const pages = Math.ceil(total / n);
  const nextPage = p < pages ? p + 1 : null;
  const prevPage = p > 1 ? p - 1 : null;

  return {
    patients,
    total,
    pages,
    nextPage,
    prevPage,
  };
}