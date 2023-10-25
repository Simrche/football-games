import { createClient } from "@supabase/supabase-js";
export default ({ app }, inject) => {
    const supabaseUrl = process.env.supabaseUrl;
    const supabaseKey = process.env.supabaseKey;
    const supabase = createClient(supabaseUrl, supabaseKey);

    inject("supabase", supabase);
};
