import React, { useContext, useState, createContext } from 'react';

class ToastState {
  toastMessage : string
  setToastMessage: React.Dispatch<React.SetStateAction<string>>

  hidden: boolean 
  setHidden: React.Dispatch<React.SetStateAction<boolean>>

  timer: NodeJS.Timeout | undefined
  setTimer: React.Dispatch<React.SetStateAction<NodeJS.Timeout | undefined>>

  constructor(){
    [this.toastMessage, this.setToastMessage] = useState<string>("Default Toast");
    [this.hidden, this.setHidden] = useState<boolean>(true);
    [this.timer, this.setTimer] = useState<NodeJS.Timeout>();
  }

  public isHidden(){return this.hidden}
  public getToastMessage(){return this.toastMessage}
}

// const TOAST_STATE = new ToastState()

function Toast(){
  const toast_conext = useContext(ToastContext)
  let toast = (
    <div
      // hidden={TOAST_STATE.isHidden()}
      hidden={toast_conext?.hidden}
    >
      {/* {TOAST_STATE.getToastMessage()} */}
      {toast_conext?.toastMessage}
    </div>
  )
  return toast
}

class ToastContextHandler {
  // private state = TOAST_STATE
  toastMessage : string
  setToastMessage: React.Dispatch<React.SetStateAction<string>>

  hidden: boolean 
  setHidden: React.Dispatch<React.SetStateAction<boolean>>

  timer: NodeJS.Timeout | undefined
  setTimer: React.Dispatch<React.SetStateAction<NodeJS.Timeout | undefined>>

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

function TButton(){
    const context = useContext(ToastContext)
       return <button
          onClick={(e) => context?.popUp('wow')}
        >
BUTTON
        </button>
}

export const ToastContext = createContext<null | ToastContextHandler>(null)

export {Toast, TButton, ToastContextHandler}
