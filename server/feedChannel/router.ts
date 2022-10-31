import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import * as feedChannelValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the freets corresponding to the desired type.
 *
 * @name GET /api/feedChannel
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 * @throws {400} - If freetType is not given
 * @throws {404} - If freetType is not a valid freet type
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.freetType !== undefined) {
      next();
      return;
    }

    const allFreets = await FreetCollection.findAllByFreetType(req.query.freetType as string);
    const response = allFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  },
  [
    feedChannelValidator.isValidFreetType
  ],
  async (req: Request, res: Response) => {
    const targetFreets = await FreetCollection.findAllByFreetType(req.query.freetType as string);
    const response = targetFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  }
);

export {router as feedChannelRouter};
