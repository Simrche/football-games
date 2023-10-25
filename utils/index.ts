import { useContext } from "@nuxtjs/composition-api";

export function useSupabase() {
    const { $supabase } = useContext();

    return $supabase;
}
