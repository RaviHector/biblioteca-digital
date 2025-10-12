import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getEvents,
  getEventById,
  searchByNameEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  searchByEvents,
} from "../../services/api/endpoints";

export function useGetEvents({
  filters,
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useQuery({
    queryKey: ["Events", filters],
    queryFn: () => getEvents(filters),
    onSuccess,
    onError,
  });
}

export function useGetEventById({
  _id,
  onSucess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useQuery({
    queryKey: ["eventID", _id],
    queryFn: () => getEventById(_id),
    onSucess,
    onError,
  });
}

export function useSearchByNameEvents({
  name,
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useQuery({
    queryKey: ["Events", name],
    queryFn: () => searchByNameEvents(name),
    onSuccess,
    onError,
  });
}

export function useSearchEvents({
  searchTerm,
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useQuery({
    queryKey: ["Events", searchTerm],
    queryFn: () => searchByEvents(searchTerm),
    onSuccess,
    onError,
  });
}

export function useCreateEvent({
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useMutation({
    mutationFn: createEvent,
    onSuccess,
    onError,
  });
}

export function useUpdateEvent({
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEvent,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['Events'] });
      onSuccess(...args);
    },
    onError,
  });
}

export function useDeleteEvent({
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['Events'] });
      onSuccess(...args);
    },
    onError,
  });
}
