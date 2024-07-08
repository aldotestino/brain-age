import axios from 'axios';
import { PredictionWithExplanation, Values } from '@/lib/types';

const MODEL_API_URL = 'http://localhost:8080/predict_and_explain';

export async function predictAndExplain(values: Values) {
  const { data } = await axios.post<PredictionWithExplanation>(MODEL_API_URL, values);
  return data;
}