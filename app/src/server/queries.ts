import prisma from '@/lib/db';
import { DataChangeSchema, DataSchema, PredictionWithExplanation } from '@/lib/types';
import { Prisma } from '@prisma/client';
import { unstable_cache } from 'next/cache';
import { notFound, redirect } from 'next/navigation';

export const getCachedPatients = unstable_cache(getPatients, ['patients'], {
  tags: ['patients']
});

async function getPatients({ q, p, n }: { q: string, p: number, n: number }) {

  const query = {
    AND: q.split(' ').map(part => ({
      OR: [
        { firstName: { contains: part, mode: 'insensitive' } },
        { lastName: { contains: part, mode: 'insensitive' } },
        { taxIdCode: { contains: part, mode: 'insensitive' } }
      ]
    }))
  } satisfies Prisma.PatientWhereInput;

  const total = await prisma.patient.count({
    where: query,
  });

  if (n > total && p > 1) {
    if (q)
      redirect(`/dashboard?q=${q}&n=${n}`);
    else
      redirect(`/dashboard?n=${n}`);
  }

  const patients = await prisma.patient.findMany({
    where: query,
    skip: (p - 1) * n,
    take: n,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      taxIdCode: true,
      age: true,
      sex: true,
      siteId: true,
    }
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

export const getCachedPatient = unstable_cache(getPatient, ['patient'], {
  tags: ['patient']
});

async function getPatient(id: string) {

  const parsedId = parseInt(id);

  const patient = await prisma.patient.findUnique({
    where: { id: parsedId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      taxIdCode: true,
      age: true,
      sex: true,
      siteId: true,
      data: true,
      predictions: {
        select: {
          id: true,
          isBase: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (!patient)
    notFound();

  return {
    ...patient,
    data: patient.data as DataSchema
  };
}

export const getCachedPrediction = unstable_cache(getPrediction, ['prediction'], {
  tags: ['prediction']
});

async function getPrediction({ patientId, predictionId }: { patientId: string, predictionId: number | null }) {

  const parsedPatientId = parseInt(patientId);

  const query = predictionId ? { id: predictionId } : { patientId: parsedPatientId, isBase: true } satisfies Prisma.PredictionWhereInput;

  const prediction = await prisma.prediction.findFirst({
    where: query,
    select: {
      id: true,
      isBase: true,
      createdAt: true,
      dataChange: true,
      prediction: true,
      brainSV: true,
      waterfallSV: true,
    }
  });

  if (!prediction)
    return notFound();

  return {
    ...prediction,
    dataChange: prediction.dataChange as DataChangeSchema,
    brainSV: prediction.brainSV as PredictionWithExplanation['brain_sv'],
    waterfallSV: prediction.waterfallSV as PredictionWithExplanation['waterfall_sv'],
  };
}