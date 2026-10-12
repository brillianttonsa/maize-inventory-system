export interface NotesFormData {
  notes: string;
}

export const checkingValidityCountOfNote = (name: string, value: string): boolean => {
  if (name === 'notes') {
    const words = value.trim().split(/\s+/).filter(Boolean);
    // Allows up to 3 words
    return words.length > 3;
  }
  return false;
};

export const wordCounts = (formData: NotesFormData): number => {
  return formData.notes.trim().split(/\s+/).filter(Boolean).length;
};
