const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const port = 5000;
const app = express();

// CORS 처리
const corsOptions = {
    origin: '*', //프론트엔드 3000요청 허용
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // 허용할 헤더
  };

app.use(cors(corsOptions
));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB 연결완료...');
})
.catch(err => {
    console.error(err);
})

app.get('/', (req, res, next) => {
    setImmediate(() => {next( new Error('dd'))}); 
})

app.post('/', (req, res) => {
    console.log(req.body);
    res.send(req.body);
})

///users 이 경로로 요청이 오면 해당 라우터로 간다.
app.use('/users', require('./routes/users')) 

///reservations 이 경로로 요청이 오면 해당 라우터로 간다.
app.use('/reservations', require('./routes/reservations')) 



//에러 처리기(에러가 발생하면 서버가 다운되지 않도록 하는 것)
app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.send(error.message || '서버에서 에러가 났습니다.');
})

app.use(express.static(path.join(__dirname, '../uploads')));

app.listen(port, () => {
    console.log('Server is running on port 5000');
});