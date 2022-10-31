import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';

/**
 * Middleware are validation methods
 */
const VALID_FREET_TYPES = new Set(['News', 'Fibe']);

/**
 * Checks if the given freet type is non-empty and is one of the allowed freet types.
 */
const isValidFreetType = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.freetType) {
    res.status(400).json({
      error: 'Provided freet type must be nonempty.'
    });
    return;
  }

  const {freetType} = req.query as {freetType: string};

  if (!VALID_FREET_TYPES.has(freetType)) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet type ${freetType} does not exist. Try 'News' or 'Fibe' types.`
      }
    });
    return;
  }

  next();
};

export {
  isValidFreetType
};
