import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import PostCollection from '../post/collection';

/**
 * Middleware are validation methods
 */
const VALID_FREET_TYPES = new Set(['News', 'Fibe']);

/**
 * Checks if the given post type is non-empty and is one of the allowed post types.
 */
const isValidPostType = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.postType) {
    res.status(400).json({
      error: 'Provided post type must be nonempty.'
    });
    return;
  }

  const {postType} = req.query as {postType: string};

  if (!VALID_FREET_TYPES.has(postType)) {
    res.status(404).json({
      error: {
        postNotFound: `Post type ${postType} does not exist. Try 'News' or 'Fibe' types.`
      }
    });
    return;
  }

  next();
};

export {
  isValidPostType
};
