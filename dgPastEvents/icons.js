export const iconMap = (eventType) =>
  ({
    AbnormallyCold: `M24,10.8H19l3.89-3.89L21.2,5.2l-5.6,5.6H13.2V8.4l5.6-5.6L17.09,1.11,13.2,5V0H10.8V5L6.9,1.11,5.2,2.8l5.6,5.6v2.4H8.4L2.8,5.2,1.11,6.91,5,10.8H0v2.4H5l-3.9,3.89L2.8,18.8l5.6-5.6h2.4v2.4L5.2,21.2l1.7,1.69L10.8,19v5h2.4V19l3.89,3.9L18.8,21.2l-5.6-5.6V13.2h2.4l5.6,5.6,1.68-1.71L19,13.2h5V10.8Z`,
    AbnormallyHot: `M23.66,11.37,19.77,8.78l.91-4.59a.75.75,0,0,0-.88-.89l-4.59.92L12.62.33a.75.75,0,0,0-1-.2.8.8,0,0,0-.21.2L8.78,4.22,4.19,3.3a.76.76,0,0,0-.89.89l.92,4.59L.33,11.37a.76.76,0,0,0-.2,1.05.64.64,0,0,0,.2.2l3.9,2.59-.93,4.6a.75.75,0,0,0,.59.88.76.76,0,0,0,.3,0l4.59-.91,2.59,3.89h0a.76.76,0,0,0,1.05.2.64.64,0,0,0,.2-.2l2.6-3.89,4.59.91h0a.75.75,0,0,0,.88-.58.81.81,0,0,0,0-.31l-.91-4.59,3.89-2.59h0a.75.75,0,0,0,.2-1,.8.8,0,0,0-.2-.21ZM12,19.5a7.51,7.51,0,1,1,5.3-2.2A7.5,7.5,0,0,1,12,19.5ZM18,12a6,6,0,1,1-6-6h0a6,6,0,0,1,6,6`,
    GreenEnergy: `M1.07,22.19c-.42,1.24.28,2.35,1.8,1.52l2.91-4.44C13.68,23,28.24,16.36,21.17,0c-5,7.63-20.1.14-17.74,15.81,4.29-4.58,11.22-4.58,15.8-9.57-4,7.9-14.28,6.65-18,15.94H1.07Z`,
    RoomRefresh: `M15,18.56a3.6,3.6,0,1,1-7.2.08v-.08h2.4a1.2,1.2,0,1,0,1.2-1.2H0V15H11.4A3.6,3.6,0,0,1,15,18.56ZM20.4,6A4.2,4.2,0,0,0,12,6h2.4a1.8,1.8,0,1,1,1.8,1.8H0v2.39H16.2A4.2,4.2,0,0,0,20.4,6Zm-.6,5.4H0v2.4H19.8a1.8,1.8,0,1,1,0,3.6v2.4a4.2,4.2,0,1,0,0-8.4Z`,
    UtilityDR: `M16.32,10a.54.54,0,0,0-.48-.28h-2l1.35-4.61a.51.51,0,0,0-.09-.49.58.58,0,0,0-.45-.22H9.43a.56.56,0,0,0-.56.5l-.73,7.82a.51.51,0,0,0,.15.43.56.56,0,0,0,.41.18h1.74l-1,6.37a.58.58,0,0,0,.35.62.43.43,0,0,0,.19,0,.59.59,0,0,0,.49-.26l5.85-9.5a.64.64,0,0,0,0-.6ZM12,24a12,12,0,1,1,8.49-3.52A12,12,0,0,1,12,24ZM12,1.6A10.4,10.4,0,1,0,22.4,12h0A10.42,10.42,0,0,0,12,1.6Z`,
  }[eventType]);

export const colorMap = (eventType) =>
  ({
    AbnormallyCold: "#0000FF",
    AbnormallyHot: "#FF6005",
    GreenEnergy: "#03832E",
    RoomRefresh: "#100B8B",
    UtilityDR: "#510383",
  }[eventType]);
