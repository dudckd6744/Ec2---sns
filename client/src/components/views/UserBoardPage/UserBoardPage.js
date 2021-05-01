import React, { useEffect, useState } from 'react'
// import Image from 'react-bootstrap/Image'
import { Card ,Image} from 'antd';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import ImageSilder from '../LandingPage/Sections/ImageSilder';

const { Meta } = Card;

function UserBoardPage() {

    const [Board, setBoard] = useState([]);
    const [Skip, setSkip] = useState(0)
    const [Limit, setlimit] = useState(3)
    const [PostSize, setPostSize] = useState(0)

    const user = useSelector(state => state.user.userData)
    
    useEffect(() => {

        let body ={
            writer: localStorage.getItem('userId'),
            skip:Skip,
            limit:Limit
        }
        
        console.log(body)

        Axios.post('/api/sns/getuserboard', body)
        .then(response => {
            if(response.data.success){
                console.log(response.data)
                setBoard(response.data.board)
                setPostSize(response.data.postSize)

            }else{
                alert("err")
            }
        })
    }, [])        
    const onclickhandle =()=>{

        let skip = Skip+Limit;

        let body={
            writer: localStorage.getItem('userId'),
            skip: skip,
            limit:Limit,
            lodemore:true
        }
        Axios.post('/api/sns/getuserboard', body)
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
    <div style={{ maxWidth:"700px", margin:'2rem auto'}}>
    <img src={user&& user.image} style={{borderRadius:"70%",maxWidth:"40px",display: "inline-block"}} />
    <h2 style={{display: "inline-block" , marginLeft:"1rem"}}> {user&&user.name}</h2>
        <hr/>
    </div>
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

export default UserBoardPage
