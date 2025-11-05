export const formatData = (data) => {
    return data.map((item) => {
      const dateField = item.delivery_date || item.date; // detect which one exists
      if (!dateField) return item; // skip if no date field
  
      const date = new Date(dateField);
      date.setDate(date.getDate() + 1);
  
      return {
        ...item,
        delivery_date: item.delivery_date
          ? date.toISOString().slice(0, 10)
          : undefined,
        date: item.date ? date.toISOString().slice(0, 10) : undefined,
      };
    });
  };
  