FROM tailordev/pandas
COPY ./pythonApp /app
COPY ./requirements.txt /app
WORKDIR /app
RUN pip install --upgrade pip
RUN pip install numpy --upgrade
RUN pip install --upgrade setuptools
RUN pip install -r requirements.txt
ENTRYPOINT ["python", "brain.py"]
