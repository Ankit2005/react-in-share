import { toasterMsg } from "../Components/Toaster/Toaster"
export const sendEmail = (formData) => {
    const baseURL = "http://localhost:30001";
    const emailURL = `${baseURL}/api/files/send`;

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
            } else {
                toasterMsg(data.error, 'danger')
            }
        });
}