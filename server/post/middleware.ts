import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import PostCollection from './collection';

/**
 * Checks if a string is a valid URL with schema (like https)
 */
function isUrl(s: string) {
  const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  return regexp.test(s);
}

/**
 * Checks if a post has the resource needed for its post type
 */
const isPostPropertyComplete = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.caption !== 'News' && req.body.caption !== 'Fibe') {
    res.status(412).json({
      error: 'Please provide a valid Post type: News or Fibe.'
    });
    return;
  }

  const isNewsPost = req.body.caption === 'News';
  const isFibePost = req.body.caption === 'Fibe';
  if (isNewsPost) {
    if (!req.body.focusReflection) {
      res.status(412).json({
        error: 'News post needs a source link.'
      });
      return;
    }

    if (!isUrl(req.body.focusReflection)) {
      res.status(412).json({
        error: 'The provided source link is not in valid URL format (include https and schema)'
      });
      return;
    }
  }

  if (isFibePost && !req.body.progressReflection) {
    res.status(412).json({
      error: 'Fibe post needs an progressReflection.' // Added this for error
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
  const {photo} = req.body as {photo: string}; // Changed
  if (!photo.trim()) {
    res.status(400).json({
      error: 'Post photo must be at least one character long.'
    });
    return;
  }

  if (photo.length > 140) {
    res.status(413).json({
      error: 'Post photo must be no more than 140 characters.'
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
