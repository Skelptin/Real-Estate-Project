import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


const Search = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false)
    const [listing, setListing] = useState([])
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc'
    })


    const handleChange = (e) => {
        if (e.target.id === 'all' ||
            e.target.id === 'rent' ||
            e.target.id === 'sale') {
            setSidebarData({ ...sidebarData, type: e.target.id })
        }

        if (e.target.id === 'searchTerm') {
            setSidebarData({ ...sidebarData, searchTerm: e.target.value })
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSidebarData({
                ...sidebarData,
                [e.target.id]: e.target.checked || e.target.checked === 'true'
                    ? true : false
            })
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';

            setSidebarData({ ...sidebarData, sort, order })
        }

    }
    console.log(listing)


    const handleSubmit = (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('type', sidebarData.type);
        urlParams.set('parking', sidebarData.parking);
        urlParams.set('furnished', sidebarData.furnished);
        urlParams.set('offer', sidebarData.offer);
        urlParams.set('order', sidebarData.order);
        urlParams.set('sort', sidebarData.sort);
        const searchQuery = urlParams.toString();

        navigate(`/search?${searchQuery}`);
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ) {
            setSidebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl
            });

        }

        const fetchListings = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`)
            const data = await res.json();
            console.log('res', data)
            setListing(data);
            setLoading(false);
        }

        fetchListings();
    }, [location.search])



    return (
        <div className='flex flex-col md:flex-row'>

            <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                    <div className='flex items-center gap-2 '>
                        <label className='whitespace-nowrap font-semibold'>Search Term</label>
                        <input type='text' id='searchTerm' placeholder='Search...'
                            className='border rounded-lg p-3 w-full'
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        ></input>
                    </div>

                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>Type: </label>
                        <div className='flex gap-2'>
                            <input className='w-5' type='checkbox' id='all'
                                onChange={handleChange}
                                checked={sidebarData.type === 'all'}
                            />
                            <span>Rent & Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input className='w-5' type='checkbox' id='rent'
                                onChange={handleChange}
                                checked={sidebarData.type === 'rent'}
                            />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input className='w-5' type='checkbox' id='sale'
                                onChange={handleChange}
                                checked={sidebarData.type === 'sale'}
                            />
                            <span>Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input className='w-5' type='checkbox' id='offer'
                                onChange={handleChange}
                                checked={sidebarData.offer}
                            />
                            <span>Offer</span>
                        </div>

                    </div>

                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>Amenities: </label>
                        <div className='flex gap-2'>
                            <input className='w-5' type='checkbox' id='parking'
                                onChange={handleChange}
                                checked={sidebarData.parking}
                            />
                            <span>Parking</span>
                        </div>
                        <div className='flex gap-2'>
                            <input className='w-5' type='checkbox' id='furnished'
                                onChange={handleChange}
                                checked={sidebarData.furnished}
                            />
                            <span>Furnished</span>
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <label>Sort: </label>
                        <select
                            onChange={handleChange}
                            defaultValue={'created_at_desc'}
                            id="sort_order" className='border rounded-lg p-3'>
                            <option value='regularPrice_desc'>Price High to Low</option>
                            <option value='regularPrice_asc'>Price Low to High</option>
                            <option value='createdAt_desc'>Price Latest</option>
                            <option value='createdAt_asc'>Price Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
                        Search
                    </button>
                </form>
            </div>
            <div className=''>
                <h1 className='text-3xl mt-5 font-semibold border-b p-3 text-slate-700'>Listing Results</h1>
            </div>

        </div>
    )
}

export default Search