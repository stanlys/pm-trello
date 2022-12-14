import { Build } from '@mui/icons-material';
import { Avatar, Box, Button, Container, TextField, Typography } from '@mui/material';
import { deleteProfileForm, editProfileForm } from 'components/form/constants/formOptions';
import FormModal from 'components/form/FormModal';
import Loader from 'components/universal/Loader/Loader';
import { useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { userValidationSchema } from 'schemas/userSchemas';
import { deleteUser, updateUserInfo } from 'store/user/thunks';

function Profile() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { id, name, login, isLoading } = useAppSelector((state) => state.user);
  const [isModalActive, setIsModalActive] = useState(false);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    name: name ?? '',
    login: login ?? '',
    password: '',
  };

  const { values, touched, errors, handleSubmit, handleChange, resetForm } = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: userValidationSchema,
    onSubmit: () => {
      setIsEditProfile(true);
      setIsModalActive(true);
    },
  });

  const nameError = errors.name;
  const loginError = errors.login;
  const passwordError = errors.password;

  const onConfirm = () => {
    setIsEditProfile(false);
    setIsModalActive(true);
  };

  const handleDeleteUser = async () => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      enqueueSnackbar(t('successful.userDeleteMessage'), { variant: 'success' });
      setIsModalActive(false);
    } catch (error) {
      enqueueSnackbar(t(`errors.${error as string}`), { variant: 'error' });
    }
  };

  const handleEditUser = async () => {
    try {
      await dispatch(updateUserInfo({ ...values, userId: id })).unwrap();
      enqueueSnackbar(t('successful.userEditMessage'), { variant: 'success' });
      setIsEditProfile(false);
      setIsModalActive(false);
      // navigate('/' + VIEW_PATH.BOARDS);
    } catch (error) {
      enqueueSnackbar(t(`errors.${error as string}`), { variant: 'error' });
      resetForm();
    }
  };

  const confirmData = isEditProfile
    ? { ...editProfileForm, action: handleEditUser }
    : { ...deleteProfileForm, action: handleDeleteUser };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          my: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '4px',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <Build />
        </Avatar>
        <Typography component="h1" variant="h5">
          {t('profile.profileHeader')}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            autoFocus
            fullWidth
            id="name"
            label={t('auth.name')}
            margin="normal"
            value={values.name}
            onChange={handleChange}
            error={touched.name && !!nameError}
            helperText={touched.name && !!nameError && t(`errors.${nameError}`)}
            disabled={isLoading}
          />
          <TextField
            fullWidth
            id="login"
            label={t('auth.login')}
            margin="normal"
            value={values.login}
            onChange={handleChange}
            error={touched.login && !!loginError}
            helperText={touched.login && !!loginError && t(`errors.${loginError}`)}
            disabled={isLoading}
          />
          <TextField
            fullWidth
            id="password"
            label={t('auth.password')}
            type="password"
            margin="normal"
            value={values.password}
            onChange={handleChange}
            error={touched.password && !!passwordError}
            helperText={touched.password && !!passwordError && t(`errors.${passwordError}`)}
            disabled={isLoading}
          />
          <Box sx={{ position: 'relative' }} margin={'16px 0 8px'}>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              disabled={isLoading}
            >
              {t('profile.saveButton')}
            </Button>
          </Box>
        </form>
        <Box sx={{ position: 'relative', p: 2 }}>
          <Button
            color="error"
            variant="contained"
            fullWidth
            type="submit"
            disabled={isLoading}
            onClick={onConfirm}
          >
            {t('profile.deleteUserButton')}
          </Button>
        </Box>
      </Box>
      <FormModal
        isModalActive={isModalActive}
        closeModal={() => setIsModalActive(false)}
        {...confirmData}
      />
      {isLoading && <Loader />}
    </Container>
  );
}
export default Profile;
