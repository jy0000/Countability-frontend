import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';

/**
 * Checks if a string is a valid URL with schema (like https)
 */
function isUrl(s: string) {
  const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  return regexp.test(s);
}

/**
 * Checks if a freet has the resource needed for its freet type
 */
const isFreetPropertyComplete = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.freetType !== 'News' && req.body.freetType !== 'Fibe') {
    res.status(412).json({
      error: 'Please provide a valid Freet type: News or Fibe.'
    });
    return;
  }

  const isNewsFreet = req.body.freetType === 'News';
  const isFibeFreet = req.body.freetType === 'Fibe';
  if (isNewsFreet) {
    if (!req.body.sourceLink) {
      res.status(412).json({
        error: 'News freet needs a source link.'
      });
      return;
    }

    if (!isUrl(req.body.sourceLink)) {
      res.status(412).json({
        error: 'The provided source link is not in valid URL format (include https and schema)'
      });
      return;
    }
  }

  if (isFibeFreet && !req.body.emoji) {
    res.status(412).json({
      error: 'Fibe freet needs an emoji.' // Added this for error
    });
    return;
  }

  next();
};

/**
 * Checks if a freet with freetId is req.params exists
 */
const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const freetId = req.body.freetId === undefined ? req.params.freetId : req.body.freetId;
  const validFormat = Types.ObjectId.isValid(freetId);
  console.log(freetId);
  const freet = validFormat ? await FreetCollection.findOne(freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: `Freet with freet ID ${req.params.freetId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidFreetContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string}; // Changed
  if (!content.trim()) {
    res.status(400).json({
      error: 'Freet content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Freet content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidFreetModifier = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const userId = freet.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' freets.'
    });
    return;
  }

  next();
};

export {
  isFreetPropertyComplete,
  isValidFreetContent,
  isFreetExists,
  isValidFreetModifier
};
