import React, { useState } from 'react'
import {Input, Form, Typography, message,Button} from 'antd';
// import FileUpload from './Sections/FileUpload';
import Dropzone from "react-dropzone";
import { UploadOutlined} from '@ant-design/icons';

import Axios from 'axios';
// import Button from "react-bootstrap/Button"

const {Title} = Typography;


function UploadPage(props) {

    const [title, setTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Images, setImages] = useState([]);
    const [Board, setBoard] = useState([]);

    const onDrop=(files)=>{

        var formData = new FormData();
        const config = {
            header:{'content-type':'multipart/form-data'}
        }
        formData.append('file',files[0])
        console.log('file', files)

        Axios.post("/api/sns/board", formData, config)
        .then(response => {
            if(response.data.success){
                console.log(response.data)
                setImages([...Images, response.data.filePath])
            }else{
                alert("err")
            }
        })
        
    }

    const hanleTitle =(e)=>{
        setTitle(e.currentTarget.value)
    }
    const handleDescription =(e)=>{
        setDescription(e.currentTarget.value)
    }
    const onDelet=(image)=>{
        const currentIndex = Images.indexOf(image)
        console.log(currentIndex)
        var newImages = [...Images]
        newImages.splice(currentIndex,1)
        setImages(newImages)

    }

    const handleSubmit =(e)=>{
        const body ={
            writer:props.user.userData._id,
            title:title,
            image:Images,
            description:Description
        }
        console.log(body)
        Axios.post('/api/sns/upload', body)
        .then(response => {
            if(response.data.success){
                console.log(response.data)
                setBoard(response.data.success)
                setTimeout(() => {
                    message.success("게시글 업로드에 성공하셨습니다.")
                    props.history.push('/')
                }, 1000);
            }else{
                alert("게시글 업로드에 실패하였습니다.")
            }
        })
    }

    return (
        <div style={{  maxWidth:"700px", margin: "2rem auto", }}>
            <div style={{textAlign:"center", marginBottom:"2rem"}}>
                <Title  level={2}> UP load </Title>
            </div>
            <hr />
            <Form onSubmit={handleSubmit}>

                {/* <FileUpload refresh={updateImages} /> */}
                <br />
                <br />
                <label><h2>TITLE</h2></label>
                <Input value={title} onChange={hanleTitle} />
                <br />
                <br />
                <label><h3>description</h3></label>
                <Input style={{display:'flex', height:'360px',position:"relative" }}
                    value={Description} onChange={handleDescription} autoFocus></Input>
                <div style={{display:"flex",  width:"240px", height:"160px",overflowX:"scroll",position:"absolute",top:"360px"}} 
                        >
                    {Images.map((image, i)=>(
                        
                            <img                        
                            key={i} 
                            onClick={()=>onDelet(image)} 
                            style={{ minWidth:"240px", width:"240px", height:"160px" }} 
                            src={`${image}`}/>
                    ))}
                </div>

                
                <br />
                <br />
                <Dropzone
                onDrop={onDrop}>
                {({getRootProps, getInputProps})=> (
                    <Button size="large" {...getRootProps()}>
                        <input {...getInputProps()}/>
                        <UploadOutlined style={{fontSize:"1rem" }}/>
                    </Button>
                )}
                </Dropzone>
                <Button 
                onClick={handleSubmit}
                size="large" 
                style={{float:'right' }} 
                type="primary">제출</Button>

            </Form>
        </div>
    )
}

export default UploadPage
