'use server';

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import axios from 'axios'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
	const supabase = createClient()

	const { error } = await supabase.auth.signInWithPassword({ 
		email: formData.get('email') as string, 
		password: formData.get('password') as string 
	})

	if (error) redirect('/error');

	revalidatePath('/', 'layout');
	redirect('/');
}

export async function signup(formData: FormData) {
	const supabase = createClient()
	const username = formData.get('username') as string;

	const { data: sbRegData, error } = await supabase.auth.signUp({
	email: formData.get('email') as string,
	password: formData.get('password') as string,
	options: {
		data: {
		username
		},
	},
	});

	if (error) {	
		redirect('/error')
	}	

  const { data: mongoRegData } = await axios.post('http://localhost:7060/api/user/create', {
	sbUserID: sbRegData.user?.id,
	email: sbRegData.user?.email,
	username: sbRegData.user?.user_metadata.username
  });

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut();

  if (error) {
	redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}