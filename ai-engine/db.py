import psycopg2
import pandas as pd

def get_sales_data(user_id):
    conn = psycopg2.connect(
        dbname="maizedb",
        user="postgres",
        password="tonsa000",
        host="localhost",
        port="2004"
    )

    query = """
    SELECT date, product_type, SUM(quantity) AS total_quantity
    FROM sales
    WHERE user_id = %s
    GROUP BY date, product_type
    ORDER BY date;
    """

    df = pd.read_sql(query, conn, params=(user_id,))
    conn.close()

    return df
