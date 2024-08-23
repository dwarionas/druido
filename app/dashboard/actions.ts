'use server';

import axios from 'axios';
import { UserModel } from '@/types/service';
import { createClient } from '@/lib/supabase/server';

export async function getUser(): Promise<UserModel> {
    const sb = createClient();
	const { data: { user }, error } = await sb.auth.getUser();
    
    const { data } = await axios.post('http://localhost:7060/api/user/getUser', { id: user?.id });
    return data;
}