import React from 'react'
import { Carousel } from "antd";

function ImageSilder(props) {
    return (
        <div>
            <Carousel autoplay>
                {props.images.map((item, i)=> (
                    <div key={i}>
                        <img style={{width:"100%", height:"300px" }}
                        src={`${item}`}/>
                    </div>
                ))}
            </Carousel>
        </div>
    )
}

export default ImageSilder
