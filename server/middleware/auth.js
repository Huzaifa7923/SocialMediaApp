import express from "express";
import jwt from "jsonwebtoken";

export const auth = async (req, res) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(403).send("Access denied");
    }
    if (token.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
