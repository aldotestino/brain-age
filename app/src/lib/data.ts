import { RdYlGn } from '@/lib/colorMaps';
import { sampleColormap } from '@/lib/utils';

export const features = ['surface_area', 'mean_curv', 'intrinsic_cur_index', 'GM_vol', 'gaussian_curv', 'average_thickness', 'thickness_stddev'] as const;
export const regions = ['bankssts', 'caudalanteriorcingulate', 'caudalmiddlefrontal', 'cuneus', 'entorhinal', 'fusiform', 'inferiorparietal', 'inferiortemporal', 'isthmuscingulate', 'lateraloccipital', 'lateralorbitofrontal', 'lingual', 'medialorbitofrontal', 'middletemporal', 'parahippocampal', 'paracentral', 'parsopercularis', 'parsorbitalis', 'parstriangularis', 'pericalcarine', 'postcentral', 'posteriorcingulate', 'precentral', 'precuneus', 'rostralanteriorcingulate', 'rostralmiddlefrontal', 'superiorfrontal', 'superiorparietal', 'superiortemporal', 'supramarginal', 'frontalpole', 'temporalpole', 'transversetemporal', 'insula'] as const;
export const sides = ['lh', 'rh'] as const;

export const featuresNames = {
  surface_area: 'Surface Area',
  mean_curv: 'Mean Curvature',
  intrinsic_cur_index: 'Intrinsic Curvature Index',
  GM_vol: 'Gray Matter Volume',
  gaussian_curv: 'Gaussian Curvature',
  average_thickness: 'Average Thickness',
  thickness_stddev: 'Thickness Standard Deviation'
} as const;

export const regionsNamesAndDescription = {
  'bankssts': {
    'name': 'Banks of the superior temporal sulcus',
    'description': 'The posterior aspect of the superior temporal sulcus, bordered by the superior temporal gyrus rostrally and the middle temporal gyrus caudally.'
  },
  'caudalanteriorcingulate': {
    'name': 'Caudal anterior cingulate cortex',
    'description': 'Located in the anterior cingulate, extending from the genu of the corpus callosum to the mammillary bodies.'
  },
  'caudalmiddlefrontal': {
    'name': 'Caudal middle frontal gyrus',
    'description': 'The posterior division of the middle frontal gyrus, extending from the precentral gyrus to the superior frontal sulcus.'
  },
  'cuneus': {
    'name': 'Cuneus',
    'description': 'A wedge-shaped area of the occipital lobe bounded by the calcarine sulcus and parieto-occipital fissure.'
  },
  'entorhinal': {
    'name': 'Entorhinal cortex',
    'description': 'Located in the medial temporal lobe, the rostral end is the collateral sulcus, and it is bounded caudally by the amygdala.'
  },
  'fusiform': {
    'name': 'Fusiform gyrus',
    'description': 'Located between the occipitotemporal sulcus and collateral sulcus, extending from the temporal to occipital lobes.'
  },
  'inferiorparietal': {
    'name': 'Inferior parietal lobule',
    'description': 'Part of the parietal cortex, bounded by the supramarginal gyrus rostrally and the lateral occipital cortex caudally.'
  },
  'inferiortemporal': {
    'name': 'Inferior temporal gyrus',
    'description': 'Situated between the inferior temporal sulcus and the occipitotemporal sulcus, extending from the temporal to occipital cortex.'
  },
  'isthmuscingulate': {
    'name': 'Isthmus of the cingulate cortex',
    'description': 'Located between the posterior cingulate cortex and the parahippocampal gyrus.'
  },
  'lateraloccipital': {
    'name': 'Lateral occipital cortex',
    'description': 'The posterior region of the occipital lobe, bordered by the inferior temporal gyrus and the cuneus.'
  },
  'lateralorbitofrontal': {
    'name': 'Lateral orbitofrontal cortex',
    'description': 'The lateral aspect of the orbitofrontal cortex, extending from the olfactory sulcus to the circular insular sulcus.'
  },
  'lingual': {
    'name': 'Lingual gyrus',
    'description': 'Located in the occipital lobe, bordered by the collateral sulcus and extending to the posterior occipital cortex.'
  },
  'medialorbitofrontal': {
    'name': 'Medial orbitofrontal cortex',
    'description': 'The medial division of the orbitofrontal cortex, bordered by the olfactory sulcus and superior frontal gyrus.'
  },
  'middletemporal': {
    'name': 'Middle temporal gyrus',
    'description': 'Situated between the superior and inferior temporal sulci, extending from the temporal pole to the temporo-occipital incisure.'
  },
  'parahippocampal': {
    'name': 'Parahippocampal gyrus',
    'description': 'Located in the medial temporal lobe, extending from the entorhinal cortex to the posterior hippocampus.'
  },
  'paracentral': {
    'name': 'Paracentral lobule',
    'description': 'A region between the superior frontal gyrus and the precuneus, extending over the central sulcus.'
  },
  'parsopercularis': {
    'name': 'Pars opercularis',
    'description': 'The portion of the inferior frontal gyrus adjacent to the precentral gyrus, located posterior to the pars triangularis.'
  },
  'parsorbitalis': {
    'name': 'Pars orbitalis',
    'description': 'The most anterior portion of the inferior frontal gyrus, located rostrally to the pars triangularis.'
  },
  'parstriangularis': {
    'name': 'Pars triangularis',
    'description': 'The triangular part of the inferior frontal gyrus, between the pars opercularis and pars orbitalis.'
  },
  'pericalcarine': {
    'name': 'Pericalcarine cortex',
    'description': 'Located around the calcarine sulcus, in the medial occipital lobe, extending from the occipital pole.'
  },
  'postcentral': {
    'name': 'Postcentral gyrus',
    'description': 'Located in the parietal lobe, the primary somatosensory cortex, bounded by the central sulcus and postcentral sulcus.'
  },
  'posteriorcingulate': {
    'name': 'Posterior cingulate cortex',
    'description': 'The posterior division of the cingulate cortex, extending from the isthmus to the caudal anterior cingulate.'
  },
  'precentral': {
    'name': 'Precentral gyrus',
    'description': 'The primary motor cortex, located in the frontal lobe between the precentral and central sulci.'
  },
  'precuneus': {
    'name': 'Precuneus',
    'description': 'A medial parietal structure, located between the cuneus and the paracentral lobule.'
  },
  'rostralanteriorcingulate': {
    'name': 'Rostral anterior cingulate cortex',
    'description': 'The anterior division of the cingulate cortex, located rostrally to the genu of the corpus callosum.'
  },
  'rostralmiddlefrontal': {
    'name': 'Rostral middle frontal gyrus',
    'description': 'The anterior division of the middle frontal gyrus, extending from the superior frontal sulcus to the middle frontal gyrus.'
  },
  'superiorfrontal': {
    'name': 'Superior frontal gyrus',
    'description': 'Located in the frontal lobe, bordered by the superior frontal sulcus and the cingulate sulcus.'
  },
  'superiorparietal': {
    'name': 'Superior parietal lobule',
    'description': 'Part of the parietal lobe, located between the postcentral gyrus and the lateral occipital cortex.'
  },
  'superiortemporal': {
    'name': 'Superior temporal gyrus',
    'description': 'Located in the temporal lobe, extending from the temporal pole to the supramarginal gyrus.'
  },
  'supramarginal': {
    'name': 'Supramarginal gyrus',
    'description': 'A gyrus in the parietal lobe, located adjacent to the angular gyrus, and bounded by the lateral fissure.'
  },
  'frontalpole': {
    'name': 'Frontal pole',
    'description': 'The most anterior part of the frontal lobe, extending rostrally from the superior frontal gyrus.'
  },
  'temporalpole': {
    'name': 'Temporal pole',
    'description': 'The anterior portion of the temporal lobe, bounded by the entorhinal cortex and extending to the temporal gyrus.'
  },
  'transversetemporal': {
    'name': 'Transverse temporal gyrus',
    'description': 'Located in the superior temporal gyrus, extending laterally from the lateral fissure.'
  },
  'insula': {
    'name': 'Insula',
    'description': 'A deep cortical structure within the lateral sulcus, involved in consciousness and emotion.'
  }
} as const;

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
  label: regionsNamesAndDescription[value].name,
  description: regionsNamesAndDescription[value].description
}));

export const featuresItems = features.map(value => ({
  value,
  label: featuresNames[value]
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

export const editableFeaturesItems = editableFeatures.map(f => ({
  value: f,
  label: featuresNames[f]
}));


export const glassBrainShades = sampleColormap(RdYlGn.reverse(), 14);