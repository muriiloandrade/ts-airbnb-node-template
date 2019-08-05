import { Response, Request } from 'express';
import { Error } from 'mongoose';
import emailValidator from 'email-validator';
import logger from '../utils/logger';
import User from '../models/User/schemas/UserSchema';
import { UserInterface } from '../models/User/interfaces/UserInterface';
import { UserErrorInterface } from '../models/User/interfaces/UserErrorInterface';

const emailMsg = 'Email inválido!';
const senhaMsg = 'Senha deve ter no mínimo 8 e no máximo 30 caracteres!';

class UserController {
  public static async listUsers(req: Request, res: Response) {
    await User.find()
      .then((users) => {
        if (users.length) res.status(200).json(users);
        else res.status(200).json({ message: 'Nenhum usuário cadastrado!' });
      })
      .catch((err: Error) => {
        logger.error(`Erro: ${err.message}`);
        process.exit(1);
      });
  }

  public static async createUser(req: Request, res: Response) {
    const userInfo = req.body as UserInterface;
    const errors: UserErrorInterface = {};

    if (userInfo.password.length < 8 || userInfo.password.length >= 30) {
      errors.password = senhaMsg;
    }

    if (!emailValidator.validate(userInfo.email)) {
      errors.email = emailMsg;
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json(errors);
      return;
    }

    await User.create(userInfo)
      .then((createdUser) => {
        res.status(201).json(createdUser);
      })
      .catch((err: Error) => {
        res.status(409).json({ error: `${err.message}` });
      });
  }

  public static async updateUser(req: Request, res: Response) {
    const userInfo = req.body as UserInterface;
    const error: UserErrorInterface = {};

    if (userInfo.password.length < 8 || userInfo.password.length >= 30) {
      error.password = senhaMsg;
    }

    if (!emailValidator.validate(userInfo.email)) {
      error.email = emailMsg;
    }

    if (Object.keys(error).length > 0) {
      res.status(400).json(error);
      return;
    }

    await User.updateOne({
      email: userInfo.email,
    },
    {
      $set: {
        password: userInfo.password,
      },
    }).then(() => {
      res.send({ message: 'Senha alterada com sucesso!' });
    }).catch((err: Error) => {
      res.json({
        name: `${err.name}`,
        message: `${err.message}`,
      });
      logger.error({
        name: `${err.name}`,
        message: `${err.message}`,
      });
    });
  }

  public static async deleteUser(req: Request, res: Response) {
    const userInfo = req.body as UserInterface;
    const error: UserErrorInterface = {};

    if (!emailValidator.validate(userInfo.email)) {
      error.email = emailMsg;
    }

    if (Object.keys(error).length > 0) {
      res.status(400).json(error);
      return;
    }

    await User.findOneAndDelete({ email: userInfo.email })
      .then((removed) => {
        if (removed != null) res.status(200).json(removed);
        else res.status(400).json({ message: 'Usuário não encontrado!' });
      })
      .catch((err: Error) => {
        res.status(400).json(err);
      });
  }
}

export default UserController;
