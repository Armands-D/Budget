import React, { useContext, useState, createContext } from 'react';

function Toast(){
  const toast_context = useContext(ToastContext)
  let toast = (
    <div className='toast'
      hidden={toast_context?.hidden}
    >
      {toast_context?.toastMessage}
    </div>
  )
  return toast
}

class ToastContextHandler {

  readonly toastMessage : string
  private setToastMessage: React.Dispatch<React.SetStateAction<string>>

  readonly hidden: boolean 
  private setHidden: React.Dispatch<React.SetStateAction<boolean>>

  private readonly timer: NodeJS.Timeout | undefined
  private setTimer: React.Dispatch<React.SetStateAction<NodeJS.Timeout | undefined>>

  constructor(){
    [this.toastMessage, this.setToastMessage] = useState<string>("Default Toast");
    [this.hidden, this.setHidden] = useState<boolean>(true);
    [this.timer, this.setTimer] = useState<NodeJS.Timeout>();
  }

  popUp(msg: string){
    this.setToastMessage(msg)
    this.setHidden(false)
    if(this.timer) clearInterval(this.timer)
    this.setTimer(setTimeout(()=>{
      this.setHidden(true)
    }, 5000))
  }
}

export const ToastContext = createContext<null | ToastContextHandler>(null)
export {Toast, ToastContextHandler}