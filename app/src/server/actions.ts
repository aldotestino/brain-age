'use server';

import axios from 'axios';
import { DataSchema, UpdatePatientSchema, AddPatientSchema, PredictionWithExplanation } from '@/lib/types';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import env from '@/lib/env';
import { dataZero } from '@/lib/utils';

export async function predictAndExplain({
  patientId,
  percentages,
  calculatedData
}: {
  patientId: number,
  percentages: DataSchema,
  calculatedData: DataSchema
}) {

  const patient = await prisma.patient.findUnique({
    where: { id: patientId }
  });

  if (!patient) {
    throw new Error('Patient not found');
  }

  const { data } = await axios.post<PredictionWithExplanation>(`${env.MODEL_API_URL}/predict_and_explain`, calculatedData);

  const { id } = await prisma.prediction.create({
    data: {
      patientId,
      percentages,
      calculatedData,
      prediction: data.prediction,
      brainSV: data.brain_sv,
      waterfallSV: data.waterfall_sv
    }
  });

  revalidatePath(`/patient/${patientId}`);
  redirect(`/patient/${patientId}?predId=${id}`);
}

export async function addPatient(values: AddPatientSchema) {
  try {
    const { id } = await prisma.patient.create({
      data: values,
      select: {
        id: true
      }
    });

    revalidatePath('/dashboard');

    // create base prediction
    await predictAndExplain({
      patientId: id,
      percentages: dataZero,
      calculatedData: values.data
    });

    // redirect(`/patient/${id}`);
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        throw new Error('Email already exists');
      }
    } else {
      throw e;
    }
  }
}

export async function deletePrediction(predictionId: number) {
  const { patientId } = await prisma.prediction.delete({
    where: { id: predictionId },
    select: {
      patientId: true
    }
  });

  revalidatePath(`/patient/${patientId}`);
  redirect(`/patient/${patientId}`);
}

export async function deletePatient(patientId: number) {
  await prisma.patient.delete({
    where: { id: patientId }
  });

  revalidatePath('/dashboard');
}

export async function updatePatient({
  patientId,
  values
}: {
  patientId: number;
  values: UpdatePatientSchema;
}) {
  await prisma.patient.update({
    where: { id: patientId },
    data: values
  });

  revalidatePath('/dashboard');
}