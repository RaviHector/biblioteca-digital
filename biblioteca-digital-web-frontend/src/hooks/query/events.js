import { useMutation, useQuery } from "@tanstack/react-query";

import {
  getEvents,
  getEventById,
  searchByNameEvents,
  createEvent,
  updateEvent,
  deleteEvent,
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
  return useMutation({
    mutationFn: updateEvent,
    onSuccess,
    onError,
  });
}

export function useDeleteEvent({
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useMutation({
    mutationFn: deleteEvent,
    onSuccess,
    onError,
  });
}
