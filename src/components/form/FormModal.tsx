import React from 'react';
import { Box, Button } from '@mui/material';
import { IFormProps } from 'interfaces/modal';
import { useTranslation } from 'react-i18next';
import ModalBasic from 'components/modal/ModalBasic';
import { useFormik } from 'formik';
import { VALUE_VALID } from 'utils/variables';
import ConfirmButtons from './ConfirmButtons';
import { defaultValues } from './constants/formOptions';
import CustomTextField from './CustomTextField';
import SelectField from './SelectField';
const { MIN_LENGTH, NAME_MAX_LENGTH, DESC_MAX_LENGTH } = VALUE_VALID;

export default function FormModal({
  modalTitle,
  initialValues = defaultValues,
  schema,
  fields,
  btnTitle,
  action,
  isUsers,
  isModalActive,
  closeModal,
}: IFormProps) {
  const { values, errors, touched, handleSubmit, handleChange, dirty } = useFormik({
    initialValues,
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      action(values);
      resetForm({ values: initialValues });
    },
  });
  const { t } = useTranslation();
  type fieldName = keyof typeof initialValues;

  return (
    <ModalBasic modalTitle={t(modalTitle)} isModalActive={isModalActive} closeModal={closeModal}>
      {fields ? (
        <Box component="form" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <CustomTextField
              handleChange={handleChange}
              value={values[field.name as fieldName]}
              error={touched[field.name as fieldName] && !!errors[field.name as fieldName]}
              helperText={
                touched[field.name as fieldName] &&
                !!errors[field.name as fieldName] &&
                t(`errors.${errors[field.name as fieldName]}`, {
                  MIN_LENGTH,
                  NAME_MAX_LENGTH,
                  DESC_MAX_LENGTH,
                })
              }
              {...field}
              key={field.name}
            />
          ))}
          {isUsers && values.users && (
            <SelectField
              handleChange={handleChange}
              helperText={touched.users && !!errors.users && t(`errors.${errors.users}`)}
              value={values.users}
              error={touched.users && !!errors.users}
            />
          )}
          <Button
            type="submit"
            disabled={!dirty}
            color="primary"
            variant="contained"
            fullWidth
            sx={{ textTransform: 'none', marginTop: '20px' }}
          >
            {btnTitle && t(btnTitle)}
          </Button>
        </Box>
      ) : (
        <ConfirmButtons action={action} closeModal={closeModal} />
      )}
    </ModalBasic>
  );
}
