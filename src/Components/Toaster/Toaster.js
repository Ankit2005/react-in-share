import { store as stores } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

export const toasterMsg = (message, getVariant, duration, icon) => {
  stores.addNotification({
    message: message,
    type: getVariant,
    insert: "center",
    container: "top-center",
    animationIn: ["animated", "bounceIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: {
      duration: 3000
    },
  });
};
