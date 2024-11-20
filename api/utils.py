features = ['surface_area', 'mean_curv', 'intrinsic_cur_index', 'GM_vol', 'gaussian_curv', 'average_thickness', 'thickness_stddev']
regions = ['bankssts', 'caudalanteriorcingulate', 'caudalmiddlefrontal', 'cuneus', 'entorhinal', 'fusiform', 'inferiorparietal', 'inferiortemporal', 'isthmuscingulate', 'lateraloccipital', 'lateralorbitofrontal', 'lingual', 'medialorbitofrontal', 'middletemporal', 'parahippocampal', 'paracentral', 'parsopercularis', 'parsorbitalis', 'parstriangularis', 'pericalcarine', 'postcentral', 'posteriorcingulate', 'precentral', 'precuneus', 'rostralanteriorcingulate', 'rostralmiddlefrontal', 'superiorfrontal', 'superiorparietal', 'superiortemporal', 'supramarginal', 'frontalpole', 'temporalpole', 'transversetemporal', 'insula']
sides = ['lh', 'rh']

# the order is the same of the original dataset
cols = [f"{feature}_{side}-{region}" for feature in features for side in sides for region in regions]

def parse_col_name(col_name):
    left, region = col_name.split('-')
    side = left[-2:]
    feature = left[:-3]
    
    return side, region, feature
