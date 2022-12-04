import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import WorkSessionCollection from './collection';
import * as userValidator from '../user/middleware';
import * as sessionValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all work sessions on the server.
 *
 * @name GET /api/sessions
 * @return {WorkSessionResponse[]} - all sessions in descending order
 */

/**
 * Get all work sessions of a specific user.
 *
 * @name GET /api/sessions?username
 * @return {WorkSessionResponse[]} - An array of sessions created by sessionOwner
 * @throws {400} - If userId is not given
 * @throws {404} - If no user has given userId
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.sessionOwner !== undefined) {
      next();
      return;
    }

    const userWorkSessions = await WorkSessionCollection.findAllByUsername(req.query.sessionOwner as string);
    const response = userWorkSessions.map(util.constructWorkSessionResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorSessions = await WorkSessionCollection.findAllByUsername(req.query.author as string);
    const response = authorSessions.map(util.constructWorkSessionResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new session.
 *
 * @name POST /api/sessions
 *
 * @param {string} content - The content of the session
 * @return {WorkSessionResponse} - The created session
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the session content is empty or a stream of empty spaces
 * @throws {413} - If the session content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    sessionValidator.isValidSessionContent,
    sessionValidator.isSessionPropertyComplete
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const session = await WorkSessionCollection.addOne(userId, req.body.numChecks);

    res.status(201).json({
      message: 'Your session was created successfully.',
      session: util.constructWorkSessionResponse(session)
    });
  }
);

/**
 * Delete a session
 *
 * @name DELETE /api/sessions/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the session
 * @throws {404} - If the sessionId is not valid
 */
router.delete(
  '/:sessionId?',
  [
    userValidator.isUserLoggedIn,
    sessionValidator.isSessionExists,
    sessionValidator.isValidSessionModifier
  ],
  async (req: Request, res: Response) => {
    await WorkSessionCollection.deleteOne(req.params.sessionId);
    res.status(200).json({
      message: 'Your session was deleted successfully.'
    });
  }
);

export {router as sessionRouter};
