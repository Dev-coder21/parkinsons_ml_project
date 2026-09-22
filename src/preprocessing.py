import pandas as pd # type: ignore


def clean_feature_names(X: pd.DataFrame) -> pd.DataFrame:
    """
    Make all feature names unique while preserving every feature.
    """

    X = X.copy()

    new_columns = [
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

    if len(X.columns) != len(new_columns):
        raise ValueError(
            f"Expected {len(new_columns)} features, "
            f"but received {len(X.columns)}."
        )

    X.columns = new_columns

    return X


def prepare_data(features: pd.DataFrame, targets: pd.DataFrame):
    """
    Prepare the Parkinson's dataset for machine learning.

    Steps:
    1. Copy the input data.
    2. Remove the recording/subject identifier.
    3. Convert target to integer.
    4. Ensure feature names are unique.
    5. Return X and y.
    """

    X = features.copy()
    y = targets.copy()

    # Remove identifier
    X = X.drop(columns=["name"], errors="ignore")

    # Ensure unique, meaningful feature names
    X = clean_feature_names(X)

    # Convert target to a 1D integer Series
    y = y.squeeze().astype(int)

    # Validate missing values
    if X.isnull().sum().sum() > 0:
        raise ValueError("Feature dataset contains missing values.")

    if y.isnull().sum() > 0:
        raise ValueError("Target dataset contains missing values.")

    return X, y