import jwt from 'jsonwebtoken'

export  function authenticate(req,res,next) {
  const header = req.headers.authorization;
  const token = header && header.startsWith('Bearer ') ? header.split(' ')[1]:null;

  if (!token){
    return res.status(401).json({
      error:"No token provided."
    })
  }

  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error:"Invalid or expired token."
    })
  }
}