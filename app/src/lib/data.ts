import { Features } from './types';
import { featuresSchema, formSchema, regionsSchema } from './validators';

export const featuresValues = Object.keys(featuresSchema.shape);
export const regionsValues = Object.keys(regionsSchema.shape);
export const sidesValues = Object.keys(formSchema.shape);

export const sidesItems = [
  { value: 'lh', label: 'Left' },
  { value: 'rh', label: 'Right' },
];

export const regions = regionsValues.map(value => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1) // Capitalize first letter
}));

export const features: Features = {
  surface_area: {
    label: 'Surface Area',
    editable: false
  },
  mean_curv: {
    label: 'Mean Curv',
    editable: false
  },
  intrinsic_cur_index: {
    label: 'Intrinsic Cur Index',
    editable: false
  },
  GM_vol: {
    label: 'GM Vol',
    editable: true
  },
  gaussian_curv: {
    label: 'Gaussian Curv',
    editable: false
  },
  average_thickness: {
    label: 'Average Thickness',
    editable: true
  },
  thickness_stddev: {
    label: 'Thickness Stddev',
    editable: false
  },
};

export const featuresItems = Object.entries(features).map(([key, value]) => ({ value: key, label: value.label }));