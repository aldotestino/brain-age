import { Bar } from 'react-chartjs-2';
import { Color, defaults } from 'chart.js';

export const features = ['surface_area', 'mean_curv', 'intrinsic_cur_index', 'GM_vol', 'gaussian_curv', 'average_thickness', 'thickness_stddev'] as const;
export const regions = ['bankssts', 'caudalanteriorcingulate', 'caudalmiddlefrontal', 'cuneus', 'entorhinal', 'fusiform', 'inferiorparietal', 'inferiortemporal', 'isthmuscingulate', 'lateraloccipital', 'lateralorbitofrontal', 'lingual', 'medialorbitofrontal', 'middletemporal', 'parahippocampal', 'paracentral', 'parsopercularis', 'parsorbitalis', 'parstriangularis', 'pericalcarine', 'postcentral', 'posteriorcingulate', 'precentral', 'precuneus', 'rostralanteriorcingulate', 'rostralmiddlefrontal', 'superiorfrontal', 'superiorparietal', 'superiortemporal', 'supramarginal', 'frontalpole', 'temporalpole', 'transversetemporal', 'insula'] as const;
export const sides = ['lh', 'rh'] as const;

export const glassBrainRegions = sides.flatMap((s) =>
  regions.map((r) => `${s}.${r}`)
);

export const modelFeatures = sides.flatMap((s) =>
  regions.flatMap((r) =>
    features.map((f) => `${f}_${s}-${r}`)
  )
);

export const sidesItems = [
  { value: 'lh', label: 'Left' },
  { value: 'rh', label: 'Right' },
];

export const regionsItems = regions.map(value => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1)
}));

export const featuresItems = features.map(value => ({
  value,
  label: value.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}));

export const sexItems = ['Male', 'Female'].map(i => ({
  label: i,
  value: i
}));

export const itemsPerPageItems = ['5', '8', '10', '15', '20', '50', '100'].map(i => ({
  label: i,
  value: i
}));

export const EDITABLE_FEATURE_1 = 'GM_vol' as const;
export const EDITABLE_FEATURE_2 = 'average_thickness' as const;

export const editableFeatures = [EDITABLE_FEATURE_1, EDITABLE_FEATURE_2] as const;

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
      ticks: {
        count: 10 // probably solves the overlapping issue with the labels
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
            return `${num > 0 ? '+' : num < 0 ? '-' : ''}${(Math.abs(num)).toFixed(2)}`;
          }
        }
      }
    }
  },
} satisfies React.ComponentProps<typeof Bar>['options'];

export const GLASS_BRAIN_SHADES = 20;