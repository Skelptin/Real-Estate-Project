import React from 'react'
import { useSelector } from 'react-redux'

const Profile = () => {

  const { currentUser } = useSelector((state) => state.user)



  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl my-7 font-semibold text-center'>
        Profile
      </h1>

      <form className='flex flex-col gap-3'>
        <img
          src={currentUser.avatar}
          className="rounded-full flex self-center mt-2 h-24 w-24 object-cover"
          alt='Profile'
        />

        <input
          id='username'
          className='mt-6 h-12 rounded-xl w-full'
          type='text'
          placeholder='Username'
        />
        <input
          id='email'
          className='mt-6 h-12 rounded-xl w-full'
          type='email'
          placeholder='Email'
        />
        <input
          id='password'
          className='mt-6 h-12 rounded-xl w-full'
          type='password'
          placeholder='Password'
        />

        <button className='bg-slate-700 text-white h-12 mt-6 rounded-2xl uppercase'>update</button>
        <button className='bg-green-600 text-white h-12 mt-2 rounded-2xl'>Create Listing</button>

        <div className='flex justify-between mt-3 text-red-700'>
          <button>Delete Account</button>
          <button>Sign Out</button>
        </div>
      </form>
    </div>
  )
}

export default Profile