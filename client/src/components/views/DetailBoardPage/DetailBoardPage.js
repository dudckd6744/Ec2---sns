import React, { useEffect, useState } from 'react'
import { Row, Col,Card } from "antd"
import { Image } from 'antd';
import Comments from './Sections/Comments';
import Axios from 'axios';
import { RestTwoTone } from '@ant-design/icons';
import ProductImage from './Sections/ProductImage';

const { Meta } = Card;


function DetailBoardPage(props) {

    const boardId = props.match.params.boardId
    // console.log(props.match.params.boardId)
    const variable = {boardId:boardId}

    const [Board, setBoard] = useState({})
    const [comments, setcomments] = useState([])
    const [Reply, setReply] = useState([])

    useEffect(() => {
        Axios.post("/api/sns/getBoardDetail", variable)
        .then(response => {
            if(response.data){
                console.log(response.data[0])
                setBoard(response.data[0])
            }else{
                alert("게시글 정보를 가져오는데 실패하였습니다.")
            }
        })

        Axios.post('/api/comment/getComment',variable)
        .then(response=>{
            if(response.data.success){ 
                // console.log(response.data.comment)
                setcomments(response.data.comment)
            }else{
                alert("Err")
            }
        })
    }, [])

    // 댓글 추가시 렌더링 해주는 부분
    const refreshFunction = (newComment) =>{
        setcomments(comments.concat(newComment))
        
    }
    //댓글삭제 버튼입력시 랜더링 해주는부분
    const refreshDelete = (newComment)=>{
        // 파인드인덱스로 삭제한 코멘트가 지금 스테잇코멘트에있는지 확인후
        const index = comments.findIndex(comments => comments._id === newComment._id);
        console.log(index)
            if(index !== -1){
                // -1이아니면 일치하는게 있다는말
                //일치하는 코멘트를 제외한 나머지를 렌더링해준다
                var  deletecomments = comments.filter(comments => comments._id !==newComment._id)
                console.log(deletecomments)
                setcomments(deletecomments)
            }
        // setcomments(comments.filter(...comments,newComment))
    }

    var renderBoard = () =>{
        if(Board && Board.image && Board.image.length >0){
            return(
                <Card
                    style={{ maxwidth: "90%" ,margin:'2rem 2rem' }}
                    cover={<ProductImage detail={Board}/>
                    // <Image 
                    //     style={{height:"600px"}}
                    //     alt="example" 
                    //     src={`${Board[0]&& Board[0].image}`}/>
                    }
                >
                    <Meta title={Board&& Board.title} description={Board&& Board.description} />
                </Card>
            )
        }else{
            return (
                <Card 
                style={{ 
                    maxwidth: "90%", margin:'2rem 2rem',border:"2px solid gray",
                    borderRadius:"10px",height:"700px",fontSize:"20px"
                }}
                title={<h1>{Board&& Board.title}</h1>}
                size="large"
                bordered={false}>
                {Board&& Board.description}
                </Card>

            )

        }
    }
    
    return (
        <Row gutter={[16,16]}>
            <Col lg={12} xs={24}>
                {renderBoard()}
            </Col>
            <Col lg={12} xs={24}>
                <Comments refreshDelete={refreshDelete} refreshFunction={refreshFunction} content={comments} boardId={boardId}/>
            </Col>
        </Row>
    )
}

export default DetailBoardPage
