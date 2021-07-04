import React, { useRef, useMemo, useState } from 'react';
import './style.css'
import '../../assets/script/dragDrop'
//import ReactDOM from 'react-dom';
import fileSvg from '../../assets/images/file.svg'
import sendMail from '../../assets/images/email-send.png'
import greenTik from '../../assets/images/green-tik.png'
import copyIcon from '../../assets/images/copy-icon.svg'
import { useDropzone } from 'react-dropzone';
import { toasterMsg } from "../Toaster/Toaster"
import { useForm } from "react-hook-form";
import { sendEmail } from '../../Services/send-email.service'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Typing from 'react-typing-animation';
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

const cardBg = {
    backgroundColor: '#e9f8ff'
}

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

// const rejectStyle = {
//     borderColor: '#ff1744'
// };

const FileDropzone = () => {

    //const [selectedFile, setSelectedFile] = useState([])
    const [cardFlip, setCardFlip] = useState(false)
    const [showGringTik, setShowGringTik] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showProgressBar, setShowProgressBar] = useState({ show: false, progress: 0 })
    const [emailForm, setEmailForm] = useState({ show: false })
    const [uploadedFileUrl, setUploadedFileUrl] = useState({ fileUrl: '' })
    const [emailChips, setEmailChips] = useState([])
    const [mailSendSuccess, setMailSendSuccess] = useState(false)
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
        onDrop: acceptedFiles => {
            const selectedFile = acceptedFiles.map(file => Object.assign(file, {
                file
            }));
            const sizeInMB = (selectedFile[0].size / (1024 * 1024)).toFixed(2);
            const maxAllowedSize = 100 / 1024 * 1024 //100mb

            if (maxAllowedSize > sizeInMB) {
                setShowProgressBar({ ...showProgressBar, show: true })
                const formData = new FormData();
                formData.append("myfile", selectedFile[0]);
                // upload file
                const xhr = new XMLHttpRequest();

                // listen for upload progress
                xhr.upload.onprogress = function (event) {
                    // find the percentage of uploaded          

                    let percent = Math.round((100 * event.loaded) / event.total);
                    setShowProgressBar({ show: true, progress: percent })
                    if (percent === 100) {
                        setShowGringTik(true)
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
                    if (xhr.readyState == XMLHttpRequest.DONE) {
                        console.log('xhr.readyState')
                        console.log(xhr.readyState)
                        console.log(xhr.responseText)
                        onFileUploadSuccess(xhr.responseText);
                        console.log('uploaded file url')
                        console.log(xhr.readyState)
                        console.log(xhr.responseText)
                    }
                };

                xhr.open("POST", uploadURL);
                xhr.send(formData);

            } else {
                toasterMsg(`File Size To Be Large ! ${sizeInMB} MB`, 'danger');
            }
        }
    });

    const onFileUploadSuccess = (res) => {
        console.log('error 122')
        console.log(res)

        const { file } = JSON.parse(res);
        console.log(file)
        setUploadedFileUrl({ fileUrl: file })
    };


    const clickToCopy = () => {
        if (navigator.clipboard && window.isSecureContext) {
            // navigator clipboard api method'
            ref.current.select();
            navigator.clipboard.writeText(uploadedFileUrl.fileUrl);
            toasterMsg('Copied to clipboard', 'default');
        }

    }

    const onSubmit = async (data, e) => {
        console.log('chips after submit')
        console.log(emailChips)
        console.log('row form data')
        console.log(data)

        const formData = {
            uuid: uploadedFileUrl.fileUrl.split("/").splice(-1, 1)[0],
            emailTo: data.emailTo,
            emailFrom: data.emailFrom,
        };
        console.log("obj to send server")
        console.log(formData);
        sendEmail(formData);
        setEmailForm({ show: false })
        setMailSendSuccess(true)
        e.target.reset();
        //form.reset();
    }

    const getLink = () => {
        setCardFlip(true)
        setShowGringTik(false)
    }

    const sendToOther = () => {
        setCardFlip(false)
        setMailSendSuccess(false)
    }

    // const handleChange = (chips) => {
    //     console.log('chips')
    //     console.log(chips)
    //     setEmailChips(chips)
    // }

    const style = useMemo(() => ({
        ...baseStyle, cardBg,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
    }), [
        isDragActive,
        isDragAccept
    ]);

    return (
        <>
            <div className="section ">
                <div className="">
                    <div className="d-md-flex full-height justify-content-md-start justify-content-center ">
                        <div className=" text-center align-self-center">
                            <div className="section text-center py-5 py-md-0">

                                <input className="pricing" checked={cardFlip} type="checkbox" id="pricing" name="pricing" />
                                {/* <label htmlFor="pricing"><span className="block-diff">kayaking<span className="float-right">camping</span></span></label> */}
                                <div className="card-3d-wrap m-auto">
                                    <div className="card-3d-wrapper">
                                        {/* card-front side start */}
                                        <div className={isDragAccept ? 'card-front bg-light-blue' : 'card-front '}>
                                            <div className="pricing-wrap" >
                                                <h2 className="mb-4 shareable">Shareable </h2>

                                                <form action>

                                                    <div className={isDragAccept ? 'drop-zone container dragged ' : 'drop-zone container '}>

                                                        <div className="icon-container" {...getRootProps({ style })} >
                                                            <img src={fileSvg} draggable="false" className="center" alt="File Icon" />
                                                            <img src={fileSvg} draggable="false" className="left" alt="File Icon" />
                                                            <img src={fileSvg} draggable="false" className="right" alt="File Icon" />
                                                        </div>

                                                        <p className="title">Drop your Files here or,
                                                            <span id="browseBtn">browse <input type="file" id="fileInput" {...getInputProps()} /> </span>
                                                        </p>
                                                    </div>
                                                </form>

                                                <>
                                                    <div>

                                                        {
                                                            showProgressBar.show &&
                                                            <div>
                                                                <div className="d-flex justify-content-center w-100 mt-2">
                                                                    <div style={{ width: 118 }}>
                                                                        <CircularProgressbar value={showProgressBar.progress} text={`${showProgressBar.progress}%`} />
                                                                    </div>
                                                                </div>
                                                                <a className="btn link mt-2">Uploading...</a>
                                                            </div>
                                                        }


                                                        {showGringTik &&
                                                            <>
                                                                <div>
                                                                    <img src={greenTik} alt="green-tik" />
                                                                </div>
                                                                <a onClick={getLink} className="btn link mt-2">Get link</a>
                                                            </>
                                                        }
                                                    </div>
                                                </>
                                            </div>
                                        </div>
                                        {/* card-front side end */}

                                        <div className="card-back">
                                            <div className="pricing-wrap">
                                                <h2 className="mb-4 shareable">Shareable </h2>
                                                <div className="px-3"><hr /></div>
                                                {
                                                    emailForm.show &&
                                                    <>
                                                        <div className="sharing-container">
                                                            <p className="expire">Link expires in 24 hrs</p>
                                                            <div className="input-container">
                                                                <div className="form-group w-100">
                                                                    <input
                                                                        ref={ref} type="text"
                                                                        value={uploadedFileUrl.fileUrl}
                                                                        id="fileURL"
                                                                        readOnly
                                                                        className="form-control" />
                                                                </div>
                                                                <img src={copyIcon} onClick={() => { clickToCopy() }} id="copyURLBtn" alt="copy to clipboard icon" />
                                                            </div>
                                                            <p className="email-info"> Or Send via Email </p>
                                                            <div className="email-container">
                                                                <form onSubmit={handleSubmit(onSubmit)} id="emailForm">
                                                                    <div className="form-group w-100 mb-2">
                                                                        <label className="form-control-label text-muted float-left">Your Email</label>
                                                                        <input type="email"
                                                                            {...register("emailFrom", { required: true })}
                                                                            autoComplete="email"
                                                                            name="emailFrom"
                                                                            placeholder="Your email"
                                                                            className={errors.emailFrom ? 'form-control border border-danger' : 'form-control'} />
                                                                    </div>
                                                                    <div className="form-group w-100">
                                                                        <label className="form-control-label text-muted float-left">Receiver Email</label>
                                                                        <input type="email"
                                                                            {...register("emailTo", { required: true })}
                                                                            autoComplete="email"
                                                                            name="emailTo"
                                                                            placeholder="Receiver email"
                                                                            className={errors.emailTo ? 'form-control border border-danger' : 'form-control'} />
                                                                    </div>

                                                                    <div className="w-100">
                                                                        <button type="submit" className="btn gradient-btn w-100 mt-1">Send </button>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </>
                                                }

                                                {
                                                    mailSendSuccess && <>
                                                        <div>
                                                            <img className="w-94" src={sendMail} alt="send-email" />
                                                            <div className="w-75 m-auto">
                                                                <button onClick={sendToOther} className="btn btn-info link w-100 mt-1">Send To Other</button>
                                                            </div>
                                                        </div>
                                                    </>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* typing animation */}
                        <div className=" col-md-8 col-12 d-none d-flex align-items-center justify-content-center typing-txt">
                            <Typing   speed={70} >
                                <Typing.Speed ms={200} />
                                Welcome To Shareable,
                                Share Any Time To Any Where.
                            </Typing>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default FileDropzone
