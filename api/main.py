from model import Model
import pandas as pd
from utils import cols

model_path = 'modelBilanciata.h5'
train_path = 'df_train.xlsx'

model = Model(model_path=model_path, train_path=train_path)

test = pd.read_excel('df_test1.xlsx')
test = test[cols]

X = test.iloc[0:1, :]

pred = model.predict(X)
waterfall_sv, _ = model.explain(X, 9)
print(pred)
print(waterfall_sv)
