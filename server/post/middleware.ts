import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import PostCollection from './collection';

/**
 * Checks if a post has the resource needed for its post type
 */
const isPostPropertyComplete = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.focusReflection || !req.body.progressReflection) {
    res.status(412).json({
      error: 'Fibe post needs a focusReflection and progressReflection.' // Added this for error
    });
    return;
  }

  next();
};

/**
 * Checks if a post with postId is req.params exists
 */
const isPostExists = async (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const postId = req.body.postId === undefined ? req.params.postId : req.body.postId;
  const validFormat = Types.ObjectId.isValid(postId);
  console.log(postId);
  const post = validFormat ? await PostCollection.findOne(postId) : '';
  if (!post) {
    res.status(404).json({
      error: `Post with post ID ${req.params.postId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the photo of the post in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidPostContent = (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const photo = req.body.caption;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  if (!photo.trim()) {
    res.status(400).json({
      error: 'Post photo must be at least one character long.'
    });
    return;
  }

  if (photo.length > 100) {
    res.status(413).json({
      error: 'Post photo must be no more than 100 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the post whose postId is in req.params
 */
const isValidPostModifier = async (req: Request, res: Response, next: NextFunction) => {
  const post = await PostCollection.findOne(req.params.postId);
  const userId = post.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' posts.'
    });
    return;
  }

  next();
};

export {
  isPostPropertyComplete,
  isValidPostContent,
  isPostExists,
  isValidPostModifier
};
