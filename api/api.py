from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
import uuid
import pandas as pd
from model import Model

class Api(FastAPI):
  def __init__(self, model: Model):
    super().__init__()
    self.model = model
    self.configure_middleware()
    self.add_endpoints()


  def configure_middleware(self):
    self.add_middleware(
      CORSMiddleware,
      allow_origins=["*"],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
    )

  
  def add_endpoints(self):
    self.add_api_route("/healthcheck", self.healthcheck, methods=["GET"], status_code=status.HTTP_200_OK)
    self.add_api_route("/predict_and_explain", self.predict_and_explain, methods=["POST"], status_code=status.HTTP_200_OK)


  def healthcheck(self):
    return {"status": "ok"}
  

  def predict_and_explain(self, data):
    X = pd.DataFrame(data, orient='index').T

    prediction = self.model.predict(X)
    waterfall_sv, brain_sv = self.model.explain(X, 9)

    return {
      "id": str(uuid.uuid4()),
      "prediction": prediction,
      "waterfall_sv": waterfall_sv,
      "brain_sv": brain_sv
    }
