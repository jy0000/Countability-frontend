import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import SessionCollection from './collection';

/**
 * Checks if a string is a valid URL with schema (like https)
 */
function isUrl(s: string) {
  const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  return regexp.test(s);
}

/**
 * Checks if a session has the resource needed for its session type
 */
const isSessionPropertyComplete = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.sessionType !== 'News' && req.body.sessionType !== 'Fibe') {
    res.status(412).json({
      error: 'Please provide a valid Session type: News or Fibe.'
    });
    return;
  }

  const isNewsSession = req.body.sessionType === 'News';
  const isFibeSession = req.body.sessionType === 'Fibe';
  if (isNewsSession) {
    if (!req.body.sourceLink) {
      res.status(412).json({
        error: 'News session needs a source link.'
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

  if (isFibeSession && !req.body.emoji) {
    res.status(412).json({
      error: 'Fibe session needs an emoji.' // Added this for error
    });
    return;
  }

  next();
};

/**
 * Checks if a session with sessionId is req.params exists
 */
const isSessionExists = async (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const sessionId = req.body.sessionId === undefined ? req.params.sessionId : req.body.sessionId;
  const validFormat = Types.ObjectId.isValid(sessionId);
  console.log(sessionId);
  const session = validFormat ? await SessionCollection.findOne(sessionId) : '';
  if (!session) {
    res.status(404).json({
      error: `Session with session ID ${req.params.sessionId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the session in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidSessionContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string}; // Changed
  if (!content.trim()) {
    res.status(400).json({
      error: 'Session content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Session content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the session whose sessionId is in req.params
 */
const isValidSessionModifier = async (req: Request, res: Response, next: NextFunction) => {
  const session = await SessionCollection.findOne(req.params.sessionId);
  const userId = session.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' sessions.'
    });
    return;
  }

  next();
};

export {
  isSessionPropertyComplete,
  isValidSessionContent,
  isSessionExists,
  isValidSessionModifier
};
