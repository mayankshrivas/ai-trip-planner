import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { toast } from 'sonner';
import InfoSection from './components/infoSection';
import Hotels from './components/Hotels';
import PlacesToVisit from './components/PlacesToVisit';
import Footer from './components/Footer';
function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    if (tripId) {
      GetTripData();
    }
  }, [tripId]);

  const GetTripData = async () => {
    try {
      const docRef = doc(db, 'AiTrips', tripId); // ✅ fixed typo here
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document:", docSnap.data());
        setTrip(docSnap.data());
      } else {
        console.log('No such Document');
        toast.error('No trip found!');
      }
    } catch (error) {
      console.error('Error fetching trip data:', error);
      toast.error('Error fetching trip data');
    }
  };

  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
      {/* Trip Information */}
      <InfoSection trip={trip}/>

      {/* Recommendation */}
     <Hotels trip={trip}/>
      {/* Daily Plan */}
      <PlacesToVisit trip={trip}/>
      {/* Footer */}
      <Footer trip={trip}/>
    </div>
  );
}

export default Viewtrip;
