import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

const Profile = () => {

  const fileRef = useRef(null);

  const { currentUser } = useSelector((state) => state.user)

  const [filePerc, setFilePerc] = useState('')
  const [fileError, setFileError] = useState(undefined)
  const [file, setFile] = useState(undefined)
  const [formData, setFormData] = useState({})


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

      <form className='flex flex-col gap-3'>
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