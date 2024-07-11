'use server';

import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';
import { differenceInMinutes, formatDistanceToNow } from 'date-fns';
import { notFound } from 'next/navigation';

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

export async function getPatient(id: string) {

  const parsedId = parseInt(id, 10);

  const patient = await prisma.patient.findUnique({
    where: { id: parsedId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      data: true,
      predictions: {
        select: {
          id: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (!patient) {
    notFound();
  }

  const now = new Date();

  return {
    ...patient,
    predictions: patient.predictions.map(p => ({
      id: p.id,
      label: formatDistanceToNow(p.createdAt, { addSuffix: true }),
      isNew: Math.abs(differenceInMinutes(p.createdAt, now)) < 5
    }))
  };
}

export async function getPrediction(id: string) {

  const parsedId = parseInt(id, 10);

  const prediction = await prisma.prediction.findUnique({
    where: { id: parsedId },
    select: {
      id: true,
      createdAt: true,
      calculatedData: true,
      percentages: true,
      prediction: true,
      brainSV: true,
      waterfallSV: true,
    }
  });

  if (!prediction) {
    return notFound();
  }

  return prediction;
}