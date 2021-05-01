import React, { useEffect, useState } from 'react'
import ImageGallery from 'react-image-gallery';


function ProductImage(props) {

    const [Images, setImages] = useState([])
    
    useEffect(() => {

        if(props.detail && props.detail.image){

            let images=[]

            props.detail.image.map(item=>{
                images.push({
                    
                    original:`${item}`,
                    // thumbnail:`${item}`
                })
            })
            setImages(images)
        }
    }, [])
    // console.log(Images)
    return (
        <div>
            <ImageGallery  items={Images}  />
        </div>
    )
}

export default ProductImage
