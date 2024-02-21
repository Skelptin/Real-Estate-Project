import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const SignUp = () => {

  return (
    <section>
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>

        <form className='flex flex-col gap-4'>


          <TextField id="username" label="Username" variant="outlined" />
          <TextField id="email" label="Email" variant="outlined" />
          <TextField id="password" label="Password" variant="outlined" />

          {/* <input type='text' placeholder='Username'
            className='border p-3 rounded-lg' id='username' />

          <input type='text' placeholder='Email'
            className='border p-3 rounded-lg' id='email' />

          <input type='text' placeholder='Password'
            className='border p-3 rounded-lg' id='password' /> */}

          <button className='bg-slate-700 text-white p-3 rounded-lg 
            uppercase hover:opacity-95 disabled:opacity-80'>
            Sign Up
          </button>

        </form>
        <div className='flex gap-2 mt-5'>
          <p className='text-color-blue'>Already Have an account?</p>
          <Link to={'/signin'}>
            <span className='text-blue-700'>Sign In</span>
          </Link>

        </div>
      </div>
    </section>
  )
}

export default SignUp