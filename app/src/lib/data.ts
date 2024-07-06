import { Features } from './types';
import { featuresSchema, formSchema, regionsSchema } from './validators';

export const featuresValues = Object.keys(featuresSchema.shape);
export const regionsValues = Object.keys(regionsSchema.shape);
export const sidesValues = Object.keys(formSchema.shape);

export const sides = [
  { value: 'lh', label: 'Left' },
  { value: 'rh', label: 'Right' },
];

export const regions = regionsValues.map(value => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1) // Capitalize first letter
}));

export const features: Features = {
  GM_vol: {
    label: 'GM Vol',
    editable: true
  },
  average_thickness: {
    label: 'Average Thickness',
    editable: true
  },
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
  gaussian_curv: {
    label: 'Gaussian Curv',
    editable: false
  },
  thickness_stddev: {
    label: 'Thickness Stddev',
    editable: false
  },
};