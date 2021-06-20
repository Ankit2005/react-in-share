import React, { useRef, useMemo, useState } from 'react';
import '../../assets/script/dragDrop'
//import ReactDOM from 'react-dom';
import fileSvg from '../../assets/images/file.svg'
import copyIcon from '../../assets/images/copy-icon.svg'
import { useDropzone } from 'react-dropzone';
import { toasterMsg } from "../Toaster/Toaster"
import ProgressBar from 'react-bootstrap/ProgressBar'
import { useForm } from "react-hook-form";
import { sendEmail } from '../../Services/send-email.service'
//import ChipInput from 'material-ui-chip-input'
import TextField from '@material-ui/core/TextField';
//import { getMaxListeners } from 'process';

// import styled from 'styled-components'
const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

// const rejectStyle = {
//     borderColor: '#ff1744'
// };

function nameLengthValidator(file) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const maxAllowedSize = 100 / 1024 * 1024 //100mb
    //const baseURL = "https://inshare-file-share.herokuapp.com";    

    if (sizeInMB > maxAllowedSize) {
        toasterMsg(`File Size To Be Large ! ${sizeInMB} MB`, 'danger');
        return true
    }

    return false
}


const ImgDropZone = (props) => {

    //const [selectedFile, setSelectedFile] = useState([])
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showProgressBar, setShowProgressBar] = useState({ show: false, progress: 0 })
    const [emailForm, setEmailForm] = useState({ show: false })
    const [uploadedFileUrl, setUploadedFileUrl] = useState({ fileUrl: '' })
    const [emailChips, setEmailChips] = useState([])
    const ref = useRef();
   // const baseURL = "http://localhost:30001";
    const baseURL = "https://inshare-file-share.herokuapp.com";
    const uploadURL = `${baseURL}/api/files`;

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
    } = useDropzone({

        validator: nameLengthValidator,
        onDrop: acceptedFiles => {
            if (nameLengthValidator) {
                const selectedFile = acceptedFiles.map(file => Object.assign(file, {
                    file
                }));
                setShowProgressBar({ ...showProgressBar, show: true })
                const formData = new FormData();
                formData.append("myfile", selectedFile[0]);
                // upload file
                const xhr = new XMLHttpRequest();

                // listen for upload progress
                xhr.upload.onprogress = function (event) {
                    // find the percentage of uploaded
                    let percent = Math.round((100 * event.loaded) / event.total);
                    console.log('percent')
                    console.log(percent)
                    setShowProgressBar({ show: true, progress: percent })
                    if (percent === 100) {
                        setEmailForm({ show: true })
                        setShowProgressBar({ show: false, progress: 0 })
                    }
                    //const scaleX = `scaleX(${percent / 100})`;
                };

                // handle error
                xhr.upload.onerror = function () {
                    console.log(xhr.status)
                };

                // listen for response which will give the link
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        onFileUploadSuccess(xhr.responseText);
                        console.log('uploaded file url')
                        console.log(xhr.readyState)
                        console.log(xhr.responseText)
                    }
                };

                xhr.open("POST", uploadURL);
                xhr.send(formData);
            }
        }
    });

    const onFileUploadSuccess = (res) => {        
        const { file } = JSON.parse(res);
        setUploadedFileUrl({ fileUrl: file })
    };


    const clickToCopy = () => {
        ref.current.select();
        navigator.clipboard.writeText(uploadedFileUrl.fileUrl);
        toasterMsg('Copied to clipboard', 'default');
    }


    const onSubmit = async (data, e) => {
        console.log('chips after submit')
        console.log(emailChips)
        console.log('row form data')
        console.log(data)
        //const form = e.target;
        const formData = {
            uuid: uploadedFileUrl.fileUrl.split("/").splice(-1, 1)[0],
            emailTo: data.emailTo,
            emailFrom: data.emailFrom,
        };
        console.log("obj to send server")
        console.log(formData);
        sendEmail(formData);
        setEmailForm({ show: false })
        //form.reset();

    }

    // const handleChange = (chips) => {
    //     console.log('chips')
    //     console.log(chips)
    //     setEmailChips(chips)
    // }

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
    }), [
        isDragActive,
        isDragAccept
    ]);

    return (
        <>
            {/* <img src="./logo.png" alt="Inshare logo" className="logo" /> */}
            <div className="d-flex p-2 main-container">

                <section className="upload-container d-flex" >
                    <form action>
                        <div className={isDragAccept ? 'drop-zone container dragged' : 'drop-zone container '}>
                            <p className="title">Drop your Files here or, <span id="browseBtn">browse</span></p>
                            <div className="icon-container" {...getRootProps({ style })} >
                                <img src={fileSvg} draggable="false" className="center" alt="File Icon" />
                                <img src={fileSvg} draggable="false" className="left" alt="File Icon" />
                                <img src={fileSvg} draggable="false" className="right" alt="File Icon" />
                            </div>
                            <input type="file" id="fileInput" {...getInputProps()} />
                        </div>
                    </form>


                    {
                        showProgressBar.show &&
                        <>
                            <div className="row w-100 py-3">
                                <div className="col-11 m-auto">
                                    <div className="status my-1">{showProgressBar.progress === 100 ? 'Uploaded' : 'Uploading...'}</div>
                                    <div className="align-items-center d-flex justify-content-between w-100">
                                        <div>{`${showProgressBar.progress}%`}</div>
                                        <div className="w-100 mx-2">
                                            <ProgressBar className="file-progress-bar" variant={showProgressBar.progress > 90 ? 'success' : ''} now={showProgressBar.progress} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }

                    {
                        emailForm.show &&
                        <>
                            <div className="sharing-container">
                                <p className="expire">Link expires in 24 hrs</p>
                                <div className="input-container">
                                    <input ref={ref} type="text" value={uploadedFileUrl.fileUrl} id="fileURL" readOnly />
                                    <img src={copyIcon} onClick={() => { clickToCopy() }} id="copyURLBtn" alt="copy to clipboard icon" />
                                </div>
                                <p className="email-info">Or Send via Email</p>
                                <div className="email-container">
                                    <form onSubmit={handleSubmit(onSubmit)} id="emailForm">
                                        <div className="filed">
                                            {/* <label htmlFor="senderEmail">Your email</label> */}
                                            {/* <input type="email" {...register("senderEmail", { required: true })} autoComplete="email" name="senderEmail" id="senderEmail" /> */}
                                            <TextField
                                                type="email"
                                                {...register("emailFrom", { required: true })}
                                                autoComplete="email"
                                                name="emailFrom"
                                                placeholder="Your email"
                                                error={errors.emailFrom}
                                                fullWidth

                                            />
                                            {/* {errors.senderEmail && <div className="text-danger err-text">Sender email is required</div>} */}
                                        </div>
                                        <div className="filed my-2">
                                            {/* <label htmlFor="receiverEmail">Receiver's email</label> */}
                                            {/* <ChipInput type="email"
                                                {...register("emailTo", { required: false })}
                                                autoComplete="receiver"   
                                                name="emailTo"
                                                fullWidth
                                                error={errors.emailTo} 
                                                placeholder="Receiver Email"
                                                onChange={(chips) => handleChange(chips)}
                                            /> */}
                                            <TextField
                                                type="email"
                                                {...register("emailTo", { required: true })}
                                                autoComplete="email"
                                                name="emailTo"
                                                placeholder="Your email"
                                                error={errors.emailTo}
                                                fullWidth

                                            />
                                            {/* <input type="email" {...register("receiverEmail", { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i })}  autoComplete="receiver" name="receiverEmail" id="receiverEmail" /> */}
                                            {/* {errors.receiverEmail && <div className="text-danger err-text">Receiver's email is required</div>} */}
                                        </div>
                                        <div className="send-btn-container">
                                            <button type="submit">Send</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </>
                    }
                </section>



                <div className="col-6">
                    <div className="image-vector"></div>

                </div>

            </div>
            <div className="toast">Sample message</div>
            {/* github fork button */}
            {/* <a href="https://github.com/ShivamJoker/inshare" className="github-corner" aria-label="View source on GitHub">
                <svg width={80} height={80} viewBox="0 0 250 250" style={{ fill: '#131315c9', color: '#fff', position: 'absolute', top: 0, border: 0, right: 0 }} aria-hidden="true">
                    <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
                    <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style={{ transformOrigin: '130px 106px' }} className="octo-arm">
                    </path>
                    <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" className="octo-body">
                    </path>
                </svg>
            </a> */}
        </>
    )
}

export default ImgDropZone
