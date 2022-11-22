import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import PostCollection from '../post/collection';
import UserCollection from '../user/collection';
import EndorseCollection from './collection';
import PointCollection from '../point/collection';
import EndorseModel from './model';

/**
 * Checks if a post has been endorsed
 * @throws {409} if the post is not a News post, and therefore not endorsable.
 */
const isEndorseExist = async (req: Request, res: Response, next: NextFunction) => {
  const endorse = await EndorseCollection.findOne(req.body.postId, req.session.userId);
  console.log(endorse, req.body);
  if (endorse) {
    res.status(409).json({
      error: {
        message: 'You have already endorsed this post.'
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a post has been endorsed
 * @throws {409} if the post is not a News post, and therefore not endorsable.
 */
const canUserEndorse = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUserId(req.session.userId);
  const userPoint = await PointCollection.findOne(user.point); // Id
  const canEndorse = userPoint.privileges.get('canEndorse');
  if (!canEndorse) {
    res.status(409).json({
      error: {
        message: 'Your point is not enough to endorse. Make more posts!'
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a post has been endorsed
 * @throws {409} if the post is not a News post, and therefore not endorsable.
 */
const isEndorseNotExist = async (req: Request, res: Response, next: NextFunction) => {
  const endorse = await EndorseCollection.findOne(req.body.postId, req.session.userId);
  if (!endorse) {
    res.status(409).json({
      error: {
        message: 'You never endorsed this post.'
      }
    });
    return;
  }

  next();
};

/**
 * Ensures a user cannot endorse a post from themselve.
 * @throws {405} When user tries to endorse their own post.
 */
const isEndorseSelf = async (req: Request, res: Response, next: NextFunction) => {
  const post = await PostCollection.findOne(req.body.postId);
  const postAuthor = post.authorId._id.toString();
  console.log(postAuthor, req.session.userId, postAuthor === req.session.userId);
  if (postAuthor === req.session.userId) {
    res.status(405).json({
      error: {
        message: 'Cannot endorse your own post.'
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
