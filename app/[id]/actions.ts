'use server';

import axios from 'axios'
import { UrlModel, UserModel } from '@/types/service';
import { createClient } from '@/lib/supabase/server';

export async function create(args: FormData): Promise<UrlModel> {
    const sb = createClient();
	const { data: { user }, error } = await sb.auth.getUser();

    const { data } = await axios.post('http://localhost:7060/api/url/create', 
        { 
            originalURL: args.get('link'),
            name: args.get('name'),
            sbUserID: user?.id
        }
    );

    return data;
}

export async function check(id: string): Promise<UrlModel> {
    const { data } = await axios.post('http://localhost:7060/api/url/check', { id });
    return data;
}