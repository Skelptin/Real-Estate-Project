import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const SignUp = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true)
    try {

      const res = await fetch('/api/auth/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setError(null)
      setLoading(false)
      navigate('/signin')
    } catch (err) {
      setLoading(false)
      console.log(err.message)
    }
  };

  console.log(formData)

  return (
    <section>
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

          <TextField
            required
            onChange={handleChange}
            id="username" label="Username" variant="outlined" />
          <TextField
            required
            onChange={handleChange}
            id="email" label="Email" variant="outlined" />
          <TextField
            required
            onChange={handleChange}
            id="password" label="Password" variant="outlined" />

          {/* <input  onChange={handleChange} type='text' placeholder='Username'
            className='border p-3 rounded-lg' id='username' />

          <input  onChange={handleChange} type='text' placeholder='Email'
            className='border p-3 rounded-lg' id='email' />

          <input  onChange={handleChange} type='text' placeholder='Password'
            className='border p-3 rounded-lg' id='password' /> */}

          <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg 
            uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? 'Loading' : 'Sign Up'}
          </button>

        </form>
        <div className='flex gap-2 mt-5'>
          <p className='text-color-blue'>Already Have an account?</p>
          <Link to={'/signin'}>
            <span className='text-blue-700'>Sign In</span>
          </Link>

        </div>
        {error && <p className='text-red-700'>{error}</p>}
      </div>
    </section>
  )
}

export default SignUp