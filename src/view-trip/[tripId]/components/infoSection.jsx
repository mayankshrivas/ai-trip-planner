import React, { useEffect, useState } from 'react';
import { PiShareNetworkFill } from "react-icons/pi";
import { Button } from '/src/components/ui/button';
import { fetchImageFromUnsplash } from '/src/service/GlobalApi'; // Adjust path as needed

function InfoSection({ trip }) {
  const [placePhotoUrl, setPlacePhotoUrl] = useState('/default-image.jpg');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlacePhoto = async () => {
      if (!trip?.userSelection?.location) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const imageUrl = await fetchImageFromUnsplash(trip.userSelection.location);

      if (imageUrl) {
        setPlacePhotoUrl(imageUrl);
      } else {
        setPlacePhotoUrl('/default-image.jpg');
      }
      setLoading(false);
    };

    loadPlacePhoto();
  }, [trip]);

  return (
    <div>
      <div className="relative">
        {loading && <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">Loading...</div>}
        <img
          src={placePhotoUrl}
          className={`h-[340px] w-full object-cover rounded-b-xl ${loading ? 'opacity-50' : 'opacity-100'}`}
          alt='Place'
        />
      </div>
      <div className='flex justify-between items-center'>
        <div className='my-5 flex flex-col gap-2'>
          <h2 className='font-bold text-2xl'>{trip?.userSelection?.location}</h2>

          <div className='flex gap-5'>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
              📆 {trip?.userSelection?.days} Days
            </h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
              💰 {trip?.userSelection?.budget} Budget
            </h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
              🍻 Travelers: {trip?.userSelection?.travelGroup}
            </h2>
          </div>
        </div>
        <Button>
          <PiShareNetworkFill />
        </Button>
      </div>
    </div>
  );
}

export default InfoSection;
