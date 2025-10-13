import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getArticle,
  getArticleById,
  searchByNameArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  searchByArticle,
} from "../../services/api/endpoints";

export function useGetArticle({
  filters,
  enabled = true,
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useQuery({
    queryKey: ["Article", filters],
    queryFn: () => getArticle(filters),
    enabled,
    onSuccess,
    onError,
  });
}

export function useGetArticleById({
  _id,
  onSucess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useQuery({
    queryKey: ["eventID", _id],
    queryFn: () => getArticleById(_id),
    onSucess,
    onError,
  });
}

export function useSearchByNameArticle({
  name,
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useQuery({
    queryKey: ["Article", name],
    queryFn: () => searchByNameArticle(name),
    onSuccess,
    onError,
  });
}

export function useSearchArticle({
  name,
  enabled = true,
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useQuery({
    queryKey: ["SearchArticle", name],
    queryFn: () => searchByArticle(name),
    enabled: enabled && Boolean(name),
    onSuccess,
    onError,
  });
}

export function useCreateArticle({
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useMutation({
    mutationFn: createArticle,
    onSuccess,
    onError,
  });
}

export function useUpdateArticle({
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateArticle,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["Article"] });
      onSuccess(...args);
    },
    onError,
  });
}

export function useDeleteArticle({
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteArticle,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["Article"] });
      onSuccess(...args);
    },
    onError,
  });
}
