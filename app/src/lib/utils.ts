import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import colormap from 'colormap';
import { GLASS_BRAIN_SHADES, regions, sides } from './data';
import { DataChangeSchema, DataSchema, EditableFeatures, GlassBrainRegions, ModelFeatures, PredictionWithExplanation, Regions, Sides } from './types';
import fullRelations from '@/lib/fullRelations.json';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createDashboardPaginationURL({ p, q, n }: { p: number, q: string, n: number }) {
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.set('p', p.toString());
  urlSearchParams.set('n', n.toString());
  if (q) {
    urlSearchParams.set('q', q);
  }
  return `/dashboard?${urlSearchParams.toString()}`;
}

export function updateAllDataAndPercentages({
  baseData,
  dataChange
}: {
  baseData: DataSchema,
  dataChange: DataChangeSchema
}) {
  const updatedPercentages = sides.reduce((acc, side) => {
    acc = {
      ...acc,
      ...regions.reduce((acc, region) => {
        acc = {
          ...acc,
          ...updatePercentages({
            side,
            region,
            featureChanged: dataChange[side][region].featureChanged,
            percentage: dataChange[side][region].percentage
          })
        };
        return acc;
      }, {} as any)
    };
    return acc;
  }, {} as any) as DataSchema;

  const updatedData = updateData({
    baseData,
    percentages: updatedPercentages
  }) as DataSchema;

  return { updatedPercentages, updatedData };
}

export function updatePercentages({
  side,
  region,
  featureChanged,
  percentage
}: {
  side: Sides,
  region: Regions,
  featureChanged: EditableFeatures,
  percentage: number
}) {
  const updatedPercentages: Partial<DataSchema> = {};

  // add itself
  updatedPercentages[getModelFeatureName(featureChanged, side, region)] = percentage;

  const relations = fullRelations[featureChanged][side][region];

  Object.entries(relations).forEach(([feature, relation]) => {
    updatedPercentages[getModelFeatureName(feature, side, region)] = percentage * relation;
  });

  return updatedPercentages;
}

export function updateData({
  baseData,
  percentages
}: {
  baseData: Partial<DataSchema>
  percentages: Partial<DataSchema>
}) {
  const updatedData: Partial<DataSchema> = {};

  Object.entries(percentages).forEach(([modelFeature, percentage]) => {
    const baseFeature = baseData[modelFeature as ModelFeatures];
    updatedData[modelFeature as ModelFeatures] = baseFeature! + baseFeature! * percentage / 100;
  });

  return updatedData;
}

export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

export function valueToColor(value: number, min: number, max: number) {
  const colors = colormap({
    colormap: 'RdBu',
    nshades: GLASS_BRAIN_SHADES,
    format: 'hex'
  });

  const colorIndex = Math.round(mapRange(value, min, max, 0, colors.length - 1));
  return colors[colorIndex];
}

export function getGlassBrainRegion(modelChildName: string) {
  return modelChildName.replace('pial.DK.', '') as GlassBrainRegions;
}

export function getModelFeatureName(feature: string, side: string, region: string) {
  return `${feature}_${side}-${region}` as ModelFeatures;
}