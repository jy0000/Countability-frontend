import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import PostCollection from '../post/collection';
import * as feedChannelValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the posts corresponding to the desired type.
 *
 * @name GET /api/feedChannel
 *
 * @return {PostResponse[]} - A list of all the posts sorted in descending
 *                      order by date modified
 * @throws {400} - If postType is not given
 * @throws {404} - If postType is not a valid post type
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.postType !== undefined) {
      next();
      return;
    }

    const allPosts = await PostCollection.findAllByPostType(req.query.postType as string);
    const response = allPosts.map(util.constructPostResponse);
    res.status(200).json(response);
  },
  [
    feedChannelValidator.isValidPostType
  ],
  async (req: Request, res: Response) => {
    const targetPosts = await PostCollection.findAllByPostType(req.query.postType as string);
    const response = targetPosts.map(util.constructPostResponse);
    res.status(200).json(response);
  }
);

export {router as feedChannelRouter};
