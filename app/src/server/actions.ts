'use server';

import axios from 'axios';
import { UpdatePatientSchema, AddPatientSchema, PredictionWithExplanation, DataChangeSchema, DataSchema } from '@/lib/types';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import env from '@/lib/env';
import { updateWholeDataAndPercentages } from '@/lib/utils';

export async function predictAndExplain({
  patientId,
  dataChange
}: {
  patientId: number,
  dataChange?: DataChangeSchema
}) {

  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    select: {
      data: true
    }
  });

  if (!patient) {
    throw new Error('Patient not found');
  }

  let calcData: DataSchema;

  if (dataChange) {
    const { updatedData } = updateWholeDataAndPercentages({
      data: patient.data as DataSchema,
      dataChange
    });
    calcData = updatedData;
  } else {
    calcData = patient.data as DataSchema;
  }

  const { data } = await axios.post<PredictionWithExplanation>(`${env.MODEL_API_URL}/predict_and_explain`, calcData);

  const { id } = await prisma.prediction.create({
    data: {
      patientId,
      dataChange,
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