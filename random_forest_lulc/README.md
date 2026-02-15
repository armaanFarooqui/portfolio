# Land-Cover Classification with Random Forest

### Supervised Pixel-wise LULC Mapping | Almere, The Netherlands

## Overview

This project implements a supervised machine learning pipeline to classify land cover at pixel level using multi-band Sentinel-2 imagery and derived spectral indices.

The workflow integrates feature engineering, model evaluation, sensitivity analysis, and georeferenced raster reconstruction.



## Data

### Satellite Imagery

* **Source:** Sentinel-2 MSI Level-2A (ESA)
* **Product ID:** S2C_MSIL2A_20250819T104041_N0511_R008_T31UFU
* **Tile:** 31UFU
* **Acquisition Date:** 19 August 2025
* **Cloud Cover:** 5.6%
* **Processing Level:** Surface Reflectance (L2A)
* **Spatial Resolution:** 10 m (Blue, Green, Red, NIR)
* **CRS:** EPSG:4326 (WGS 84)
* **AOI Extent:**
  5.1213869, 52.2461868 : 5.5551703, 52.4665174

A 4-band RGB+NIR raster was created by clipping the Sentinel-2 tile to the Almere area of interest.



### Label Data

* **Source:** ESA WorldCover Map Version 2 (2021)
* **Format:** GeoTIFF
* **CRS:** EPSG:4326
* **Resolution:** ~10 m
* **Reclassified Into:** Built-up / Vegetation / Water

WorldCover labels were clipped and reprojected to match the Sentinel-2 feature grid prior to training.

## Methodology

1. **Feature Engineering**
   Spectral bands (Blue, Green, Red, NIR) with derived indices (NDVI, NDWI).

2. **Label Processing**
   Reclassification into Built-up / Vegetation / Water classes.

3. **Model Training**
   Stratified train-test split with Random Forest classifier.

4. **Model Diagnostics**
   Confusion matrix, feature importance, ablation study, and hyperparameter sweeps.

5. **Full-Scene Inference**
   Pixel-wise prediction and CRS-preserving GeoTIFF export.



## Performance

* 95% test accuracy
* Strong vegetation and water separability
* Robust performance under hyperparameter variation
* 99% full-scene inference accuracy



## Outputs

* predicted_lulc.tif: classified land-cover raster (CRS-aligned)



## Technical Stack

Python · scikit-learn · rioxarray · xarray · NumPy · Matplotlib



## Project Relevance

* Demonstrates supervised ML pipeline design
* Applies feature engineering with physically meaningful indices
* Performs structured model evaluation and sensitivity analysis
* Deploys spatially consistent raster inference

This project showcases a complete classical machine learning workflow for geospatial image classification and forms a foundation for more advanced deep learning segmentation systems.