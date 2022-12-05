import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import UserCollection from '../user/collection';
import FriendshipCollection from './collection';

import * as userValidator from '../user/middleware';
import * as friendshipValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Overview:
 * Get all friendships of the user
 * Add a friendship (when the user confirms a friend request)
 * Delete a friendship
 */

/**
 * Get all friendships of this user
 *
 * @name GET /api/friendship/
 * @throws {403} - If the user is not logged in
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    // Get current session user
    const userId = req.session.userId as string;

    const friendships = await FriendshipCollection.findAllFriendshipsOfUser(userId);
    const response = friendships.map(util.constructResponse);
    res.status(200).json({
      message: 'Your friends:',
      friendships: response
    });
  }
);

/**
 * Add a friendship
 *
 * @name POST /api/friendship/
 *
 * @param {string} friendReceiver - the user to receives this user's friend.
 * @return {FriendResponse} - The created friend
 * @throws {403} - Not logged-in
 * @throws {409} - Friendship already established, or friend request already made by user / or to user
 * @throws {404} - User to receive friend request does not exits.
 * @throws {405} - User friends themselvs
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    friendshipValidator.isFriendshipAlreadyExist
  ],
  async (req: Request, res: Response) => {
    const userOneId = (req.session.userId as string);
    const userTwo = await UserCollection.findOneByUsername(req.body.username);
    const newFriendship = await FriendshipCollection.addOne(userOneId, userTwo._id);
    res.status(201).json({
      message: 'Hooray, you have added this user as friend',
      friendships: util.constructResponse(newFriendship)
    });
  }
);

/**
 * Remove a friendship made
 *
 * @name DELETE /api/remove/:
 *
 * @return {string} - A success message
 * @throws {400} - Friendship doesn't already exist
 * @throws {403} - Not logged in
 */

router.delete(
  '/:friendshipId?',
  [
    userValidator.isUserLoggedIn,
    friendshipValidator.isFriendshipNotExist
  ],
  async (req: Request, res: Response) => {
    await FriendshipCollection.deleteOne(req.params.friendshipId);
    res.status(201).json({
      message: 'You unfriended this user.'
    });
  }
);

export {router as friendshipRouter};
