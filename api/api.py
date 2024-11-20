from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from model import Model
from schema.patient import Patient

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
  

  def predict_and_explain(self, data: Patient):
    X = data.to_df()

    prediction, waterfall_sv, brain_sv = self.model.predict_and_explain(X)

    return {
      "prediction": prediction,
      "waterfall_sv": waterfall_sv,
      "brain_sv": brain_sv
    }
