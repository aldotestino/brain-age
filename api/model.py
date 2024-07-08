from tensorflow.keras.models import load_model as tf_load_model
import pandas as pd
import shap
from utils import cols, parse_col_name

class Model:
  def __init__(self, model_path, train_path, random_state=42):
    self.random_state = random_state
    self.model = tf_load_model(model_path)
    self.shap_exploainer = self.load_shap_explainer(train_path)


  def load_shap_explainer(self, train_path):
    if(self.model is None):
      raise ValueError("Model not loaded")
    
    train = pd.read_excel(train_path)
    train = train[cols]
    train_sample = shap.sample(train, 100, random_state=self.random_state)
    self.shap_explainer = shap.KernelExplainer(self.model, data=train_sample)
  

  def predict(self, X):
    return self.model.predict(X).item()
  

  def explain(self, X, limit):
    sv = self.shap_explainer(X)[:,:,0]

    base_sv = sv.base_values.tolist()[0]
    formatted_sv = self.format_shap_values(sv)
    waterfall_sv = self.shap_values_waterfall_format(formatted_sv, base_sv, limit)
    brain_sv = self.shap_values_glass_brain_format(formatted_sv)

    return waterfall_sv, brain_sv
  

  def format_shap_values(self, sv):
    return [{'value': x, 'data': y, 'name': z} for x, y, z in zip(sv[0].values, sv[0].data, sv[0].feature_names)]
  

  def shap_values_waterfall_format(self, formatted_sv, base_sv, limit=9):
    ordered_values = sorted(formatted_sv, key=lambda x: abs(x['value']))

    remaining_values_sum = sum(x['value'] for x in ordered_values[:-limit])
    remaining_features_number = len(ordered_values) - limit

    last_item = {
      'value': remaining_values_sum,
      'data': None,
      'name': f"{remaining_features_number} other features",
      'range': [base_sv, base_sv + remaining_values_sum]
    }

    final_values = []
    last_range_value = last_item['range'][1]

    for item in ordered_values[-limit:]:
      range_ = [last_range_value, last_range_value + item['value']]

      final_values.append({
        'value': item['value'],
        'data': item['data'],
        'name': item['name'],
        'range': range_
      })

      last_range_value = range_[1]

    final_values.reverse()
    final_values.append(last_item)

    return final_values


  def shap_values_glass_brain_format(self, formatted_sv):
    shap_by_region = {}

    for item in formatted_sv:
      side, region, feature = parse_col_name(item['name'])
      if feature not in shap_by_region:
        shap_by_region[feature] = {
          'regions': {},
          'min': float('inf'),
          'max': -float('inf')
        }
      value = item['value']

      if value < shap_by_region[feature]['min']:
        shap_by_region[feature]['min'] = value
      if value > shap_by_region[feature]['max']:
        shap_by_region[feature]['max'] = value
      
      shap_by_region[feature]['regions'][f"{side}.{region}"] = value

    return shap_by_region
