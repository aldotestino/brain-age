from tensorflow.keras.models import load_model as tf_load_model
from sklearn.preprocessing import MinMaxScaler
import pandas as pd
import shap
from utils import cols, parse_col_name

class Model:
  def __init__(self, model_path, train_path, random_state=42):
    self._random_state = random_state
    self._model = tf_load_model(model_path)

    self._train = pd.read_excel(train_path)[cols]

    self._scaler = self._load_scaler()

  
  def predict_and_explain(self, X, limit=9):
    X_scaled = self._scaler.transform(X)
    prediction = self._predict(X_scaled)
    waterfall_sv, brain_sv = self._explain(X_scaled, limit)
    return prediction, waterfall_sv, brain_sv

  
  def _load_scaler(self):
    if(self._train is None):
      raise ValueError("Model or Scaler not loaded")
    
    sc = MinMaxScaler()
    sc.fit(self._train)
    return sc


  def _load_shap_explainer(self):
    if(self._model is None or self._scaler is None or self._train is None):
      raise ValueError("Model or Scaler not loaded")
    
    scaled_train = self._scaler.transform(self._train)

    masker = shap.maskers.Independent(scaled_train, max_samples=100) 
    return shap.PermutationExplainer(self._model, masker=masker, feature_names=cols, seed=self._random_state)


  def _predict(self, X):
    return self._model.predict(X).item()
  

  def _explain(self, X, limit):
    explainer = self._load_shap_explainer()
    sv = explainer(X, max_evals=953)

    formatted_sv = self._format_shap_values(sv)
    tornado_sv = self._shap_values_tornado_format(formatted_sv, limit)
    brain_sv = self._shap_values_glass_brain_format(formatted_sv)

    return tornado_sv, brain_sv
  

  def _format_shap_values(self, sv):
    return [{'value': x, 'data': y, 'name': z} for x, y, z in zip(sv[0].values, sv[0].data, sv[0].feature_names)]
  

  def _shap_values_tornado_format(self, formatted_sv, limit=9):
    ordered_values = sorted(formatted_sv, key=lambda x: abs(x['value']), reverse=True)
    
    remaining_values_sum = sum(x['value'] for x in ordered_values[limit:])
    remaining_features_number = len(ordered_values) - limit

    last_item = {
      'value': remaining_values_sum,
      'data': None,
      'name': f"{remaining_features_number} other features"
    }

    return ordered_values[:limit] + [last_item]
  

  def _shap_values_waterfall_format(self, formatted_sv, base_sv, limit=9):
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


  def _shap_values_glass_brain_format(self, formatted_sv):
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
