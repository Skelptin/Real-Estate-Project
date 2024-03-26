import React from 'react'
import { MdLocationOn } from 'react-icons/md'
import { Link } from 'react-router-dom'

const ListingItem = ({ listing }) => {


    return (
        <div className='bg-white w-full sm:w-[400px] m-2 shadow-md hover:shadow-xl transition-shadow overflow-hidden rounded-lg'>
            <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt='listing cover'
                    className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300    '
                />
            </Link>

            <div className='p-3 flex flex-col gap-2 w-full mt-3'>
                <p className='truncate text-lg font-semibold text-slate-700'>{listing.name}</p>
                <div className='flex items-center gap-1'>
                    <MdLocationOn className='h-4 w-4 text-green-700' />
                    <p className='text-sm text-gray-600 truncate w-full'>{listing.address}</p>
                </div>
                <p className='text-sm text-gray-600 line-clamp-3'>{listing.description}</p>
                <p className='text-slate-500 mt-2 font-semibold flex items-center'>
                    ${listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                    {
                        listing.type === 'rent' && '/month'
                    }
                </p>
                <div className='flex gap-3 font-semibold'>
                    <p className='text-slate-700'>{listing.bedrooms} Beds</p>
                    <p className='text-slate-700'>{listing.bathrooms} Baths</p>
                </div>
            </div>
        </div>
    )
}

export default ListingItem