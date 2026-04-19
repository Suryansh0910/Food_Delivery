import API_BASE_URL from '../config';

const API_URL = `${API_BASE_URL}/restaurants`;

export const getRestaurantsForCustomer = async (city: string, area: string, search?: string) => {
  const token = localStorage.getItem('token');
  if (!token) return [];

  let url = `${API_URL}?city=${city}&area=${area}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch restaurants');
  }

  return response.json();
};

export const getRestaurantById = async (id: string) => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Failed to fetch restaurant');
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

export const addMenuItem = async (menuItem: any) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/my-restaurant/menu`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(menuItem)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add menu item');
  }

  return response.json();
};
