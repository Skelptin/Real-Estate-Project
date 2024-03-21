import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import { Autoplay, Navigation } from 'swiper/modules';

const Listing = () => {

    SwiperCore.use([Navigation, Autoplay])
    const params = useParams();

    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/listing/get/${params.listingId}`);

                const data = await res.json();
                if (data.success === false) {
                    setError(true)
                    setLoading(false)
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (err) {
                setError(true);
                setLoading(false);
            }


        }
        fetchListing();
    }, [params.listingId])

    return (
        <main>
            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
            {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}

            {
                listing && !loading && !error && (
                    <>
                        <Swiper navigation autoplay={{ delay: 3000 }}>
                            {
                                listing.imageUrls.map((url) => (
                                    <SwiperSlide key={url}>
                                        <div className='h-[550px]'
                                            style={{
                                                background: `url(${url}) center no-repeat`,
                                                backgroundSize: 'cover'
                                            }}>

                                        </div>
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </>
                )
            }
        </main>
    )
}

export default Listing