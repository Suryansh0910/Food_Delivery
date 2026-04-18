const API_URL = 'http://localhost:5001/api/restaurants';

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
