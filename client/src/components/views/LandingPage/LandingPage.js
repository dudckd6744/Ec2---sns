import React, { useEffect, useState } from 'react'
import { Card,Image } from 'antd';
import Axios from 'axios';
import ImageSilder from "./Sections/ImageSilder";

const { Meta } = Card;


function LandingPage() {
    const [Board, setBoard] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setlimit] = useState(3)
    const [PostSize, setPostSize] = useState(0)



    useEffect(() => {

        var body = {
            skip:Skip,
            limit:Limit
        }

        Axios.post('/api/sns/getboard',body)
        .then(response => {
            if(response.data.success){
                console.log(response.data)
                setPostSize(response.data.postSize)
                setBoard(response.data.board)
            }else{
                alert("err")
            }
        })
    }, [])        

    const onclickhandle =()=>{

        var skip = Skip+Limit;

        var body={
            skip: skip,
            limit:Limit,
            lodemore:true
        }
        Axios.post('/api/sns/getboard',body)
        .then(response => {
            if(response.data.success){
                console.log(response.data)
                setPostSize(response.data.postSize)
                if(body.lodemore){
                    setBoard([...Board, ...response.data.board])
                }
            }else{
                alert("err")
            }
        })        
        setSkip(skip)
    }
    
        
    var renderBoard = Board
    .map((board, i)=>{
            if(board.image && board.image.length > 0){
                return (                            
                    <Card key={i}
                        style={{ maxWidth:"700px",width:'100%' ,margin: "2rem auto"}}
                        cover={
                            <a href ={`/board/${board._id}`} >
                            {/* style={{ height:"300px"}} */}
                            <ImageSilder images={board.image}/>                          
                            </a>
                        }

                        
                        >   
                        
                        <Meta
                        avatar={board.writer.name}
                        title={board.title}
                        description={board.description}
                        />
                    </Card>
                )
            }else{
                return(
                    <Card key={i}
                        style={{ maxWidth:"700px", margin: "2rem auto"}}
                        
                        actions={[
                        
                        // <Icon type="setting"/>,
                        // <Icon type="ellipsis"/>

                        ]}
                    >
                        <a href ={`board/${board._id}`} >
                        <Meta
                        avatar={board.writer.name}
                        title={board.title}
                        description={board.description}
                        />
                        </a>
                    </Card>
                )
            }
            
    })
    // .sort((a,b)=>
    //     b.key - a.key
    // )

    return (
    <>
    
    {renderBoard}
    <br />
    {PostSize >= Limit &&
                <div style={{ display:"flex", justifyContent:"center"}}>
                    <button onClick={onclickhandle}>더 보기</button>
                </div>
            }
        </>
        
    )
}

export default LandingPage
