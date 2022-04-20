import validator from 'validator';
import { Request, Response } from 'express';

export const validateAccount = (req: Request, res: Response) => {
  const { email, password } = req.body;
  const isValidEmail = validator.isEmail(email);
  if (!isValidEmail)
    return res.status(400).json({ message: 'Email not valida' });
  const isValidPassword = validator.isStrongPassword(password);
  if (!isValidEmail)
    return res.status(400).json({ message: 'Password not valid' });
};
