import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { axiosPrivate } from 'api/axios';
import { AxiosError } from 'axios';
import { ISignInData, ISingUpData, IupdateUserData } from 'interfaces/users';
import { axiosErrorHandler, parseJwt } from 'utils/helpers';
import { API_ENDPOINTS } from 'utils/variables';
import { logout, setUserId } from './slice';

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (signInData: ISignInData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_ENDPOINTS.SIGN_IN, signInData);
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(axiosErrorHandler(err));
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (signUpData: ISingUpData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_ENDPOINTS.SIGN_UP, signUpData);
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(axiosErrorHandler(err));
    }
  }
);

export const getUserInfo = createAsyncThunk(
  'user/getUsersInfo',
  async (token: string, { rejectWithValue, dispatch }) => {
    const { id } = parseJwt(token);
    try {
      const response = await axiosPrivate.get(API_ENDPOINTS.USER(id));
      dispatch(setUserId(id));
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(axiosErrorHandler(err));
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  'user/updateUsersInfo',
  async (updateUserData: IupdateUserData, { rejectWithValue }) => {
    const { userId, ...otherData } = updateUserData;
    try {
      const response = await axiosPrivate.put(API_ENDPOINTS.USER(userId), otherData);
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(axiosErrorHandler(err));
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosPrivate.delete(API_ENDPOINTS.USER(userId));
      dispatch(logout());
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(axiosErrorHandler(err));
    }
  }
);
