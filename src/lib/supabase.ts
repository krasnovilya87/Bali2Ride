import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fpwaifhpfzzkantsalrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwd2FpZmhwZnp6a2FudHNhbHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NzAyNDUsImV4cCI6MjA5MzE0NjI0NX0.cuCc2UaBX6M9M7JScvbKjIY8oavq90zbGcY8domcHU8'

export const supabase = createClient(supabaseUrl, supabaseKey)