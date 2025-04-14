// GlobalApi.jsx
import axios from 'axios';

const UNSPLASH_URL = 'https://api.unsplash.com/search/photos';

const config = {
  headers: {
    'Authorization': `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
  },
};

export const fetchImageFromUnsplash = async (query) => {
  try {
    const response = await axios.get(UNSPLASH_URL, {
      params: { query, per_page: 1 },
      headers: config.headers,
    });

    const imageUrl = response.data.results[0]?.urls?.regular;
    return imageUrl || null;
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    return null;
  }
};
// In /src/service/GlobalApi.js

export const fetchHotelsByPlace = async (place) => {
    try {
      const response = await fetch(`/api/hotels?place=${place}`);
      const data = await response.json();
      return data.hotels || [];
    } catch (error) {
      console.error("Error fetching hotels:", error);
      return [];
    }
  };
  

export default fetchImageFromUnsplash;
