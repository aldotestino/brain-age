import { Bar } from 'react-chartjs-2';
import { Features } from './types';
import { featuresSchema, percentagesSchema, regionsSchema } from './validators';
import { Color, defaults } from 'chart.js';

export const featuresValues = Object.keys(featuresSchema.shape);
export const regionsValues = Object.keys(regionsSchema.shape);
export const sidesValues = Object.keys(percentagesSchema.shape);

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

export const graphColors = {
  stroke: {
    red: 'rgb(248, 113, 113)',
    blue: 'rgb(96, 165, 250)',
  },
  fill: {
    red: 'rgba(248, 113, 113, 0.5)',
    blue: 'rgba(96, 165, 250, 0.5)',
  }
} as const;

export const barOptions = {
  indexAxis: 'y' as const,
  elements: {
    bar: {
      borderWidth: 2,
      borderRadius: 4
    },
  },
  scales: {
    y: {
      border: {
        display: false,
        dash: [10, 5],
      },
      grid: {
        drawTicks: false,
      },
      ticks: {
        padding: 10
      }
    },
    x: {
      border: {
        display: false,
      },
      grid: {
        display: false,
      },
      bounds: 'data',
      beginAtZero: false,
      title: {
        display: true,
        text: 'Age',
      }
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    // title: {
    //   display: true,
    //   text: 'Explanation',
    // },
    legend: {
      onClick: () => null,
      labels: {
        generateLabels: () => {
          return [
            {
              fontColor: defaults.color as Color,
              text: 'Decrease Age',
              strokeStyle: graphColors.stroke.blue,
              fillStyle: graphColors.fill.blue,
              borderRadius: 2
            },
            {
              fontColor: defaults.color as Color,
              text: 'Increase Age',
              strokeStyle: graphColors.stroke.red,
              fillStyle: graphColors.fill.red,
              borderRadius: 2
            }
          ];
        }
      }
    },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const values = ctx.dataset.data?.[ctx.dataIndex];
          if (values && typeof (values) === 'object' && values.length === 2) {
            const num = values[1] - values[0];
            return `${num > 0 ? '+' : '-'}${(Math.abs(num)).toFixed(2)}`;
          }
        }
      }
    }
  },
} satisfies React.ComponentProps<typeof Bar>['options'];

export const GLASS_BRAIN_SHADES = 20;