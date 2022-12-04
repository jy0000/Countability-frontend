import type {Request, Response} from 'express';
import express from 'express';
import PointCollection from './collection';
import UserCollection from '../user/collection';
import * as pointValidator from './middleware';
import * as userValidator from '../user/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get updated point
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
  async (req: Request, res: Response) => {
    const currentUserId = req.session.userId as string;
    const user = await UserCollection.findOneByUserId(currentUserId);

    const currentUserPoint = await PointCollection.findOne(user.point._id);
    const response = util.constructPointResponse(currentUserPoint);
    res.status(200).json({
      message: `Your current point is ${currentUserPoint.point}`,
      requestResponse: response
    });
  }
);

/**
 * Modify a point
 *
 * @name PATCH /api/points/:id
 *
 * @param {string} photo - the new photo for the point
 * @return {PointResponse} - the updated point
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the point
 * @throws {404} - If the pointId is not valid
 * @throws {400} - If the point photo is empty or a stream of empty spaces
 * @throws {413} - If the point photo is more than 140 characters long
 */
router.patch(
  '/',
  [
    userValidator.isUserLoggedIn,
    pointValidator.isPointExists,
    pointValidator.isValidPointModifier,
    pointValidator.isValidPointDelta
  ],
  async (req: Request, res: Response) => {
    const currentUserId = req.session.userId as string;
    const user = await UserCollection.findOneByUserId(currentUserId);
    const delta = (req.body.delta) ? Number(req.body.delta) : undefined;
    const point = await PointCollection.updateOne(user.point._id, delta);
    res.status(200).json({
      message: 'Your point was updated successfully.',
      point: util.constructPointResponse(point)
    });
  }
);
export {router as pointRouter};
