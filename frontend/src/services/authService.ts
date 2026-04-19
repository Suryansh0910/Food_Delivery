import API_BASE_URL from '../config';

const API_URL = `${API_BASE_URL}/auth`;

export const register = async (userData: any) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const login = async (userData: any) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const getMe = async (token: string) => {
  const response = await fetch(`${API_URL}/me`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  return response.json();
};
export const updateProfile = async (token: string, userData: any) => {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};
