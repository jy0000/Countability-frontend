import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import PointCollection from './collection';
import UserCollection from '../user/collection';

/**
 * Checks if a point with pointId is req.params exists
 */
const isPointExists = async (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  // const pointId = req.body.pointId === undefined ? req.params.pointId : req.body.pointId;
  // const validFormat = Types.ObjectId.isValid(pointId);
  // console.log(pointId);
  // const point = validFormat ? await PointCollection.findOne(pointId) : '';
  const currentUserId = req.session.userId as string;
  const user = await UserCollection.findOneByUserId(currentUserId);
  const point = await PointCollection.findOne(user.point._id);
  console.log('Point', point._id);
  if (!point) {
    res.status(404).json({
      error: `Point with username ${String(req.body.username)} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if point in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidPointDelta = async (req: Request, res: Response, next: NextFunction) => {
  const delta = Number(req.body.delta);
  const currentUserId = req.session.userId as string;
  const user = await UserCollection.findOneByUserId(currentUserId);
  const point = await PointCollection.findOne(user.point._id);
  if (point.point + delta < 0) {
    res.status(403).json({
      error: 'Cannot use more points than you have.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the point whose pointId is in req.params
 */
const isValidPointModifier = async (req: Request, res: Response, next: NextFunction) => {
  // Const {point} = await UserCollection.findOneByUsername(req.body.username);
  const currentUserId = req.session.userId as string;
  const user = await UserCollection.findOneByUserId(currentUserId);
  const point = await PointCollection.findOne(user.point._id);
  const userId = (await UserCollection.findOneByUsername(point.username))._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' points.'
    });
    return;
  }

  next();
};

export {
  isPointExists,
  isValidPointDelta,
  isValidPointModifier
};
