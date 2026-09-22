from pathlib import Path

import joblib # type: ignore
import pandas as pd # type: ignore

from backend.services.explanation import generate_shap_explanation


BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_PATH = BASE_DIR / "models" / "parkinsons_pipeline.joblib"
DATA_PATH = BASE_DIR / "data" / "parkinsons.csv"


# Load trained ML pipeline
artifacts = joblib.load(MODEL_PATH)

scaler = artifacts["scaler"]
selector = artifacts["selector"]
model = artifacts["model"]
selected_features = artifacts["selected_features"]


FEATURE_NAME_MAP = {
    "MDVP_Fo": "MDVP:Fo",
    "MDVP_Fhi": "MDVP:Fhi",
    "MDVP_Flo": "MDVP:Flo",
    "MDVP_Jitter_percent": "MDVP:Jitter(%)",
    "MDVP_Jitter_Abs": "MDVP:Jitter(Abs)",
    "MDVP_RAP": "MDVP:RAP",
    "MDVP_PPQ": "MDVP:PPQ",
    "Jitter_DDP": "Jitter:DDP",
    "MDVP_Shimmer": "MDVP:Shimmer",
    "MDVP_Shimmer_dB": "MDVP:Shimmer(dB)",
    "Shimmer_APQ3": "Shimmer:APQ3",
    "Shimmer_APQ5": "Shimmer:APQ5",
    "MDVP_APQ": "MDVP:APQ",
    "Shimmer_DDA": "Shimmer:DDA",
    "NHR": "NHR",
    "HNR": "HNR",
    "RPDE": "RPDE",
    "DFA": "DFA",
    "spread1": "spread1",
    "spread2": "spread2",
    "D2": "D2",
    "PPE": "PPE",
}


MODEL_FEATURE_ORDER = [
    "MDVP:Fo",
    "MDVP:Fhi",
    "MDVP:Flo",
    "MDVP:Jitter(%)",
    "MDVP:Jitter(Abs)",
    "MDVP:RAP",
    "MDVP:PPQ",
    "Jitter:DDP",
    "MDVP:Shimmer",
    "MDVP:Shimmer(dB)",
    "Shimmer:APQ3",
    "Shimmer:APQ5",
    "MDVP:APQ",
    "Shimmer:DDA",
    "NHR",
    "HNR",
    "RPDE",
    "DFA",
    "spread1",
    "spread2",
    "D2",
    "PPE",
]


# ---------------------------------------------------------
# Prepare SHAP background data
# ---------------------------------------------------------

training_data = pd.read_csv(DATA_PATH)

background_features = training_data.drop(
    columns=["status"],
    errors="ignore",
)

background_features = background_features[MODEL_FEATURE_ORDER]

background_scaled = scaler.transform(background_features)

background_selected = selector.transform(background_scaled)

background_selected_df = pd.DataFrame(
    background_selected,
    columns=selected_features,
)

# Keep the SHAP background reasonably small.
background_selected_df = background_selected_df.sample(
    n=min(50, len(background_selected_df)),
    random_state=42,
)


def predict_parkinsons(features: dict) -> dict:
    """
    Run the complete Parkinson's prediction pipeline and
    generate a SHAP explanation for the prediction.
    """

    # Convert API field names into dataset feature names.
    mapped_features = {
        FEATURE_NAME_MAP[key]: value
        for key, value in features.items()
    }

    # Put features in exactly the same order used during training.
    input_df = pd.DataFrame(
        [mapped_features],
        columns=MODEL_FEATURE_ORDER,
    )

    # Apply the same preprocessing used during training.
    scaled_data = scaler.transform(input_df)

    selected_data = selector.transform(scaled_data)

    # Model prediction.
    prediction = int(model.predict(selected_data)[0])

    probability = float(
        model.predict_proba(selected_data)[0][1]
    )

    result = (
        "Parkinson's"
        if prediction == 1
        else "Healthy"
    )

    # -----------------------------------------------------
    # SHAP explanation
    # -----------------------------------------------------

    selected_input_df = pd.DataFrame(
        selected_data,
        columns=selected_features,
    )

    shap_explanation = generate_shap_explanation(
        model=model,
        background_data=background_selected_df,
        input_data=selected_input_df,
        feature_names=selected_features,
    )

    return {
        "prediction": prediction,
        "result": result,
        "parkinsons_probability": round(probability, 4),
        "healthy_probability": round(1 - probability, 4),
        "explanation": shap_explanation,
    }