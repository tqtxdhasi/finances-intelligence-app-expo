// lib/db/product/deleteProductById.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { executeQuery } from "../executeQuery";
import { useUser } from "../useUser";
import { PRODUCTS_QUERY_KEY } from "./createProduct"; // or shared constants file

// ----------------------------------------------------------------------
// Low‑level service function
// ----------------------------------------------------------------------
export const deleteProductById = async (id: string): Promise<void> => {
  await executeQuery("DELETE FROM products WHERE id = ?", [id]);
};

// ----------------------------------------------------------------------
// React Query hook
// ----------------------------------------------------------------------
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { userId } = useUser();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error("User not authenticated");
      await deleteProductById(id);
    },
    onSuccess: () => {
      // Invalidate the products list cache
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
};
