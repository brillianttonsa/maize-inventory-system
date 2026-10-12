export interface DateNormalizable {
  date?: string;
  delivery_date?: string;
}

export const formatData = <T extends DateNormalizable>(data: T[]): T[] => {
  return data.map((item) => {
    const dateField = item.delivery_date || item.date;
    if (!dateField) return item;

    const normalizedDate = dateField.slice(0, 10);

    return {
      ...item,
      delivery_date: item.delivery_date ? normalizedDate : undefined,
      date: item.date ? normalizedDate : undefined,
    };
  });
};
