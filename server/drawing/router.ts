import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import DrawingCollection from './collection';
import * as userValidator from '../user/middleware';
import * as drawingValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the drawings
 *
 * @name GET /api/drawings
 *
 * @return {DrawingResponse[]} - A list of all the drawings sorted in descending
 *                      order by date modified
 */

/**
 * Get drawings by author.
 *
 * @name GET /api/drawings?authorId=id
 *
 * @return {DrawingResponse[]} - An array of drawings created by user with id, authorId
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

    const allDrawings = await DrawingCollection.findAll();
    const response = allDrawings.map(util.constructDrawingResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorDrawings = await DrawingCollection.findAllByUsername(req.query.author as string);
    const response = authorDrawings.map(util.constructDrawingResponse);
    res.status(200).json(response);
  }
);

/**
 * Get drawings from friended users.
 *
 * @name GET /api/drawings/friended
 *
 * @return {DrawingResponse[]} - An array of drawings created by user with id, authorId
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
    const friendedUsersDrawings = await DrawingCollection.findAllByFriendedUsers(currentUserId);
    const response = friendedUsersDrawings.map(util.constructDrawingResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new drawing.
 *
 * @name POST /api/drawings
 *
 * @param {string} photo - The photo of the drawing
 * @return {DrawingResponse} - The created drawing
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the drawing photo is empty or a stream of empty spaces
 * @throws {413} - If the drawing photo is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    drawingValidator.isValidDrawingContent,
    drawingValidator.isDrawingPropertyComplete
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const drawing = await DrawingCollection.addOne(userId, req.body.photo, req.body.caption, req.body.focusReflection, req.body.progressReflection);

    res.status(201).json({
      message: 'Your drawing was created successfully.',
      drawing: util.constructDrawingResponse(drawing)
    });
  }
);

/**
 * Delete a drawing
 *
 * @name DELETE /api/drawings/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the drawing
 * @throws {404} - If the drawingId is not valid
 */
router.delete(
  '/:drawingId?',
  [
    userValidator.isUserLoggedIn,
    drawingValidator.isDrawingExists,
    drawingValidator.isValidDrawingModifier
  ],
  async (req: Request, res: Response) => {
    await DrawingCollection.deleteOne(req.params.drawingId);
    res.status(200).json({
      message: 'Your drawing was deleted successfully.'
    });
  }
);

/**
 * Modify a drawing
 *
 * @name PATCH /api/drawings/:id
 *
 * @param {string} photo - the new photo for the drawing
 * @return {DrawingResponse} - the updated drawing
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the drawing
 * @throws {404} - If the drawingId is not valid
 * @throws {400} - If the drawing photo is empty or a stream of empty spaces
 * @throws {413} - If the drawing photo is more than 140 characters long
 */
router.patch(
  '/:drawingId?',
  [
    userValidator.isUserLoggedIn,
    drawingValidator.isDrawingExists,
    drawingValidator.isValidDrawingModifier,
    drawingValidator.isValidDrawingContent
  ],
  async (req: Request, res: Response) => {
    const drawing = await DrawingCollection.updateOne(req.params.drawingId, req.body.photo);
    res.status(200).json({
      message: 'Your drawing was updated successfully.',
      drawing: util.constructDrawingResponse(drawing)
    });
  }
);

export {router as drawingRouter};
