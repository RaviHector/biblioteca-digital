import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as UserEndpoints from "../../services/api/endpoints";

export function useGetUsers(filters = {}) {
  return useQuery({
    queryKey: ["Users", filters],
    queryFn: () => UserEndpoints.getUsers(filters),
    enabled: true,
  });
}

export function useCreateUserByAdmin({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserEndpoints.createUserByAdmin,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["Users"]);
      onSuccess?.(data);
    },
    onError,
  });
}

export function useUpdateUser({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserEndpoints.updateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["Users"]);
      onSuccess?.(data);
    },
    onError,
  });
}

export function useDeleteUser({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserEndpoints.deleteUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["Users"]);
      onSuccess?.(data);
    },
    onError,
  });
}