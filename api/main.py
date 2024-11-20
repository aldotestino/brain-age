import os
import uvicorn
from model import Model
from api import Api

model_path = 'modelBilanciata.h5'
train_path = 'df_train.xlsx'

PORT = int(os.environ.get("PORT", 8080))

# use ipv6 if running in Railway
host = "::" if os.environ.get("RAILWAY_SERVICE_ID") else "0.0.0.0"

if __name__ == "__main__":
    model = Model(model_path=model_path, train_path=train_path)
    app = Api(model=model)

    uvicorn.run(app, host=host, port=PORT)