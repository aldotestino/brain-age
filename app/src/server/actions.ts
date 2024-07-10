'use server';

import axios from 'axios';
import { PatientSchema, PredictionWithExplanation, Values } from '@/lib/types';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const MODEL_API_URL = 'http://localhost:8080/predict_and_explain';

export async function predictAndExplain(values: Values) {
  const { data } = await axios.post<PredictionWithExplanation>(MODEL_API_URL, values);
  return data;
}

export async function addPatient(values: PatientSchema) {
  const { id } = await prisma.patient.create({
    data: values,
    select: {
      id: true
    }
  });

  revalidatePath('/dashboard');
  redirect(`/patient/${id}`);
}