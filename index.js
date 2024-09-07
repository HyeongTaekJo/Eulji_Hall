const express = require('express')
const app = express()
const port = 5000

const config = require('./config/key');

const { User } = require('./models/User');

// JSON 본문 파싱
app.use(express.json());

// URL 인코딩된 본문 파싱
app.use(express.urlencoded({ extended: true }));

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
    .then(() => console.log('mongoDB Connected...'))
    .catch(err => console.log(err))

    
app.get('/', (req, res) => {
  res.send('Hello World!222dddddd2')
})

app.post('/register',  async(req, res) => {
  //회원 가입 할때 필요한 정보들을 클라이언트에서 가져오면 데이터 베이스에 넣어준다.
  const user = new User(req.body);

  try {
    const user = new User(req.body);
    await user.save(); // 콜백 대신 await 사용
    res.status(200).json({ success: true });
  } catch (err) {
      res.status(400).json({ success: false, err });
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
