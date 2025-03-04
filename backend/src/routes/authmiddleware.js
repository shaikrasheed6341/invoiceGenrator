import jwt from "jsonwebtoken";

const authmiddle = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""));
    req.userid = decoded.userid;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

export default authmiddle;
