import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import LevelCollection from '../level/collection';
import UserCollection from '../user/collection';

import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';

import * as util from './util';
import FreetCollection from '../freet/collection';
import EndorseCollection from './collection';
import * as endorseValidator from './middleware';
import TrustCollection from '../trust/collection';

const router = express.Router();

/**
 * Check endorsement priviledge.
 *
 * @name GET /api/endorse/isAllowed
 * @return {EndorseResponse} - endorsement response
 * @throws {403} - - If the user is not logged in
 */
router.get(
  '/isAllowed',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    // Get endorser, freet to endorse
    const currentUserId = req.session.userId as string;
    const currentUser = await UserCollection.findOneByUserId(currentUserId);
    const currentLevel = await LevelCollection.findOne(currentUser.level);

    // Make endorsement
    const canEndorse = currentLevel.privileges.get('canEndorse');
    res.status(200).json({
      privilege_access: canEndorse
      // Weird bug here with canEndorse appearing to work but var evaluation is not right.
    });
  }
);

/**
 * Check the user's endorsed freets
 *
 * @name GET /api/endorse/isAllowed
 * @return {EndorseResponse} - endorsement response
 * @throws {403} - - If the user is not logged in
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    // Get endorser, freet to endorse
    const currentUserId = req.session.userId as string;
    const currentUser = await UserCollection.findOneByUserId(currentUserId);
    const allEndorsedFreets = await EndorseCollection.findAllByUsername(currentUser.username);
    const response = allEndorsedFreets.map(util.constructEndorseResponse);
    res.status(200).json({
      message: 'Freets you endorsed:',
      response
    });
  }
);

/**
 * Check endorsement priviledge.
 *
 * @name GET /api/endorse/isAllowed
 * @return {EndorseResponse} - endorsement response
 * @throws {403} - - If the user is not logged in
 */
router.get(
  '/fromTrusted',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    // Get endorser, freet to endorse
    const currentUserId = req.session.userId as string;
    const currentUser = await UserCollection.findOneByUserId(currentUserId);
    const allEndorsedFreets = await EndorseCollection.findAllByTrustedUsers(currentUserId);
    const response = allEndorsedFreets.map(util.constructEndorseResponse);
    res.status(200).json({
      message: 'Freets your trusted friends endorsed:',
      response
    });
  }
);

/**
 * Create an endorsement.
 *
 * @name POST /api/endorse
 * @return {EndorseResponse} - endorsement response
 * @throws {403} - - If the user is not logged in
 * @throws {409} - - Internal state conflict from invalid inputs
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    endorseValidator.isEndorseExist,
    endorseValidator.canUserEndorse,
    endorseValidator.isEndorseSelf
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    // Get endorser, freet to endorse
    const currentUserId = req.session.userId as string;
    const freetToEndorse = await FreetCollection.findOne(req.body.freetId);
    const freetToEndorseAuthorId = freetToEndorse.authorId;

    if (freetToEndorse.freetType !== 'News') {
      res.status(409).json({
        error: {
          message: 'Can only endorse News freets.'
        }
      });
      return;
    }

    // Make endorsement
    const endorsement = await EndorseCollection.addOne(currentUserId, req.body.freetId, freetToEndorseAuthorId);
    const response = util.constructEndorseResponse(endorsement);
    res.status(200).json({
      message: `Awesome, you endorsed post ID: ${freetToEndorse._id.toString()}`,
      requestResponse: response
    });
  }
);

/**
 * Remove an endorsement
 *
 * @name DELETE /api/remove/:id
 *
 * @return {string} - A success message
 * @throws {400} - Trust doesn't already exist
 * @throws {403} - Not logged in
 */

router.delete(
  '/:endorseId?',
  [
    userValidator.isUserLoggedIn,
    endorseValidator.isEndorseNotExist
  ],
  async (req: Request, res: Response) => {
    await EndorseCollection.deleteOne(req.body.freetId, req.session.userId);
    res.status(201).json({
      message: 'Success. You removed your endorsement for this freet.'
    });
  }
);

export {router as endorseRouter};
