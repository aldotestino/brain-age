import { features, regions, sides } from '@/lib/data';
import prisma from '@/lib/db';
import { BrainSV, DataSchema, Features, GlassBrainRegions, ModelFeatures } from '@/lib/types';
import { NextResponse } from 'next/server';
import * as xlsx from 'xlsx';

export async function GET(request: Request, { params }: { params: { predictionId: string } }) {

  const { predictionId } = params;

  const id = parseInt(predictionId);

  if (isNaN(id)) {
    return new Response('Prediction not found', { status: 404 });
  }

  const prediction = await prisma.prediction.findUnique({
    where: { id },
    select: {
      prediction: true,
      percentages: true,
      calculatedData: true,
      brainSV: true,
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          age: true,
          sex: true,
          siteId: true,
          data: true
        }
      }
    }
  });

  if (!prediction) {
    return new Response('Prediction not found', { status: 404 });
  }

  const { patient, ...pred } = prediction;

  const data = patient.data as DataSchema;
  const percentages = pred.percentages as DataSchema;
  const calculatedData = pred.calculatedData as DataSchema;
  const brainSV = pred.brainSV as BrainSV;

  const sheetData = [
    ['ID', patient.id],
    ['First Name', patient.firstName],
    ['Last Name', patient.lastName],
    ['Email', patient.email],
    ['Sex', patient.sex],
    ['Age', patient.age],
    ['SiteID', patient.siteId],
    ['Predicted Brain Age', pred.prediction],
    ['BAG (Brain Age Gap)', pred.prediction - patient.age],
    [],
    ['Feature', 'Value', 'Percentage', 'New value', 'Shap value'],
    ...features.flatMap(feature => sides.flatMap(side => regions.map(region => {
      const shapValue = brainSV[feature as Features].regions[`${side}.${region}` as GlassBrainRegions];
      const featureName = `${feature}_${side}-${region}` as ModelFeatures;
      return [featureName, data[featureName], percentages[featureName], calculatedData[featureName], shapValue];
    })))
  ];

  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.aoa_to_sheet(sheetData);
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  const headers = new Headers({
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Disposition': `attachment; filename="prediction_${predictionId}.xlsx"`,
  });

  return new NextResponse(excelBuffer, { headers });
}