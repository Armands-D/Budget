import React, { useContext } from 'react';
import { ToastContext } from '../App';

function Toast(){
  const toast_context = useContext(ToastContext)
  return <div>{toast_context?.message}</div>
}

export {Toast}