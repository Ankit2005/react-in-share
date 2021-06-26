import { toasterMsg } from "../Components/Toaster/Toaster"
export const sendEmail = (formData) => {
    const baseURL = "http://localhost:30001";
    //const baseURL = "https://inshare-file-share.herokuapp.com";
    const emailURL = `${baseURL}/api/files/send`;
    let res = ''
    fetch(emailURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then((res) => res.json())
        .then((data) => {

            if (data.success) {
                toasterMsg(data.success, 'success')
                res = data.success

            } else {
                toasterMsg(data.error, 'danger')
                res = data.error

            }           
        });

}