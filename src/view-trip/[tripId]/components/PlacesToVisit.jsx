import React, { useEffect, useState } from 'react';
import { fetchImageFromUnsplash } from '/src/service/GlobalApi'; // adjust path if needed

function PlacesToVisit({ trip }) {
  const itineraryObject = trip?.tripData?.itinerary;
  const [placeImages, setPlaceImages] = useState({});

  useEffect(() => {
    const loadPlaceImages = async () => {
      const images = {};
      const itinerary = trip?.tripData?.itinerary;

      if (!itinerary || typeof itinerary !== 'object') return;

      for (const dayData of Object.values(itinerary)) {
        for (const place of dayData.places || []) {
          const image = await fetchImageFromUnsplash(place.placeName);
          images[place.placeName] = image || '/default-image.jpg';
        }
      }

      setPlaceImages(images);
    };

    loadPlaceImages();
  }, [trip]);

  if (!itineraryObject || typeof itineraryObject !== 'object') {
    return (
      <div className="p-8 bg-white shadow-2xl rounded-xl text-center">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Places to Visit</h2>
        <p className="text-gray-500">Itinerary data is not available or is invalid.</p>
      </div>
    );
  }

  // Debug log for checking how many days are in the itinerary
  console.log("Days in itinerary:", Object.keys(itineraryObject));

  // Sort and clean up day keys to ensure correct order
  const itineraryArray = Object.entries(itineraryObject).sort(
    ([dayA], [dayB]) => {
      const numA = parseInt(dayA.trim().replace(/\D/g, ''), 10);
      const numB = parseInt(dayB.trim().replace(/\D/g, ''), 10);
      return numA - numB;
    }
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 bg-gradient-to-br from-white to-gray-100">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10 tracking-tight">
        Place To visit
      </h2>

      <div className="space-y-12">
        {itineraryArray.map(([dayKey, dayData]) => {
          const places = dayData.places || [];

          return (
            <div key={dayKey} className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 capitalize">{dayKey.trim()}</h3>
              <p className="text-gray-500 mb-6">
                <span className="font-medium text-gray-700">Best Time to Visit:</span> {dayData.bestTimeToVisit}
              </p>

              {places.length === 1 ? (
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{places[0].placeName}</h4>
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img
                      src={placeImages[places[0].placeName] || '/default-image.jpg'}
                      alt={places[0].placeName}
                      className="w-full h-56 object-cover rounded-xl transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{places[0].placeDetails}</p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Travel Time:</strong> {places[0].travelTime}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Ticket:</strong> {places[0].ticketPricing}
                  </p>

                  <a
                    href={`https://www.google.com/maps/search/?q=${encodeURIComponent(places[0].placeName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-md hover:from-blue-600 hover:to-purple-600 transition"
                  >
                    Locate on Google Maps
                  </a>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  {places.map((place, i) => (
                    <div key={i} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <h4 className="text-xl font-bold text-gray-800 mb-2">{place.placeName}</h4>
                      <div className="relative overflow-hidden rounded-xl mb-4">
                        <img
                          src={placeImages[place.placeName] || '/default-image.jpg'}
                          alt={place.placeName}
                          className="w-full h-48 object-cover rounded-xl transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{place.placeDetails}</p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Travel Time:</strong> {place.travelTime}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        <strong>Ticket:</strong> {place.ticketPricing}
                      </p>

                      <a
                        href={`https://www.google.com/maps/search/?q=${encodeURIComponent(place.placeName)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-md hover:from-blue-600 hover:to-purple-600 transition"
                      >
                        Locate on Google Maps
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PlacesToVisit;
