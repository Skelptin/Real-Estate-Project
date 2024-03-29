import { app } from '../firebase.js';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useSelector } from 'react-redux';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { MdDeleteForever } from "react-icons/md";

const CreateListing = () => {


    const navigate = useNavigate();


    const [files, setFiles] = useState([])
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false
    })
    const [imageUploadError, setImageUploadError] = useState('')

    console.log(formData)

    const { currentUser } = useSelector((state) => state.user)

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

    const handleChange = (e) => {
        if (e.target.id === 'sale' ||
            e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id,
            });
        }

        if (
            e.target.id === 'parking' ||
            e.target.id === 'furnished' ||
            e.target.id === 'offer'
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
        }

        if (e.target.type === 'number' ||
            e.target.type === 'text' ||
            e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (formData.imageUrls.length < 1) return setError("You must upload atleast one image.")
            if (+formData.regularPrice < +formData.discountPrice) return setError("Discount price must be lower than regular price")
            setLoading(true);
            setError(false);

            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                })
            });

            const data = await res.json();
            setLoading(false);
            if (data.success === false) {
                setError(data.message);
            }
            navigate(`/listing/${data._id}`)

        } catch (err) {
            setError(error.message);
            setLoading(false)
        }
    }

    return (
        <main className='p-3 max-w-4xl mx-auto items-center text-slate-400'>
            <h1 className='text-center text-3xl m-7 font-semibold'>
                Create a Listing
            </h1>
            <form onSubmit={handleSubmit} className='flex flex-col mt-10 gap-5 sm:flex-row'>
                <div className='items-center flex flex-col gap-4 flex-1'>
                    <input placeholder='Name'
                        type='text'
                        className='h-12 text-slate-900 bg-slate-400 placeholder:text-slate-900 rounded-xl w-full'
                        maxLength='62'
                        minLength='10'
                        id='name'
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <input
                        type='textarea'
                        placeholder='Description'
                        className='mt-6 text-slate-900 bg-slate-400 placeholder:text-slate-900 h-20 rounded-xl w-full'
                        id='description'
                        required
                        onChange={handleChange}
                        value={formData.description}
                    />
                    <input
                        type='text'
                        placeholder='Address'
                        className='mt-6 text-slate-900 bg-slate-400 placeholder:text-slate-900 h-12 rounded-xl w-full'
                        id='address'
                        required
                        onChange={handleChange}
                        value={formData.address}
                    />
                    <div className='flex gap-6 flex-wrap mt-5 '>
                        <div className='' >
                            <input
                                className='w-9 h-5'
                                type='checkbox'
                                id='sale'
                                onChange={handleChange}
                                checked={formData.type === 'sale'}
                            /> <label>Sell</label>
                        </div>
                        <div>
                            <input
                                className='w-9 h-5'
                                type='checkbox'
                                id='rent'
                                onChange={handleChange}
                                checked={formData.type === 'rent'}
                            /> <label>Rent</label>
                        </div>
                        <div>
                            <input
                                className='w-9 h-5'
                                type='checkbox'
                                id='parking'
                                onChange={handleChange}
                                checked={formData.parking}
                            /> <label>Parking Spot</label>
                        </div>
                        <div>
                            <input
                                className='w-9 h-5'
                                type='checkbox'
                                id='furnished'
                                onChange={handleChange}
                                checked={formData.furnished}
                            /> <label>Furnished</label>
                        </div>
                        <div>
                            <input
                                className='w-9 h-5 '
                                type='checkbox'
                                id='offer'
                                onChange={handleChange}
                                checked={formData.offer}
                            /> <label>Offer</label>
                        </div>

                    </div>
                    <div className='flex items-center mt-6 gap-5'>
                        <label>Beds</label>
                        <input
                            required
                            min='1'
                            max='10'
                            id='bedrooms'
                            type='number'
                            className=' bg-slate-400 text-slate-900 placeholder:text-slate-900 h-12 rounded-md w-1/6'
                            placeholder='Beds'
                            onChange={handleChange}
                            value={formData.bedrooms}
                        />
                        <label>Baths</label>
                        <input
                            required
                            type='number'
                            id='bathrooms'
                            className=' bg-slate-400 text-slate-900 placeholder:text-slate-900 h-12 rounded-1md w-1/6'
                            placeholder='Baths'
                            onChange={handleChange}
                            value={formData.bathrooms}
                        />
                    </div>

                    <div className='flex items-center mt-4 gap-4 '>
                        <label className='flex-col flex '>Regular Price
                            <span className='text-sm text-center'>($/Month)</span>
                        </label>
                        <input
                            type='number'
                            className=' bg-slate-400 text-slate-900 placeholder:text-slate-900 h-12 rounded-md w-1/2'
                            id='regularPrice'
                            placeholder='Price'
                            value={formData.regularPrice}
                            onChange={handleChange}
                            min='50'
                            max='100000000'
                        />

                        {
                            formData.offer && (
                                <div className='flex gap-5 '>
                                    <label className='flex-col flex'>Discounted Price
                                        <span className='text-sm text-center'>($/Month)</span>
                                    </label>
                                    <input
                                        type='number'
                                        className=' h-12 text-slate-900 placeholder:text-slate-900 rounded-md w-1/2'
                                        placeholder='Price'
                                        id='discountPrice'
                                        min='0'
                                        max='10000000'
                                        value={formData.discountPrice}
                                        onChange={handleChange}
                                    />
                                </div>
                            )
                        }

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

                    <button disabled={loading || uploading} className='p-3 mt-5 bg-slate-700 text-white  rounded-lg uppercase hover:opacity-90 disabled:opacity-80'>
                        {loading ? 'Loading' : 'Create Listing'}
                    </button>
                    {error && <p className='text-red-700 text-sm'>{error}</p>}
                </div>

            </form>
        </main>
    )
}

export default CreateListing