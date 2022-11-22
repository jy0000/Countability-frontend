import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import PointCollection from '../point/collection';
import UserCollection from '../user/collection';

import * as userValidator from '../user/middleware';
import * as postValidator from '../post/middleware';

import * as util from './util';
import PostCollection from '../post/collection';
import EndorseCollection from './collection';
import * as endorseValidator from './middleware';
import FriendCollection from '../friend/collection';

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
    // Get endorser, post to endorse
    const currentUserId = req.session.userId as string;
    const currentUser = await UserCollection.findOneByUserId(currentUserId);
    const currentPoint = await PointCollection.findOne(currentUser.point);

    // Make endorsement
    const canEndorse = currentPoint.privileges.get('canEndorse');
    res.status(200).json({
      privilege_access: canEndorse
      // Weird bug here with canEndorse appearing to work but var evaluation is not right.
    });
  }
);

/**
 * Check the user's endorsed posts
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
    // Get endorser, post to endorse
    const currentUserId = req.session.userId as string;
    const currentUser = await UserCollection.findOneByUserId(currentUserId);
    const allEndorsedPosts = await EndorseCollection.findAllByUsername(currentUser.username);
    const response = allEndorsedPosts.map(util.constructEndorseResponse);
    res.status(200).json({
      message: 'Posts you endorsed:',
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
  '/fromFriended',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    // Get endorser, post to endorse
    const currentUserId = req.session.userId as string;
    const currentUser = await UserCollection.findOneByUserId(currentUserId);
    const allEndorsedPosts = await EndorseCollection.findAllByFriendedUsers(currentUserId);
    const response = allEndorsedPosts.map(util.constructEndorseResponse);
    res.status(200).json({
      message: 'Posts your friended friends endorsed:',
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
    postValidator.isPostExists,
    endorseValidator.isEndorseExist,
    endorseValidator.canUserEndorse,
    endorseValidator.isEndorseSelf
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    // Get endorser, post to endorse
    const currentUserId = req.session.userId as string;
    const postToEndorse = await PostCollection.findOne(req.body.postId);
    const postToEndorseAuthorId = postToEndorse.authorId;

    if (postToEndorse.postType !== 'News') {
      res.status(409).json({
        error: {
          message: 'Can only endorse News posts.'
        }
      });
      return;
    }

    // Make endorsement
    const endorsement = await EndorseCollection.addOne(currentUserId, req.body.postId, postToEndorseAuthorId);
    const response = util.constructEndorseResponse(endorsement);
    res.status(200).json({
      message: `Awesome, you endorsed post ID: ${postToEndorse._id.toString()}`,
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
 * @throws {400} - Friend doesn't already exist
 * @throws {403} - Not logged in
 */

router.delete(
  '/:endorseId?',
  [
    userValidator.isUserLoggedIn,
    endorseValidator.isEndorseNotExist
  ],
  async (req: Request, res: Response) => {
    await EndorseCollection.deleteOne(req.body.postId, req.session.userId);
    res.status(201).json({
      message: 'Success. You removed your endorsement for this post.'
    });
  }
);

export {router as endorseRouter};
