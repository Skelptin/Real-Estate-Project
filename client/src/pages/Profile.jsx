import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useRef } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserFailure, updateUserSuccess, updateUserStart,
  deleteUserFailure, deleteUserStart, deleteUserSuccess,
  signOutFailure, signOutStart, signOutSuccess
} from '../redux/user/userSlice';
import { MdDeleteForever } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



const Profile = () => {

  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser, loading, error } = useSelector((state) => state.user)



  const [filePerc, setFilePerc] = useState('')
  const [fileError, setFileError] = useState(undefined)
  const [file, setFile] = useState(undefined)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [showListingError, setShowListingError] = useState(false)
  const [listingData, setListingData] = useState([])


  console.log(listingData)

  const handleListing = () => {
    navigate('/create-listing')

  }

  const handleOpenDialog = () => {
    setOpenDialog(true);
  }


  const handleCloseDialog = () => {
    setOpenDialog(false);
  }


  const handleSignOut = async () => {
    try {

      dispatch(signOutStart());

      const res = await fetch('/api/auth/signout', {
        method: 'GET',
      })

      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }

      dispatch(signOutSuccess(data))

    } catch (err) {
      dispatch(signOutFailure(err.message))
    }
  }

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
      setUpdateSuccess(true)

    } catch (err) {
      dispatch(updateUserFailure(err.message))
    }
  }

  const handleChange = (e) => {

    setFormData({ ...formData, [e.target.id]: e.target.value })

  }

  const handleDelete = async (e) => {
    try {

      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE'
      })

      const data = await res.json();

      if (data.success === false) {
        handleCloseDialog();
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      handleCloseDialog();

    } catch (err) {

      dispatch(deleteUserFailure((err.message)));

    }
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
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        })
      }
    )
  };


  const handleShowListing = async () => {
    try {
      setShowListingError(false)
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }

      setListingData(data);

    } catch (err) {
      setShowListingError(true);
    }
  }

  const handleDeleteListing = async (id) => {
    try {

      const res = await fetch(`/api/listing/delete/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json();
      if (data.success === false) {
        console.log()
        return
      }

      setListingData((prev) => prev.filter((listing) => listing._id !== id))

    } catch (err) {
      console.log(err)
    }

  }


  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file])

  useEffect(() => {
    setTimeout(() => {
      setUpdateSuccess(false)
    }, 2000)

  }, [updateSuccess])

  return (
    <>

      {/* Dialog Box to Delete */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Account"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are You Sure, you want to delete your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}
            sx={{
              backgroundColor: '#ed1313',
              '&:hover': {
                backgroundColor: '#f23a3a'
              },
              color: 'white'
            }}
          >Disagree</Button>
          <Button onClick={handleDelete} autoFocus
            sx={{
              backgroundColor: '#1ddb2c',
              '&:hover': {
                backgroundColor: '#23ad2e'
              },
              color: 'white'
            }}
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>


      <div className=' min-h-screen p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl my-7 font-semibold text-slate-400
         text-center '>
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
            className='mt-6 bg-slate-400 h-12 rounded-xl w-full placeholder:text-slate-900'
            type='text'
            placeholder='Username'
            onChange={handleChange}
          />
          <input
            defaultValue={currentUser.email}
            id='email'
            className='mt-6 bg-slate-400  h-12 rounded-xl w-full placeholder:text-slate-900'
            type='email'
            placeholder='Email'
            onChange={handleChange}
          />
          <input
            id='password'
            className='mt-6 bg-slate-400  h-12 rounded-xl w-full placeholder:text-slate-900'
            type='password'
            placeholder='Password'
            onChange={handleChange}
          />

          <button disabled={loading} className='bg-slate-700 text-white h-12 mt-6 rounded-2xl uppercase'>{loading ? <CircularProgress /> : 'Update'}</button>
          <button type='button' onClick={handleListing} className='bg-green-600 text-white h-12 mt-2 rounded-2xl'>Create Listing</button>

        </form>
        <div className='flex justify-between mt-3 text-red-700'>
          <button onClick={handleOpenDialog}>Delete Account</button>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>

        <p className='text-red-700'>{error ? error : ''}</p>
        <p className='text-green-700 text-center'>{updateSuccess && 'Successfully Updated!'}</p>

        <button onClick={handleShowListing} className='text-green-700 w-full mt-5'>Show your listings </button>
        <p className='tetx-red-700 mt-5'>{showListingError ? 'Error showing listings' : ''}</p>

        {
          listingData && listingData.length > 0 &&
          <div className=''>
            <h1 className='text-center my-7 text-2xl text-slate-500 font-semibold'>Your Listing</h1>
            <div className='h-[500px] overflow-auto flex flex-col gap-4 '>
              {listingData.map((listing, index) => (
                <div className='border rounded-lg p-3 flex justify-between items-center gap-4' key={listing._id}>
                  <Link to={`/listing/${listing._id}`}>
                    <img className='w-16 h-16 object-contain' src={listing.imageUrls[0]} alt='Propert Image' />
                  </Link>
                  <Link className='text-slate-700 font-semibold flex-1 hover:underline 
                truncate' to={`/listing/${listing._id}`}>
                    <p >
                      {listing.name}
                    </p>
                  </Link>
                  <div className='flex flex-col items-center'>
                    <button title='Delete' className='' onClick={() => handleDeleteListing(listing._id)}><MdDeleteForever className='w-8 text-red-700 h-8 hover:opacity-80' /></button>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button title='Edit' className=''><AiOutlineEdit className='w-8 h-8 text-green-700 hover:opacity-80' /></button>
                    </Link>
                  </div>
                </div>

              ))}
            </div>
          </div>
        }

      </div>

    </>

  )
}

export default Profile