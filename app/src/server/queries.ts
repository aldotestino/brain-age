'use server';

import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function getPatients({ q = '', p = 1, n = 10 }: { q?: string, p?: number, n?: number }) {

  let query: Prisma.PatientWhereInput;
  // check if q ha a space it might be for first name and last name
  const [fn, ln] = q.split(' ');

  if (fn && ln) {
    query = {
      AND: [{ firstName: { contains: fn, mode: 'insensitive' } }, { lastName: { contains: ln, mode: 'insensitive' } }]
    };
  } else {
    query = {
      OR: [{ firstName: { contains: q, mode: 'insensitive' } }, { lastName: { contains: q, mode: 'insensitive' } }, { email: { contains: q, mode: 'insensitive' } }]
    };
  }

  const total = await prisma.patient.count({
    where: query
  });

  const patients = await prisma.patient.findMany({
    where: query,
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