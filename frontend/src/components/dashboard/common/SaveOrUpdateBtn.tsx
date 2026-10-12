interface SaveOrUpdateBtnProps {
  editId: string | null;
  handleCancelEdit: () => void;
  saving: boolean;
  type: string;
}

export const SaveOrUpdateBtn = ({
  editId,
  handleCancelEdit,
  saving,
  type,
}: SaveOrUpdateBtnProps) => {
  return (
    <>
      {editId ? (
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleCancelEdit}
            className="w-full py-2 px-4 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 transition-colors"
            disabled={saving}
          >
            Cancel Edit
          </button>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
            disabled={saving}
          >
            {saving ? 'Updating...' : 'Update' + type}
          </button>
        </div>
      ) : (
        <button
          type="submit"
          className="w-full py-2 px-4 bg-yellow-500 text-white font-medium rounded-md hover:bg-yellow-600 transition-colors"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Record ' + type}
        </button>
      )}
    </>
  );
};
