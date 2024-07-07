'use client';

import Link from 'next/link';
import { useState } from 'react'
import LoginForm from './Login';
import { RegForm } from './Register';

export default function AuthForm() {
  const [type, setType] = useState<'log' | 'reg'>('log');

  const auth = {
    Text: type == 'log' ? <>Don&apos;t have an account?{" "}</> : <>Already have an account?{" "}</>,
    Button: type == 'log' ? <>Sign up</> : <>Log in</>
  }

  return (
    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
      {type == 'log' ? <LoginForm/> : <RegForm/>}

      <div className="mt-4 text-center text-sm">
          {auth.Text}
          <Link href="#" className="underline" onClick={() => setType(prev => prev == 'log' ? 'reg' : 'log')}>
            {auth.Button}
          </Link>
      </div>
    </div>
  )
}
