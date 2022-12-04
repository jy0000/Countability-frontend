import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import PostCollection from './collection';
import * as userValidator from '../user/middleware';
import * as postValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the posts
 *
 * @name GET /api/posts
 *
 * @return {PostResponse[]} - A list of all the posts sorted in descending
 *                      order by date modified
 */

/**
 * Get posts by author.
 *
 * @name GET /api/posts?authorId=id
 *
 * @return {PostResponse[]} - An array of posts created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allPosts = await PostCollection.findAll();
    const response = allPosts.map(util.constructPostResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorPosts = await PostCollection.findAllByUsername(req.query.author as string);
    const response = authorPosts.map(util.constructPostResponse);
    res.status(200).json(response);
  }
);

/**
 * Get posts from friended users.
 *
 * @name GET /api/posts/friended
 *
 * @return {PostResponse[]} - An array of posts created by user with id, authorId
 *
 */
router.get(
  '/friended',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    const currentUserId = req.session.userId as string;
    const friendedUsersPosts = await PostCollection.findAllByUserFriends(currentUserId);
    const response = friendedUsersPosts.map(util.constructPostResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new post.
 *
 * @name POST /api/posts
 *
 * @param {string} photo - The photo of the post
 * @return {PostResponse} - The created post
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the post photo is empty or a stream of empty spaces
 * @throws {413} - If the post photo is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    postValidator.isValidPostContent,
    postValidator.isPostPropertyComplete
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const post = await PostCollection.addOne(userId, req.body.photo, req.body.caption, req.body.focusReflection, req.body.progressReflection);

    res.status(201).json({
      message: 'Your post was created successfully.',
      post: util.constructPostResponse(post)
    });
  }
);

/**
 * Delete a post
 *
 * @name DELETE /api/posts/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the post
 * @throws {404} - If the postId is not valid
 */
router.delete(
  '/:postId?',
  [
    userValidator.isUserLoggedIn,
    postValidator.isPostExists,
    postValidator.isValidPostModifier
  ],
  async (req: Request, res: Response) => {
    await PostCollection.deleteOne(req.params.postId);
    res.status(200).json({
      message: 'Your post was deleted successfully.'
    });
  }
);

/**
 * Modify a post
 *
 * @name PATCH /api/posts/:id
 *
 * @param {string} photo - the new photo for the post
 * @return {PostResponse} - the updated post
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the post
 * @throws {404} - If the postId is not valid
 * @throws {400} - If the post photo is empty or a stream of empty spaces
 * @throws {413} - If the post photo is more than 140 characters long
 */
router.patch(
  '/:postId?',
  [
    userValidator.isUserLoggedIn,
    postValidator.isPostExists,
    postValidator.isValidPostModifier,
    postValidator.isValidPostContent
  ],
  async (req: Request, res: Response) => {
    const post = await PostCollection.updateOne(req.params.postId, req.body.photo);
    res.status(200).json({
      message: 'Your post was updated successfully.',
      post: util.constructPostResponse(post)
    });
  }
);

export {router as postRouter};
