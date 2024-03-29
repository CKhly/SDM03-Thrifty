const jwt = require('jsonwebtoken');

// JWT decode
function decodeJWT(accessToken){
  try {
    const privateKey = process.env.JWT_ADMIN_SECRECT;
    const decodedPayload = jwt.verify(accessToken, privateKey)
    return [false, decodedPayload]

  } catch(error){
    console.log(`${error.name}: ${error.message}`)
    return [true, error.message]
  }
}


// 驗證 token middleware
function JWTValidate(req, res, next) {
  // 確認是否有 token 存在
  let accessToken;
  try {
    accessToken = req.header('Authorization').replace('Bearer ', '');
  } catch (error){
    res.status(401).send({message: '沒有 token，請先登入！'})
    return
  }

  // decode token
  const decodeInfo = decodeJWT(accessToken);
  const isNotValid = decodeInfo[0];
  const payload = decodeInfo[1];  // 如果認證失敗，會取得 error message

  if (isNotValid){
    res.status(403).send({message:`${payload}, 認證失敗！`})
    return
  }

  // 將 payload 傳出去
  res.locals.payload = payload;
  next();
};


module.exports = {JWTValidate}