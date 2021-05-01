const express = require('express');
const router = express.Router();
const multer = require('multer')
const multerS3 = require("multer-s3");

const {s3} = require("../config/s3");
const { Board } = require("../models/Board");

//=================================
//             sns
//=================================

// let storage = multer.diskStorage({
//     destination: function(req,file,cb){
//         cb(null,'uploads/')
//     },
//     filename: function(req,file,cb){
//         cb(null ,`${Date.now()}_${file.originalname}`)
//     }
// })
const storage = multerS3({
    s3: s3,
    bucket: 'elasticbeanstalk-ap-northeast-2-840213432037/sns', // s3 생성시 버킷명
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',   // 업로드 된 데이터를 URL로 읽을 때 설정하는 값입니다. 업로드만 한다면 필요없습니다.
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname}); // 파일 메타정보를 저장합니다.
    },
    key: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`) // key... 저장될 파일명과 같이 해봅니다.
    }
})

let upload = multer({ storage:storage}).single("file")

router.post("/board", (req, res) => {

    upload(req,res,err => {
        if(err) return res.json({success:false,err})
        return res.json({success:true, filePath:res.req.file.location, fileName:res.req.file.filename})
}); 
});

router.post("/upload", (req, res) => {

    const board = new Board(req.body)
    console.log(req.body)
    board.save((err,result)=>{
        if(err) return res.status(400).json({success:false,err})
        return res.status(200).json({success:true , result})
    })
});

router.post("/getboard", (req, res) => {

    var skip = req.body.skip ? parseInt(req.body.skip) :0;
    var limit = req.body.limit ? parseInt(req.body.limit): 100;

    Board.find()
    .sort({"_id": -1})
    .populate('writer')
    .skip(skip)
    .limit(limit)
    .exec((err, board)=>{
        if(err) return res.status(400).json({success:false,err})
        return res.status(200).json({success:true, board, postSize:board.length})
    })
});

router.post("/getuserboard", (req, res) => {
    console.log(req.body.writer)
    var skip = req.body.skip ? parseInt(req.body.skip) :0;
    var limit = req.body.limit ? parseInt(req.body.limit): 100;

    Board.find({writer:req.body.writer})
    .sort({"_id": -1})
    .populate('writer')
    .skip(skip)
    .limit(limit)    
    .exec((err, board)=>{
        if(err) return res.status(400).json({success:false,err})
        return res.status(200).json({success:true, board, postSize:board.length})
    })
});

router.post("/getBoardDetail", (req, res) => {
    
    Board.find({_id:req.body.boardId})
    .populate('writer')
    .exec((err, board)=>{
        if(err) return res.status(400).json({success:false,err})
        return res.status(200).send(board)
    })
});



module.exports = router;
