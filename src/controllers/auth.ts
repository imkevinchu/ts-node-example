import express from 'express';
import { createUser, getUserByEmail } from '../db/users'
import { random, auth } from '../auth'

export const login = async (req: express.Request, res: express.Response) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.sendStatus(400);
      }
  
      const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
  
      if (!user) {
        return res.sendStatus(400);
      }
  
      const expectedHash = auth(user.authentication.salt, password);
      
      if (user.authentication.password != expectedHash) {
        return res.sendStatus(403);
      }
  
      const salt = random();
      user.authentication.sessionToken = auth(salt, user._id.toString());
  
      await user.save();
  
      res.cookie('SAMPLE-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });
  
      return res.status(200).json(user).end();
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  };

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username} = req.body;

        if (!email || !password || !username) {
            return res.sendStatus(400);
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.status(400).send("user already exists");
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: auth(salt, password),

            }
        })

        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}