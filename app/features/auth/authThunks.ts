'use client';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { setUser, clearUser, setLoading, setError } from './authSlice';

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      // Add your login API call here
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) throw new Error('Login failed');
      
      const user = await response.json();
      dispatch(setUser(user));
      dispatch(setError(null));
      return user;
    } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      // Add your logout API call here
      await fetch('/api/auth/logout', { method: 'POST' });
      dispatch(clearUser());
      dispatch(setError(null));
    } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Async thunk to get current user
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      // Add your get current user API call here
      const response = await fetch('/api/auth/me');
      
      if (response.ok) {
        const user = await response.json();
        dispatch(setUser(user));
        return user;
      } else {
        dispatch(clearUser());
        return null;
      }
    } catch (error) {
      dispatch(clearUser());
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }
);