import prisma from '@/lib/db';
import { DataChangeSchema, DataSchema, PredictionWithExplanation } from '@/lib/types';
import { dataChangeSchema, dataSchema } from '@/lib/validators';
import { Prisma } from '@prisma/client';
import { differenceInMinutes, formatDistanceToNow } from 'date-fns';
import { notFound, redirect } from 'next/navigation';

export async function getPatients({ q, p, n }: { q: string, p: number, n: number }) {

  if (isNaN(p) || isNaN(n)) {
    redirect('/dashboard');
  }

  const query = {
    AND: q.split(' ').map(part => ({
      OR: [{ firstName: { contains: part, mode: 'insensitive' } }, { lastName: { contains: part, mode: 'insensitive' } }, { email: { contains: part, mode: 'insensitive' } }]
    }))
  } satisfies Prisma.PatientWhereInput;

  const total = await prisma.patient.count({
    where: query,
  });

  if (n > total && p > 1) {
    if (q) {
      redirect(`/dashboard?q=${q}&n=${n}`);
    } else {
      redirect(`/dashboard?n=${n}`);
    }
  }

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
      age: true,
      sex: true,
      siteId: true,
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
      dataChange: true,
      prediction: true,
      brainSV: true,
      waterfallSV: true,
    }
  });

  if (!prediction) {
    return notFound();
  }

  return {
    ...prediction,
    dataChange: prediction.dataChange as DataChangeSchema,
    brainSV: prediction.brainSV as PredictionWithExplanation['brain_sv'],
    waterfallSV: prediction.waterfallSV as PredictionWithExplanation['waterfall_sv'],
  };
}