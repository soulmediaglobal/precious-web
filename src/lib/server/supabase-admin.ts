import { createClient } from '@supabase/supabase-js';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export function createSupabaseAdminClient() {
	const supabaseUrl = publicEnv.PUBLIC_SUPABASE_URL;
	const supabaseSecretKey = privateEnv.SUPABASE_SECRET_KEY;

	if (!supabaseUrl || !supabaseSecretKey) {
		throw new Error('Supabase admin environment variables are not set');
	}

	return createClient(supabaseUrl, supabaseSecretKey, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
			detectSessionInUrl: false
		}
	});
}
