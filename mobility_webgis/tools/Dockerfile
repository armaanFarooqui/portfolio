FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
  python3 python3-venv python3-pip \
  gdal-bin python3-gdal \
  osmium-tool \
  postgresql-client \
  curl unzip ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Create venv and install requests inside it
COPY requirements.txt /tmp/requirements.txt

RUN python3 -m venv /opt/venv \
  && /opt/venv/bin/pip install --no-cache-dir --upgrade pip \
  && /opt/venv/bin/pip install --no-cache-dir -r /tmp/requirements.txt
  
# Make venv python/pip the default
ENV PATH="/opt/venv/bin:$PATH"

RUN pip install --no-cache-dir jupyterlab

WORKDIR /scripts