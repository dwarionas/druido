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
    <div>
      <div className="mt-4 text-center text-sm">
          {auth.Text}
          <Link href="#" className="underline" onClick={() => setType(prev => prev == 'log' ? 'reg' : 'log')}>
              {auth.Button}
          </Link>
      </div>

      {type == 'log' ? <LoginForm/> : <RegForm/>}
    </div>
  )
}
