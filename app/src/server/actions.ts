'use server';

import { UpdatePatientSchema, AddPatientSchema, DataChangeSchema, DataSchema, PredictionWithExplanation } from '@/lib/types';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import { updateAllDataAndPercentages } from '@/lib/utils';
import axios from 'axios';
import env from '@/lib/env';

// returns -1 if prediction failed
export async function makePredictionAndExplanation({ baseData, dataChange, patientId, isBase = false }: {
  baseData: DataSchema;
  dataChange?: DataChangeSchema;
  patientId: number;
  isBase?: boolean;
}) {
  try {

    let dataToSend = dataChange ? updateAllDataAndPercentages({ baseData, dataChange }).updatedData : baseData;

    const { data, status } = await axios.post<PredictionWithExplanation>(`${env.MODEL_API_URL}/predict_and_explain`, dataToSend);

    const { id } = await prisma.prediction.create({
      data: {
        patientId,
        dataChange,
        isBase,
        prediction: data.prediction,
        brainSV: data.brain_sv,
        waterfallSV: data.waterfall_sv
      }
    });

    return id;
  } catch (e: any) {
    return -1;
  }
}

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
    return 'Patient not found';
  }

  const predictionId = await makePredictionAndExplanation({
    baseData: patient.data as DataSchema,
    dataChange,
    patientId: patientId
  });

  if (predictionId === -1) {
    return 'Prediction failed, try again later';
  }

  revalidatePath(`/patient/${patientId}`);
  redirect(`/patient/${patientId}?predId=${predictionId}`);
}

export async function deletePrediction(predictionId: number) {

  const { isBase } = await prisma.prediction.findUnique({
    where: { id: predictionId },
    select: {
      isBase: true
    }
  });

  if (isBase) {
    return 'Cannot delete base prediction';
  }

  const { patientId } = await prisma.prediction.delete({
    where: { id: predictionId },
    select: {
      patientId: true
    }
  });

  revalidatePath(`/patient/${patientId}`);
  redirect(`/patient/${patientId}`);
}

export async function addPatient(values: AddPatientSchema) {
  try {
    const { id } = await prisma.patient.create({
      data: values,
      select: {
        id: true
      }
    });

    // create base prediction
    const predictionId = await makePredictionAndExplanation({
      baseData: values.data,
      patientId: id,
      isBase: true
    });

    if (predictionId === -1) {
      // delete patient if base prediction failed
      await prisma.patient.delete({
        where: { id }
      });
      return 'Prediction failed, try again later';
    }

    revalidatePath('/dashboard');
    redirect(`/patient/${id}?predId=${predictionId}`);
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return 'Email already exists';
      }
    }
    throw e; // otherwise redirect will not work
  }
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
  try {
    await prisma.patient.update({
      where: { id: patientId },
      data: values
    });

    revalidatePath('/dashboard');
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return 'Email already exists';
      }
    }
  }
}