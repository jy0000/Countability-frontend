import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import SessionCollection from './collection';
import * as userValidator from '../user/middleware';
import * as sessionValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all sessions on the server.
 *
 * @name GET /api/sessions
 * @return {SessionResponse[]} - all sessions in descending order
 */

/**
 * Get all sessions by owner.
 *
 * @name GET /api/sessions?sessionOwnerId=id
 * @return {SessionResponse[]} - An array of sessions created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allSessions = await SessionCollection.findAll();
    const response = allSessions.map(util.constructSessionResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorSessions = await SessionCollection.findAllByUsername(req.query.author as string);
    const response = authorSessions.map(util.constructSessionResponse);
    res.status(200).json(response);
  }
);

/**
 * Get sessions from friended users.
 *
 * @name GET /api/sessions/friended
 *
 * @return {SessionResponse[]} - An array of sessions created by user with id, authorId
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
    const friendedUsersSessions = await SessionCollection.findAllByFriendedUsers(currentUserId);
    const response = friendedUsersSessions.map(util.constructSessionResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new session.
 *
 * @name POST /api/sessions
 *
 * @param {string} content - The content of the session
 * @return {SessionResponse} - The created session
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
    const session = await SessionCollection.addOne(userId, req.body.content, req.body.sessionType, req.body.sourceLink, req.body.emoji);

    res.status(201).json({
      message: 'Your session was created successfully.',
      session: util.constructSessionResponse(session)
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
    await SessionCollection.deleteOne(req.params.sessionId);
    res.status(200).json({
      message: 'Your session was deleted successfully.'
    });
  }
);

/**
 * Modify a session
 *
 * @name PATCH /api/sessions/:id
 *
 * @param {string} content - the new content for the session
 * @return {SessionResponse} - the updated session
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the session
 * @throws {404} - If the sessionId is not valid
 * @throws {400} - If the session content is empty or a stream of empty spaces
 * @throws {413} - If the session content is more than 140 characters long
 */
router.patch(
  '/:sessionId?',
  [
    userValidator.isUserLoggedIn,
    sessionValidator.isSessionExists,
    sessionValidator.isValidSessionModifier,
    sessionValidator.isValidSessionContent
  ],
  async (req: Request, res: Response) => {
    const session = await SessionCollection.updateOne(req.params.sessionId, req.body.content);
    res.status(200).json({
      message: 'Your session was updated successfully.',
      session: util.constructSessionResponse(session)
    });
  }
);

export {router as sessionRouter};
