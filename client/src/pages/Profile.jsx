import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRef } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserFailure, updateUserSuccess, updateUserStart } from '../redux/user/userSlice';


import CircularProgress from '@mui/material/CircularProgress';


const Profile = () => {

  const fileRef = useRef(null);
  const dispatch = useDispatch();

  const { currentUser, loading, error } = useSelector((state) => state.user)



  const [filePerc, setFilePerc] = useState('')
  const [fileError, setFileError] = useState(undefined)
  const [file, setFile] = useState(undefined)
  const [formData, setFormData] = useState({})
  console.log(formData)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
      }

      dispatch(updateUserSuccess(data))

    } catch (err) {
      dispatch(updateUserFailure(err.message))
    }
  }

  const handleChange = (e) => {

    setFormData({ ...formData, [e.target.id]: e.target.value })

  }


  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    console.log(fileName)
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setFilePerc(Math.round(progress))
      },
      (error) => {
        setFileError(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.red).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        })
      }
    )
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file])

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl my-7 font-semibold text-center'>
        Profile
      </h1>

      <form className='flex flex-col gap-3' onSubmit={handleSubmit}>
        <input accept='image/*'
          onChange={(e) => setFile(e.target.files[0])}
          hidden type='file' ref={fileRef} />
        <img
          onClick={() => fileRef.current.click()}
          src={currentUser.avatar}
          className="rounded-full flex cursor-pointer self-center mt-2 h-24 w-24 object-cover"
          alt='Profile'
        />

        <p className='text-sm self-center'>
          {
            fileError ?
              (<span className='text-red-700'>Error while uploading image</span>)
              :
              filePerc > 0 && filePerc < 100 ? (
                <span>
                  {`Uploading ${filePerc}%`}
                </span>)
                :
                (filePerc === 100 ? (
                  <span className='text-green-700'>
                    Successfully Uploaded!!
                  </span>
                ) : ""
                )
          }
        </p>

        <input
          defaultValue={currentUser.username}
          id='username'
          className='mt-6 h-12 rounded-xl w-full'
          type='text'
          placeholder='Username'
          onChange={handleChange}
        />
        <input
          defaultValue={currentUser.email}
          id='email'
          className='mt-6 h-12 rounded-xl w-full'
          type='email'
          placeholder='Email'
          onChange={handleChange}
        />
        <input
          id='password'
          className='mt-6 h-12 rounded-xl w-full'
          type='password'
          placeholder='Password'
          onChange={handleChange}
        />

        <button disabled={loading} className='bg-slate-700 text-white h-12 mt-6 rounded-2xl uppercase'>{loading ? <CircularProgress /> : 'Update'}</button>
        <button className='bg-green-600 text-white h-12 mt-2 rounded-2xl'>Create Listing</button>

      </form>
      <div className='flex justify-between mt-3 text-red-700'>
        <button>Delete Account</button>
        <button>Sign Out</button>
      </div>

      <p className='text-red-700'>{error ? error : ''}</p>
      <p className='text-green-700'>{!error && 'Successfully Updated!'}</p>

    </div>
  )
}

export default Profile