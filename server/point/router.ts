import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import PointCollection from './collection';
import UserCollection from '../user/collection';

import * as userValidator from '../user/middleware';
import * as util from './util';
import PostCollection from '../post/collection';

const router = express.Router();

/**
 * Get updated point based on post number.
 *
 * @name GET /api/point
 * @return {PointResponse} - The current user point
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

    const currentUserPoint = await PointCollection.updateOne(user.point, userPosts);
    const response = util.constructPointResponse(currentUserPoint);
    res.status(200).json({
      message: `Your current point is LEVEL ${currentUserPoint.point}`,
      requestResponse: response
    });
  }
);

export {router as pointRouter};
