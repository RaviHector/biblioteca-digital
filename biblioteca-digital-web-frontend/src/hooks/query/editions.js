import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getEditions,
  getEditionById,
  searchByNameEditions,
  createEdition,
  updateEdition,
  deleteEdition,
  searchByEditions,
} from "../../services/api/endpoints";

export function useGetEditions({
  filters,
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useQuery({
    queryKey: ["Editions", filters],
    queryFn: () => getEditions(filters),
    onSuccess,
    onError,
  });
}

export function useGetEditionById({
  _id,
  onSucess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useQuery({
    queryKey: ["eventID", _id],
    queryFn: () => getEditionById(_id),
    onSucess,
    onError,
  });
}

export function useSearchByNameEditions({
  name,
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useQuery({
    queryKey: ["Editions", name],
    queryFn: () => searchByNameEditions(name),
    onSuccess,
    onError,
  });
}

export function useSearchEditions({
  searchTerm,
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useQuery({
    queryKey: ["Editions", searchTerm],
    queryFn: () => searchByEditions(searchTerm),
    onSuccess,
    onError,
  });
}

export function useCreateEdition({
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useMutation({
    mutationFn: createEdition,
    onSuccess,
    onError,
  });
}

export function useUpdateEdition({
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEdition,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['Editions'] });
      onSuccess(...args);
    },
    onError,
  });
}

export function useDeleteEdition({
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEdition,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['Editions'] });
      onSuccess(...args);
    },
    onError,
  });
}
