import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';
import colormap from 'colormap';
import { featuresValues, GLASS_BRAIN_SHADES, regionsValues, sidesValues } from './data';
import { FormNames, ModelNames, Percentages, RegionsKeys, SideKeys, Values } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const startingValues = sidesValues.flatMap((s) =>
  regionsValues.flatMap((r) =>
    featuresValues.map((f) => `${f}_${s}-${r}` as keyof Values)
  )
).reduce((obj: Partial<Values>, key: keyof Values) => {
  obj[key] = 0;
  return obj;
}, {}) as Values;


export function defaultValueFromSchema(schema: any): any {
  if (schema instanceof z.ZodObject) {
    const shape = schema._def.shape();
    return Object.keys(shape).reduce((acc, key) => {
      acc[key] = defaultValueFromSchema(shape[key]);
      return acc;
    }, {} as any);
  } else if (schema instanceof z.ZodArray) {
    return [];
  } else if (schema instanceof z.ZodOptional) {
    return defaultValueFromSchema(schema._def.innerType);
  } else if (schema instanceof z.ZodNullable) {
    return defaultValueFromSchema(schema._def.innerType);
  } else if (schema instanceof z.ZodUnion) {
    return defaultValueFromSchema(schema._def.options[0]);
  } else if (schema instanceof z.ZodIntersection) {
    return {
      ...defaultValueFromSchema(schema._def.left),
      ...defaultValueFromSchema(schema._def.right),
    };
  } else {
    return 0;
  }
};

export function updateFeatures({
  side,
  region,
  feature1Percentage,
  feature2Percentage,
  baseValues,
}: {
  side: SideKeys,
  region: RegionsKeys,
  feature1Percentage: number,
  feature2Percentage: number,
  baseValues: Values
}) {

  const relations = {
    surface_area: {
      GM_vol: 2,
      average_thickness: 1.5,
    },
    mean_curv: {
      GM_vol: 0.2,
      average_thickness: -0.6,
    },
    intrinsic_cur_index: {
      GM_vol: -1.2,
      average_thickness: 0.7,
    },
    gaussian_curv: {
      GM_vol: 0.8,
      average_thickness: 1.4,
    },
    thickness_stddev: {
      GM_vol: -0.5,
      average_thickness: 0.3,
    },
  };

  const values: Partial<Values> = {};
  const percentages: Partial<Percentages> = {};

  const baseFeature1 = baseValues[`GM_vol_${side}-${region}` as ModelNames];
  const baseFeature2 = baseValues[`average_thickness_${side}-${region}` as ModelNames];

  values[`GM_vol_${side}-${region}` as ModelNames] = baseFeature1 + baseFeature1 / 100 * feature1Percentage;
  values[`average_thickness_${side}-${region}` as ModelNames] = baseFeature2 + baseFeature2 / 100 * feature2Percentage;

  for (const [relatedFeature, factor] of Object.entries(relations)) {
    const relatedFeatureFormName = `${side}.${region}.${relatedFeature}` as FormNames;
    const relatedFeatureModelName = `${relatedFeature}_${side}-${region}` as ModelNames;
    const relatedFeatureValue = baseValues[relatedFeatureModelName];

    const totalPercentage = factor.GM_vol * feature1Percentage + factor.average_thickness * feature2Percentage;

    const updatedValue = relatedFeatureValue + relatedFeatureValue / 100 * totalPercentage;

    values[relatedFeatureModelName] = updatedValue;
    percentages[relatedFeatureFormName] = totalPercentage;
  }

  return { values, percentages };
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
