import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import UserCollection from '../user/collection';
import TrustCollection from './collection';

import * as userValidator from '../user/middleware';
import * as trustValidator from '../trust/middleware';
import * as util from './util';
import PointCollection from '..//point/collection';

const router = express.Router();

/**
 * Get everyone who is trusted by the user.
 *
 * @name GET /api/trust
 *
 * @return {TrustResponse[]} - An array of trusts.
 */
router.get(
  '/:view?',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId as string;
    const user = await UserCollection.findOneByUserId(userId);
    // Display message to clarify who is the current user.
    const msgPrefix = `You (username: ${user.username})`;
    const msg = req.query.view === 'Users you trust' ? `${msgPrefix} have trusted:` : `${msgPrefix} are trusted by:`;
    const trust = req.query.view === 'Users who trust you' ? await TrustCollection.findAllTrustReceivedById(userId) : await TrustCollection.findAllTrustGivenById(userId);
    const response = trust.map(util.constructTrustResponse);
    res.status(200).json({
      message: msg,
      trustedUsers: response
    });
  }
);

/**
 * Create a new trust.
 *
 * @name POST /api/trust/
 *
 * @param {string} trustReceiver - the user to receives this user's trust.
 * @return {TrustResponse} - The created trust
 * @throws {409} - Trust already established
 * @throws {403} - Not logged-in
 * @throws {404} - User to receive trust not exits.
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    trustValidator.isTrustReceiverExist,
    trustValidator.isTrustAlreadyExist,
    trustValidator.isTrustSelf
  ],
  async (req: Request, res: Response) => {
    const trustGiverId = (req.session.userId as string);
    const trustReceiver = await UserCollection.findOneByUsername(req.body.username);
    const newTrust = await TrustCollection.addOne(trustGiverId, trustReceiver._id);
    res.status(201).json({
      message: 'Hooray, you added this user as your trusted friend.',
      trust: util.constructTrustResponse(newTrust)
    });
    // DELETE EVERYTHING ADDED because there was a bug about dangling removed object
    // await TrustCollection.deleteEverything();
  }
);

/**
 * Remove a trust
 *
 * @name DELETE /api/remove/:id
 *
 * @return {string} - A success message
 * @throws {400} - Trust doesn't already exist
 * @throws {403} - Not logged in
 * @throws {404} - User does not exist
 */

router.delete(
  '/:username?',
  [
    userValidator.isUserLoggedIn,
    trustValidator.isTrustReceiverExist,
    trustValidator.isTrustNotExist
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string);
    const trustedUser = await UserCollection.findOneByUsername(req.params.username);
    await TrustCollection.untrustOneById(userId, trustedUser._id); // Delete trust
    res.status(201).json({
      message: 'You removed your trust for the user.'
    });
    await PointCollection.deleteEverything();
  }
);

export {router as trustRouter};
