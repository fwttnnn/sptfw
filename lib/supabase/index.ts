import { createClient } from "@supabase/supabase-js"

const client = (process.env.SPTFW_SUPABASE_URL && process.env.SPTFW_SUPABASE_KEY)
              ? createClient(process.env.SPTFW_SUPABASE_URL, process.env.SPTFW_SUPABASE_KEY)
              : null

export default client
                            
