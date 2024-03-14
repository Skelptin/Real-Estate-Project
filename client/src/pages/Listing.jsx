import { app } from '../firebase.js';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

import React, { useState } from 'react'

import { MdDeleteForever } from "react-icons/md";

const Listing = () => {

    const [files, setFiles] = useState([])
    const [uploading, setUploading] = useState(false)
    const [formData, setFormData] = useState({
        imageUrls: []
    })
    const [imageUploadError, setImageUploadError] = useState('')

    console.log(formData)


    const removeImage = (index) => {


        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)
        })
    }

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true)
            setImageUploadError(false)
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));

            }

            Promise.all(promises).then((urls) => {
                setFormData({
                    ...formData,
                    imageUrls: formData.imageUrls.concat(urls),
                });
                setImageUploadError(false);
                setUploading(false)
            }).catch((err) => {
                setImageUploadError('Image upload failed(2 mb max per image)')
                setUploading(false)
            })
        } else {
            setImageUploadError('You can only upload 6 images per listing')
            setUploading(false)
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",

                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`)
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        resolve(downloadUrl);
                    })
                }
            )
        })
    }

    console.log(files)

    return (
        <main className='p-3 max-w-4xl mx-auto items-center'>
            <h1 className='text-center text-3xl m-7 font-semibold'>
                Create a Listing
            </h1>
            <form className='flex flex-col mt-10 gap-5 sm:flex-row'>
                <div className='items-center flex flex-col gap-4 flex-1'>
                    <input placeholder='Name'
                        type='text'
                        className='h-12 rounded-xl w-full'

                    />
                    <input
                        type='text'
                        placeholder='Description'
                        className='mt-6 h-20 rounded-xl w-full'
                    />
                    <input
                        type='text'
                        placeholder='Address'
                        className='mt-6 h-12 rounded-xl w-full'
                    />
                    <div className='flex gap-6 flex-wrap mt-5 '>
                        <div className='' >
                            <input
                                className='w-9 h-5'
                                type='checkbox'
                                id='sell'
                            /> <label>Sell</label>
                        </div>
                        <div>
                            <input
                                className='w-9 h-5'
                                type='checkbox'
                                id='rent' /> <label>Rent</label>
                        </div>
                        <div>

                            <input
                                className='w-9 h-5'
                                type='checkbox'
                                id='parkingspot' /> <label>Parking Spot</label>
                        </div>
                        <div>
                            <input
                                className='w-9 h-5'
                                type='checkbox'
                                id='furnished' /> <label>Furnished</label>
                        </div>
                        <div>
                            <input
                                className='w-9 h-5'
                                type='checkbox'
                                id='offer' /> <label>Offer</label>
                        </div>

                    </div>
                    <div className='flex items-center mt-6 gap-5'>
                        <label>Beds</label>
                        <input
                            required
                            min='1'
                            max='10'
                            type='number'
                            className=' h-12 rounded-md w-1/6'
                            placeholder='Beds' />
                        <label>Baths</label>
                        <input
                            required
                            type='number'
                            className=' h-12 rounded-md w-1/6'
                            placeholder='Baths' />
                    </div>

                    <div className='flex items-center mt-4 gap-4 '>
                        <label className='flex-col flex'>Regular Price
                            <span className='text-sm text-center'>($/Month)</span>
                        </label>
                        <input
                            className=' h-12 rounded-md w-1/4'
                            placeholder='Price' />
                        <label className='flex-col flex'>Discounted Price
                            <span className='text-sm text-center'>($/Month)</span>
                        </label>
                        <input
                            className=' h-12 rounded-md w-1/4'
                            placeholder='Price' />
                    </div>
                </div>
                <div className='flex flex-col flex-1'>

                    <p className='font-semibold'>
                        Images:
                        <span className='font-normal'>The first image will be the cover (max 6)</span>
                    </p>
                    <div className='flex flex-col md:flex-row gap-3'>
                        <input
                            onChange={(e) => setFiles(e.target.files)}
                            className='p-3 border border-gray-300 rounded w-full'
                            type='file'
                            id='images'
                            accept='image/*'
                            multiple
                        />
                        <button
                            disabled={uploading}
                            type='button'
                            onClick={handleImageSubmit}
                            className='p-3 text-green-700 border border-green-700
                        rounded uppercase hover:shadow-lg disabled:opacity-80
                        '>{uploading ? 'Uploading' : 'Upload'}</button>
                    </div>
                    <p className='text-red-700'>{imageUploadError && imageUploadError}</p>
                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                            <div key={url} className='flex justify-between border m-4 rounded-lg'>
                                <img src={url} alt='listing image' className='m-2 w-20 h-20 object-contain rounded-lg' />
                                <button type='button' onClick={() => removeImage(index)} className='bg-red-700 text-white rounded-lg hover:opacity-90'><MdDeleteForever className='w-10 h-8' /></button>
                            </div>
                        ))
                    }

                    <button className='p-3 mt-5 bg-slate-700 text-white  rounded-lg uppercase hover:opacity-90 disabled:opacity-80'>
                        Create Listing
                    </button>
                </div>


            </form>


        </main>
    )
}

export default Listing