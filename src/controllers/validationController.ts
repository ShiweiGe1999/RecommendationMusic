import validator from 'validator';
import { NextFunction, Request, Response } from 'express';

export const validateAccount = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const isValidEmail = validator.isEmail(email);
  if (!isValidEmail)
    return res.status(400).json({ message: 'Email not valida' });
  const isValidPassword = validator.isStrongPassword(password);
  next();
  if (!isValidEmail)
    return res.status(400).json({ message: 'Password not valid' });
};
