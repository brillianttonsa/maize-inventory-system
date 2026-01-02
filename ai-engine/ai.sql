SELECT
    date,
    product_type,
    SUM(quantity) AS total_quantity
FROM sales
WHERE user_id = 1
GROUP BY date, product_type
ORDER BY date;
