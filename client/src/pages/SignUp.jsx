import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Building from '../assets/signUpBuilding.png'
import SignUpBg from '../assets/signUpBg.jpg'
import './SignUp.css'
import OAuth from '../components/OAuth';

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const SignUp = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)


  const handleShowPassword = () => {
    showPassword ? setShowPassword(false) : setShowPassword(true)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    console.log(formData)
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


  return (
    <div className="relative">

      <section className="absolute w-full top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">

        <div className=" box p-10 transparent max-w-lg rounded-3xl mx-auto backdrop-filter backdrop-blur-lg">
          <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
              InputProps={{ sx: { borderRadius: '2rem' } }}
              required
              onChange={handleChange}
              id="username"
              label="Username"
              variant="outlined"
            />
            <TextField
              InputProps={{ sx: { borderRadius: '2rem' } }}
              required
              onChange={handleChange}
              id="email"
              label="Email"
              variant="outlined"
            />
            <TextField
              type={showPassword ? 'text' : 'password'}
              required
              onChange={handleChange}
              id="password"
              label="Password"
              variant="outlined"
              InputProps={{
                sx: { borderRadius: '2rem' },
                endAdornment: (
                  <button type="button" onClick={handleShowPassword} id="showPassword">
                    {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                  </button>
                ),
              }}
            />

            <button
              disabled={loading}
              className="bg-slate-700 rounded-xl text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            >
              {loading ? 'Loading' : 'Sign Up'}
            </button>

            <OAuth />
          </form>
          <div className="flex gap-2 mt-5">
            <p className="text-color-blue">Already Have an account?</p>
            <Link to={'/signin'}>
              <span className="text-blue-700">Sign In</span>
            </Link>
          </div>
          {error && <p className="text-red-700">{error}</p>}
        </div>
      </section>
      <img src={SignUpBg} alt="background" className="w-full h-full object-cover" />
    </div>
  )
}

export default SignUp