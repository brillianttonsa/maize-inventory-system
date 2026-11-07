import { useState } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  operationRoundsQueryKey,
  roundsService,
  type OperationRound,
} from '../../services/roundsService';

async function refreshRoundData(
  queryClient: ReturnType<typeof useQueryClient>,
  activeRound?: OperationRound,
) {
  let rounds = queryClient.getQueryData<OperationRound[]>(operationRoundsQueryKey);
  if (activeRound) {
    rounds = rounds?.map((round) => ({ ...round, is_active: round.id === activeRound.id }));
    if (rounds) queryClient.setQueryData(operationRoundsQueryKey, rounds);
  } else {
    rounds = await queryClient.fetchQuery({
      queryKey: operationRoundsQueryKey,
      queryFn: roundsService.getAll,
      staleTime: 0,
    });
  }

  await queryClient.resetQueries({
    predicate: (query) => query.queryKey[0] !== operationRoundsQueryKey[0],
  });
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError<{ message?: string | string[] }>(error)) return fallback;
  const message = error.response?.data?.message;
  return Array.isArray(message) ? message.join(', ') : message ?? fallback;
}

export default function RoundSwitcher() {
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const roundsQuery = useQuery({
    queryKey: operationRoundsQueryKey,
    queryFn: roundsService.getAll,
  });
  const activateMutation = useMutation({
    mutationFn: roundsService.activate,
    onSuccess: async (round) => {
      setActionError(null);
      await refreshRoundData(queryClient, round);
    },
    onError: (error) => setActionError(getErrorMessage(error, 'Could not switch rounds.')),
  });
  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const round = await roundsService.create(name);
      const activeRound = await roundsService.activate(round.id);
      return { activeRound, carriedSacks: round.carried_sacks };
    },
    onSuccess: async ({ activeRound, carriedSacks }) => {
      setActionError(null);
      const carriedText = carriedSacks.length
        ? carriedSacks.map((item) => `${item.quantity} × ${item.sack_size} kg`).join(', ')
        : 'no leftover sacks';
      setActionNotice(`New round started; carried over ${carriedText}.`);
      await refreshRoundData(queryClient, activeRound);
    },
    onError: (error) => setActionError(getErrorMessage(error, 'Could not create the round.')),
  });
  const deleteMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      roundsService.remove(id, name),
    onSuccess: async () => {
      setActionError(null);
      await refreshRoundData(queryClient);
    },
    onError: (error) => setActionError(getErrorMessage(error, 'Could not delete the round.')),
  });

  const rounds = roundsQuery.data ?? [];
  const activeRound = rounds.find((round) => round.is_active);
  const isWorking =
    activateMutation.isPending || createMutation.isPending || deleteMutation.isPending;

  const createRound = () => {
    setActionError(null);
    setActionNotice(null);
    const name = window.prompt('Enter a name for the new round:')?.trim();
    if (name) createMutation.mutate(name);
  };

  const deleteRound = async () => {
    if (!activeRound || rounds.length < 2) return;
    setActionNotice(null);
    try {
      await roundsService.downloadReport(activeRound);
      const confirmation = window.prompt(
        `The ${activeRound.name} report has been downloaded. Type "${activeRound.name}" to permanently delete this round and all its records:`,
      );
      if (confirmation === null) return;
      if (confirmation !== activeRound.name) {
        setActionNotice(null);
        setActionError('The round name did not match. Nothing was deleted.');
        return;
      }
      deleteMutation.mutate({ id: activeRound.id, name: confirmation });
    } catch (error) {
      console.error('Unable to export round report:', error);
      setActionError('The round report could not be exported, so the round was not deleted.');
    }
  };

  const handleRoundChange = (id: string) => {
    setActionError(null);
    setActionNotice(null);
    activateMutation.mutate(id);
  };

  if (roundsQuery.isPending) {
    return <span className="text-sm text-gray-500">Loading rounds…</span>;
  }
  if (roundsQuery.isError) {
    return <span className="text-sm text-red-600" role="alert">Could not load rounds.</span>;
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {activeRound && (
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <span className="whitespace-nowrap">Operation round</span>
          <select
            aria-label="Active operation round"
            className="max-w-40 rounded-md border border-gray-300 bg-white px-2 py-1.5"
            value={activeRound.id}
            onChange={(event) => handleRoundChange(event.target.value)}
            disabled={isWorking}
          >
            {rounds.map((round: OperationRound) => (
              <option key={round.id} value={round.id}>{round.name}</option>
            ))}
          </select>
        </label>
      )}
      <button
        type="button"
        className="rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-medium text-black hover:bg-yellow-400 disabled:opacity-50"
        onClick={createRound}
        disabled={isWorking}
      >
        New round
      </button>
      <button
        type="button"
        className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
        onClick={deleteRound}
        disabled={isWorking || !activeRound || rounds.length < 2}
        title={rounds.length < 2 ? 'Create another round before deleting this one.' : 'Download report and delete this round'}
      >
        Export & delete
      </button>
      {isWorking && <p className="w-full text-right text-xs text-gray-500" role="status" aria-live="polite">Loading round data…</p>}
      {actionNotice && <p className="w-full text-right text-xs text-green-700" role="status">{actionNotice}</p>}
      {actionError && <p className="w-full text-right text-xs text-red-600" role="alert">{actionError}</p>}
    </div>
  );
}
