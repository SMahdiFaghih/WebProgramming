import { store } from 'react-notifications-component';

export const notif = ( type:any,title:string, message:string)=>{
    store.addNotification({
    title: "Error",
    message: message,
    type: type,
    container: "bottom-right",
    dismiss: {
      duration: 3000,
      onScreen: true
    }
  });
}