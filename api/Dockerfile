FROM python:3.12.4
WORKDIR /usr/api
RUN pip install --upgrade pip
RUN apt-get update && apt-get install -y libhdf5-dev
RUN pip install --no-binary h5py h5py
COPY requirements.txt .
RUN pip install -r ./requirements.txt
COPY . .
CMD ["python", "main.py"]