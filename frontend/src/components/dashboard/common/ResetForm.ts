import type { Dispatch, SetStateAction } from 'react';

interface ResetFormArgs<T> {
  setFormData: Dispatch<SetStateAction<T>>;
  setEditId: Dispatch<SetStateAction<string | null>>;
  initialFormData: T;
}

export const resetForm = <T,>({
  setFormData,
  setEditId,
  initialFormData,
}: ResetFormArgs<T>): void => {
  setFormData(initialFormData);
  setEditId(null);
};
