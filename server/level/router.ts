import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import LevelCollection from './collection';
import UserCollection from '../user/collection';

import * as userValidator from '../user/middleware';
import * as util from './util';
import PostCollection from '../post/collection';

const router = express.Router();

/**
 * Get updated level based on post number.
 *
 * @name GET /api/level
 * @return {LevelResponse} - The current user level
 * @throws {403} - - If the user is not logged in
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUserId = req.session.userId as string;
    const user = await UserCollection.findOneByUserId(currentUserId);
    const userPosts = await PostCollection.findAllByUsername(user.username);

    const currentUserLevel = await LevelCollection.updateOne(user.level, userPosts);
    const response = util.constructLevelResponse(currentUserLevel);
    res.status(200).json({
      message: `Your current level is LEVEL ${currentUserLevel.level}`,
      requestResponse: response
    });
  }
);

export {router as levelRouter};
