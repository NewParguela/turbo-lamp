import { createFormHook } from '@tanstack/react-form'

import {
  PhoneField,
  Select,
  SubscribeButton,
  TextArea,
  TextField,
} from '../components/formComponents'
import { fieldContext, formContext } from './formContext'

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    Select,
    TextArea,
    PhoneField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
})
