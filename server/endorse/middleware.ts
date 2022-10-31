import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import EndorseCollection from './collection';
import LevelCollection from '../level/collection';
import EndorseModel from './model';

/**
 * Checks if a freet has been endorsed
 * @throws {409} if the freet is not a News post, and therefore not endorsable.
 */
const isEndorseExist = async (req: Request, res: Response, next: NextFunction) => {
  const endorse = await EndorseCollection.findOne(req.body.freetId, req.session.userId);
  console.log(endorse, req.body);
  if (endorse) {
    res.status(409).json({
      error: {
        message: 'You have already endorsed this freet.'
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a freet has been endorsed
 * @throws {409} if the freet is not a News post, and therefore not endorsable.
 */
const canUserEndorse = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUserId(req.session.userId);
  const userLevel = await LevelCollection.findOne(user.level); // Id
  const canEndorse = userLevel.privileges.get('canEndorse');
  if (!canEndorse) {
    res.status(409).json({
      error: {
        message: 'Your level is not enough to endorse. Make more freets!'
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a freet has been endorsed
 * @throws {409} if the freet is not a News post, and therefore not endorsable.
 */
const isEndorseNotExist = async (req: Request, res: Response, next: NextFunction) => {
  const endorse = await EndorseCollection.findOne(req.body.freetId, req.session.userId);
  if (!endorse) {
    res.status(409).json({
      error: {
        message: 'You never endorsed this freet.'
      }
    });
    return;
  }

  next();
};

/**
 * Ensures a user cannot endorse a post from themselve.
 * @throws {405} When user tries to endorse their own freet.
 */
const isEndorseSelf = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.body.freetId);
  const freetAuthor = freet.authorId._id.toString();
  console.log(freetAuthor, req.session.userId, freetAuthor === req.session.userId);
  if (freetAuthor === req.session.userId) {
    res.status(405).json({
      error: {
        message: 'Cannot endorse your own freet.'
      }
    });
    return;
  }

  next();
};

export {
  isEndorseExist,
  canUserEndorse,
  isEndorseNotExist,
  isEndorseSelf
};
