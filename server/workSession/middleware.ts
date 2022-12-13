import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import WorkSessionCollection from './collection';
import UserCollection from '../user/collection';

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
  const session = validFormat ? await WorkSessionCollection.findOne(sessionId) : '';
  if (!session) {
    res.status(404).json({
      error: `Session with session ID ${req.params.sessionId} does not exist.`
    });
    return;
  }

  next();
};

const isSessionOwnerExists = async (req: Request, res: Response, next: NextFunction) => {
  const username = req.params.sessionOwner;
  const user = await UserCollection.findOneByUsername(username);
  if (user) {
    next();
  } else {
    res.status(401).json({error: 'Username does not exist.'});
  }
};

/**
 * Checks if the provided numChecks is valid
 */
const isValidSessionNumChecks = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.numChecks as number < 0) {
    res.status(400).json({
      error: 'Number of checks must be a nonnegative integer.'
    });
    return;
  }

  next();
};

/**
 * Checks if the provided numChecks is valid
 */
 const isValidSessionCheckFreq = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.checkFreq as number <= 0) {
    res.status(400).json({
      error: 'Check frequency must be a positive integer.'
    });
    return;
  }

  next();
};

/**
 * Checks if logged in user is already in a session
 */
const isAlreadyInSession = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUserId(req.session.userId);
  const sessions = await WorkSessionCollection.findAllByUsername(user.username);
  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i];
    if (!session.endDate) {
      res.status(409).json({
        error: 'User can only be in one session at a time.'
      });
      return;
    }
  }

  next();
};

/**
 * Checks if logged in user is not in a session
 */
const isNotInSession = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUserId(req.session.userId);
  const sessions = await WorkSessionCollection.findAllByUsername(user.username);
  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i];
    if (!session.endDate) {
      next();
      return;
    }
  }

  res.status(409).json({
    error: 'User is currently not in a session.'
  });
};

/**
 * Checks if the current user is the owner of the session whose sessionId is in req.params
 */
const isValidSessionModifier = async (req: Request, res: Response, next: NextFunction) => {
  const session = await WorkSessionCollection.findOne(req.params.sessionId);
  const userId = session.sessionOwnerId._id;
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
  isSessionOwnerExists,
  isSessionExists,
  isValidSessionModifier,
  isValidSessionNumChecks,
  isValidSessionCheckFreq,
  isAlreadyInSession,
  isNotInSession
};
