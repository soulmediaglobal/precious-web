import type { SupabaseClient, User } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			getUser: () => Promise<User | null>;
			cmsUser: {
				userId: string;
				role: 'admin' | 'director' | 'manager' | 'staff';
				isActive: boolean;
				createdAt: Date;
				updatedAt: Date;
			} | null;
		}
	}
}

export {};
