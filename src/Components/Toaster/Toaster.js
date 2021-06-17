import { store as stores } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

export const toasterMsg = (message, getVariant, duration, icon) => {
  stores.addNotification({
    title: "Bombyx PLM",
    message: message,
    type: getVariant,
    insert: "bottom",
    container: "bottom-center",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: {
      duration: 3000
    },
  });
};
