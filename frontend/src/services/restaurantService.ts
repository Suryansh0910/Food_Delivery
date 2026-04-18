const API_URL = 'http://localhost:5001/api/restaurants';

export const getRestaurantsForCustomer = async (city: string, area: string) => {
  const token = localStorage.getItem('token');
  if (!token) return [];

  const response = await fetch(`${API_URL}?city=${city}&area=${area}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch restaurants');
  }

  return response.json();
};

export const getMyRestaurantProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const response = await fetch(`${API_URL}/my-restaurant`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch restaurant profile');
  }

  return response.json();
};

export const toggleRestaurantStatus = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const response = await fetch(`${API_URL}/my-restaurant/toggle`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to toggle status');
  }

  return response.json();
};
