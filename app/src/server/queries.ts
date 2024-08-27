import prisma from '@/lib/db';
import { DataSchema, PredictionWithExplanation } from '@/lib/types';
import { Prisma } from '@prisma/client';
import { differenceInMinutes, formatDistanceToNow } from 'date-fns';
import { notFound } from 'next/navigation';

export async function getPatients({ q = '', p = 1, n = 10 }: { q?: string, p?: number, n?: number }) {

  const query = {
    AND: q.split(' ').map(part => ({
      OR: [{ firstName: { contains: part, mode: 'insensitive' } }, { lastName: { contains: part, mode: 'insensitive' } }, { email: { contains: part, mode: 'insensitive' } }]
    }))
  } satisfies Prisma.PatientWhereInput;

  const total = await prisma.patient.count({
    where: query,
  });

  const patients = await prisma.patient.findMany({
    where: query,
    skip: (p - 1) * n,
    take: n,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
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
    data: patient.data as DataSchema,
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

  const parametersChanged = Object.entries(prediction.percentages as DataSchema).reduce((arr, [key, value]) => {
    if (value !== 0) {
      arr.push(key);
    }
    return arr;
  }, [] as string[]);

  return {
    ...prediction,
    calculatedData: prediction.calculatedData as DataSchema,
    percentages: prediction.percentages as DataSchema,
    brainSV: prediction.brainSV as PredictionWithExplanation['brain_sv'],
    waterfallSV: prediction.waterfallSV as PredictionWithExplanation['waterfall_sv'],
    parametersChanged
  };
}