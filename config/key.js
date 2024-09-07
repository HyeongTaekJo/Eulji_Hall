if(process.env.NODE_ENV === 'production') {
    module.exports = require('./prod'); //배포한 후
} else {
    module.exports = require('./dev'); // 배포 전
}