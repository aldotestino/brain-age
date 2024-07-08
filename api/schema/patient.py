from typing import Any
from pydantic import BaseModel, Field, create_model
from utils import cols
import pandas as pd

patient_fields = {col: (float, Field(...)) for col in cols}

PatientDynamic = create_model('PatientDynamic', **patient_fields)

class PatientBase(BaseModel):
    def to_df(self):
        return pd.DataFrame.from_dict(self.model_dump(), orient='index').T

class Patient(PatientBase, PatientDynamic):
    pass