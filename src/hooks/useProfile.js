import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import useStore from "../store/useStore";

export const useProfile = () => {
  const { user } = useStore();

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id, // Only run the query if a user is logged in
  });
};
