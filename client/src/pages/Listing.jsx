import React from 'react'

const Listing = () => {
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
                            className='p-3 border border-gray-300 rounded w-full'
                            type='file'
                            id='images'
                            accept='image/*'
                            multiple
                        />
                        <button className='p-3 text-green-700 border border-green-700
                        rounded uppercase hover:shadow-lg disabled:opacity-80
                        '>Upload</button>
                    </div>
                    <button className='p-3 mt-5 bg-slate-700 text-white  rounded-lg uppercase hover:opacity-90 disabled:opacity-80'>
                        Create Listing
                    </button>
                </div>

            </form>


        </main>
    )
}

export default Listing