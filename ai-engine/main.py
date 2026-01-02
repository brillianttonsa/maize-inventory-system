# phase 1

# from db import get_sales_data
import pandas as pd

# df = get_sales_data(user_id=3)
# df["date"] = pd.to_datetime(df["date"])

# print(df.head())
# print(df.dtypes)


# phase 2
# from db import get_sales_data
# from forecast import prepare_product_series, create_features

# df = get_sales_data(user_id=3)

# # ensure datetime
# df["date"] = pd.to_datetime(df["date"])

# flour_df = prepare_product_series(df, "flour")

# print(flour_df.head(15))
# print(flour_df.tail(5))
# print(flour_df.dtypes)


# # phase 3 
# from db import get_sales_data
# from forecast import prepare_product_series, create_features
# import pandas as pd

# df = get_sales_data(user_id=3)
# df["date"] = pd.to_datetime(df["date"])
# df["product_type"] = df["product_type"].str.strip().str.lower()

# flour_series = prepare_product_series(df, "flour")
# feature_df = create_features(flour_series)

# print(feature_df.head())
# print(feature_df.tail())
# print(feature_df.dtypes)




from db import get_sales_data
from forecast import prepare_product_series, create_features, train_model, forecast_next_days

# 1️⃣ Load data
df = get_sales_data(user_id=3)

# 2️⃣ Clean & normalize product names
df["date"] = pd.to_datetime(df["date"])
df["product_type"] = df["product_type"].str.strip().str.lower()

# 3️⃣ Prepare series for flour
flour_series = prepare_product_series(df, "flour")

# 4️⃣ Create features
feature_df = create_features(flour_series)

# 5️⃣ Train model
model = train_model(feature_df)

# 6️⃣ Forecast next 7 days
forecast_df = forecast_next_days(feature_df, model, n_days=7)

print(forecast_df)
