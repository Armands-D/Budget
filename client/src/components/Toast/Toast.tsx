import React, { useContext, useState } from 'react';

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

const TOAST_STATE = new ToastState()

function Toast(){
  let toast = (
    <div
      hidden={TOAST_STATE.isHidden()}
    >
      {TOAST_STATE.getToastMessage()}
    </div>
  )
  return toast
}

class ToastContextHandler {
  private state = TOAST_STATE

  popUp(msg: string){
    this.state.setToastMessage(msg)
    this.state.setHidden(false)
    if(this.state.timer) clearInterval(this.state.timer)
    this.state.setTimer(setTimeout(()=>{
      this.state.setHidden(true)
    }, 5000))
  }
}

export {Toast, ToastContextHandler}
