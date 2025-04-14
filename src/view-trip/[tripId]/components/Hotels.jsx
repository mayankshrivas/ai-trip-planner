import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchImageFromUnsplash } from '/src/service/GlobalApi'; // adjust path if needed

function Hotels({ trip }) {
  const [hotelImages, setHotelImages] = useState({});

  useEffect(() => {
    const loadHotelImages = async () => {
      const images = {};
      const hotels = trip?.tripData?.hotels || [];

      for (const hotel of hotels) {
        const image = await fetchImageFromUnsplash(hotel?.hotelName);
        images[hotel?.hotelName] = image || '/default-image.jpg';
      }

      setHotelImages(images);
    };

    if (trip?.tripData?.hotels?.length > 0) {
      loadHotelImages();
    }
  }, [trip]);

  return (
    <div>
      <h2 className='font-bold text-xl mt-5'>Hotel recommendation</h2>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {trip?.tripData?.hotels?.map((hotel, index) => (
          <Link
            to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.hotelName + ', ' + hotel.address)}`}
            target='_blank'
            key={index}
          >
            <div className='hover:scale-105 transition-all cursor-pointer'>
              <img
                src={hotelImages[hotel.hotelName] || '/default-image.jpg'}
                alt={hotel.hotelName}
                className='rounded-lg h-40 w-full object-cover'
              />
              <div className='my-2 flex flex-col gap-2'>
                <h2 className='font-medium'>{hotel?.hotelName}</h2>
                <h2 className='text-xs text-gray-500'>Address: {hotel?.address}</h2>
                <h2 className='text-sm'>Amount: {hotel?.price}</h2>
                <h2 className='text-sm'>⭐ {hotel?.rating}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Hotels;
