import shap # type: ignore
import pandas as pd # type: ignore


def generate_shap_explanation(
    model,
    background_data: pd.DataFrame,
    input_data: pd.DataFrame,
    feature_names: list[str],
):
    """
    Generate SHAP feature contributions for the Parkinson's prediction.

    The explanation focuses on the model's estimated probability of
    Parkinson's (class 1).
    """

    background = background_data.copy()
    sample = input_data.copy()

    # Model-agnostic SHAP explainer.
    # We explain the probability of class 1.
    def predict_probability(data):
        return model.predict_proba(data)[:, 1]

    explainer = shap.Explainer(
        predict_probability,
        background,
        feature_names=feature_names,
    )

    shap_result = explainer(sample)

    values = shap_result.values[0]

    # Convert feature contributions into a clean dataframe.
    explanation_df = pd.DataFrame(
        {
            "feature": feature_names,
            "value": sample.iloc[0].values,
            "shap_value": values,
        }
    )

    # Largest absolute contributions first.
    explanation_df["absolute_impact"] = explanation_df[
        "shap_value"
    ].abs()

    explanation_df = explanation_df.sort_values(
        "absolute_impact",
        ascending=False,
    )

    top_features = []

    for _, row in explanation_df.head(8).iterrows():
        impact = float(row["shap_value"])

        top_features.append(
            {
                "feature": row["feature"],
                "value": float(row["value"]),
                "shap_value": round(impact, 6),
                "impact": (
                    "increases Parkinson's probability"
                    if impact > 0
                    else "decreases Parkinson's probability"
                ),
            }
        )

    return {
        "top_features": top_features,
        "base_value": float(shap_result.base_values[0]),
    }