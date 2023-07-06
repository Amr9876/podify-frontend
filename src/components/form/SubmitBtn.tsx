import {useFormikContext} from 'formik';
import React, {FC} from 'react';
import AppButton from '@ui/AppButton';

interface Props {
  title: string;
  busy?: boolean;
}

const SubmitBtn: FC<Props> = ({title, busy}) => {
  const {handleSubmit} = useFormikContext();

  return <AppButton title={title} onPress={handleSubmit} isBusy={busy} />;
};

export default SubmitBtn;
