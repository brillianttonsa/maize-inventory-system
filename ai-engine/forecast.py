# import pandas as pd

# def prepare_product_series(df, product_type):
#     # 1. filter product
#     product_df = df[df["product_type"] == product_type].copy()

#     # 2. aggregate again just to be safe
#     product_df = product_df.groupby("date")["total_quantity"].sum().reset_index()

#     # 3. set date as index
#     product_df = product_df.set_index("date")

#     # 4. build full daily date range
#     full_range = pd.date_range(
#         start=product_df.index.min(),
#         end=product_df.index.max(),
#         freq="D"
#     )

#     # 5. reindex & fill missing days with 0
#     product_df = product_df.reindex(full_range, fill_value=0)
#     product_df.index.name = "date"

#     return product_df


# def create_features(series_df):
#     df = series_df.copy()

#     # lag features
#     df["lag_1"] = df["total_quantity"].shift(1)

#     # rolling averages
#     df["rolling_7"] = df["total_quantity"].rolling(window=7).mean()
#     df["rolling_14"] = df["total_quantity"].rolling(window=14).mean()

#     # drop rows with NaN values
#     df = df.dropna()

#     return df


# phase 1 - 3 up..

import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

def prepare_product_series(df, product_type):
    product_df = df[df["product_type"] == product_type].copy()
    if product_df.empty:
        raise ValueError(f"No sales data found for product_type='{product_type}'")
    product_df = product_df.groupby("date")["total_quantity"].sum().reset_index()
    product_df = product_df.set_index("date")
    full_range = pd.date_range(start=product_df.index.min(),
                               end=product_df.index.max(), freq="D")
    product_df = product_df.reindex(full_range, fill_value=0)
    product_df.index.name = "date"
    return product_df

def create_features(series_df):
    df = series_df.copy()
    df["lag_1"] = df["total_quantity"].shift(1)
    df["rolling_7"] = df["total_quantity"].rolling(7).mean()
    df["rolling_14"] = df["total_quantity"].rolling(14).mean()
    df = df.dropna()
    return df

def train_model(feature_df):
    X = feature_df[["lag_1", "rolling_7", "rolling_14"]]
    y = feature_df["total_quantity"]
    model = LinearRegression()
    model.fit(X, y)
    return model

# def forecast_next_days(feature_df, model, n_days=7):
#     last_data = feature_df.copy()
#     predictions = []
#     for i in range(n_days):
#         last_row = last_data.iloc[-1]
#         lag_1 = last_row["total_quantity"]
#         rolling_7 = last_data["total_quantity"].tail(7).mean()
#         rolling_14 = last_data["total_quantity"].tail(14).mean()
#         X_new = np.array([[lag_1, rolling_7, rolling_14]])
#         y_pred = model.predict(X_new)[0]
#         predictions.append(y_pred)
#         last_data = pd.concat([
#             last_data,
#             pd.DataFrame({
#                 "total_quantity": [y_pred],
#                 "lag_1": [lag_1],
#                 "rolling_7": [rolling_7],
#                 "rolling_14": [rolling_14]
#             }, index=[last_data.index[-1] + pd.Timedelta(days=1)])
#         ])
#     forecast_dates = [last_data.index[-n_days + i] for i in range(n_days)]
#     forecast_df = pd.DataFrame({
#         "date": forecast_dates,
#         "predicted_quantity": predictions
#     })
#     return forecast_df

def forecast_next_days(feature_df, model, n_days=7):
    """
    Forecast next n_days of demand using trained LinearRegression model.
    - feature_df: DataFrame with total_quantity, lag_1, rolling_7, rolling_14
    - model: trained sklearn model
    Returns: DataFrame with dates and predicted_quantity
    """
    last_data = feature_df.copy()
    predictions = []

    for i in range(n_days):
        last_row = last_data.iloc[-1]

        # compute features
        lag_1 = last_row["total_quantity"]
        rolling_7 = last_data["total_quantity"].tail(7).mean()
        rolling_14 = last_data["total_quantity"].tail(14).mean()

        # keep feature names as DataFrame to avoid sklearn warning
        X_new = pd.DataFrame([[lag_1, rolling_7, rolling_14]],
                             columns=["lag_1", "rolling_7", "rolling_14"])

        # predict
        y_pred = model.predict(X_new)[0]

        # force non-negative
        y_pred = max(0, y_pred)

        # append prediction
        predictions.append(y_pred)

        # add predicted row to last_data for next iteration
        last_data = pd.concat([
            last_data,
            pd.DataFrame({
                "total_quantity": [y_pred],
                "lag_1": [lag_1],
                "rolling_7": [rolling_7],
                "rolling_14": [rolling_14]
            }, index=[last_data.index[-1] + pd.Timedelta(days=1)])
        ])

    # build forecast DataFrame
    forecast_dates = [last_data.index[-n_days + i] for i in range(n_days)]
    forecast_df = pd.DataFrame({
        "date": forecast_dates,
        "predicted_quantity": predictions
    })

    return forecast_df
