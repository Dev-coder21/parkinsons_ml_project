# Machine Learning-Based Parkinson's Disease Detection Using Biomedical Voice Features

## 1. Project Overview

This project is an AI/ML-based research prototype for exploring patterns in biomedical voice measurements associated with Parkinson's disease.

The system uses machine learning classification algorithms to analyze numerical voice features and produce a prediction of whether the input pattern is associated with Parkinson's disease or a healthy class.

The project also includes Explainable AI (XAI) using SHAP to provide insight into which voice features contributed most to the model's prediction.

> **Important:** This is an academic and research prototype. It is not a clinical diagnostic system and its predictions must not be interpreted as a medical diagnosis.

---

## 2. Objectives

The main objectives of the project are:

- Preprocess biomedical voice data for machine learning.
- Perform exploratory data analysis (EDA).
- Analyze relationships and differences between healthy and Parkinson's classes.
- Select important voice features.
- Train and compare multiple machine learning classification models.
- Tune the selected models using hyperparameter optimization.
- Evaluate models using standard classification metrics.
- Apply Explainable AI using SHAP.
- Save the trained machine learning pipeline.
- Develop a FastAPI backend for prediction.
- Develop an interactive React frontend.
- Present model predictions and explanations through a user-friendly interface.

---

## 3. Dataset

The project uses the **UCI Parkinsons Dataset**, also known as the Oxford Parkinson's Disease Detection Dataset.

### Dataset characteristics

- **Dataset source:** UCI Machine Learning Repository
- **UCI ID:** 174
- **Number of records:** 195
- **Number of people:** 31
- **People with Parkinson's disease:** 23
- **Target variable:** `status`
- **Healthy class:** `0`
- **Parkinson's class:** `1`

The dataset contains biomedical voice measurements extracted from sustained phonation recordings.

The `name` column is treated as an identifier and is excluded from model training.

---

## 4. Voice Features

The model uses 22 biomedical voice features, including:

- Fundamental frequency measurements
- Jitter measurements
- Shimmer measurements
- Noise-to-Harmonics Ratio (NHR)
- Harmonics-to-Noise Ratio (HNR)
- Recurrence Period Density Entropy (RPDE)
- Detrended Fluctuation Analysis (DFA)
- Spread measures
- Correlation dimension (D2)
- Pitch Period Entropy (PPE)

These features represent different characteristics of vocal frequency, amplitude variation, noise, and nonlinear vocal dynamics.

---

## 5. Machine Learning Workflow

The project follows a complete machine learning lifecycle:

```text
Problem Definition
        ↓
Data Collection
        ↓
Data Understanding
        ↓
Data Preprocessing
        ↓
Exploratory Data Analysis
        ↓
Feature Selection
        ↓
Model Selection
        ↓
Model Training
        ↓
Model Evaluation
        ↓
Hyperparameter Tuning
        ↓
Explainable AI
        ↓
Model Saving
        ↓
FastAPI Backend
        ↓
React Frontend
        ↓
Prediction + Explanation