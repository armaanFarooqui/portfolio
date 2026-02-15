# Agricultural Field Boundary Detection

### Edge-Based Segmentation | Ens, The Netherlands (EPSG:28992)

## Overview

This project implements a deterministic computer vision pipeline to extract agricultural parcel boundaries from high-resolution orthophoto imagery (0.25 m resolution).

The workflow converts RGB raster data into clean vector field polygons and reconstructed parcel masks using classical image processing and geospatial methods.

## Data

* **Source:** Beeldmateriaal 2025 - Zomervlucht Orthofotomozaïek (RGB)
* **Location:** Ens, Flevoland, Netherlands (4 × 4 km subset)
* **Format:** GeoTIFF (3-band RGB)
* **CRS:** EPSG:28992 (Amersfoort / RD New)
* **Resolution:** 0.25 m
* **Dimensions:** 16,000 × 16,000 pixels



## Methodology

1. **Pre-processing**
   Gaussian smoothing (5×5 kernel, σ=2) for noise reduction.

2. **Edge Detection**
   Grayscale conversion and Canny operator with threshold analysis.

3. **Morphological Refinement**
   Dilation → Closing → Opening to ensure edge continuity.

4. **Vectorisation**
   Raster-to-polygon extraction with area filtering and geometry simplification.

5. **Raster Reconstruction**
   Polygon rasterisation aligned to the original CRS grid.



## Outputs

* output_vector.geojson: extracted field boundaries
* output_raster.tif: parcel mask (CRS-aligned)



## Technical Stack

Python · OpenCV · Rasterio · rioxarray · GeoPandas · NumPy



## Project Relevance

* Demonstrates structured pipeline design
* Integrates computer vision with geospatial data engineering
* Performs raster–vector transformations
* Uses CRS-aware spatial processing
* Fully reproducible and deterministic workflow

This project showcases a classical segmentation approach that can serve as a foundation for future machine learning-based parcel detection systems.