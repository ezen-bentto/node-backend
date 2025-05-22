// import { Request, Response } from 'express';
// import { validate } from 'class-validator';
// import { CreateUserDto } from '@/dtos/CreateUserDto';
// import * as UserModel from '@/models/user.model';
// import bcrypt from 'bcrypt';

// export const register = async (req: Request, res: Response) => {
//   const dto = Object.assign(new CreateUserDto(), req.body);
//   const errors = await validate(dto);
//   if (errors.length > 0) return res.status(400).json(errors);

//   const hashedPw = await bcrypt.hash(dto.password, 10);
//   await UserModel.createUser(dto.email, hashedPw, dto.name);

//   res.status(201).json({ message: 'User created' });
// };
