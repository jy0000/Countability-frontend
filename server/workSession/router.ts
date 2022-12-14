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
router.get(
  '/',
  async (req: Request, res: Response) => {
    const ownerSessions = await WorkSessionCollection.findAll();
    const response = ownerSessions.map(util.constructWorkSessionResponse);
    res.status(200).json(response);
  }
);

/**
 * Get all work sessions of a specific user.
 *
 * @name GET /api/sessions/:sessionOwner?
 * @return {WorkSessionResponse[]} - An array of sessions created by sessionOwner
 * @throws {404} - If no user has username sessionOwner
 */
router.get(
  '/:sessionOwner?',
  [
    sessionValidator.isSessionOwnerExists
  ],
  async (req: Request, res: Response) => {
    // Check if sessionOwner parameter was supplied
    const owner = req.params.sessionOwner;
    const ownerSessions = await WorkSessionCollection.findAllByUsername(owner);
    const response = ownerSessions.map(util.constructWorkSessionResponse);
    res.status(200).json(response);
  }
);

/**
 * Get a work session with a specific sessionId.
 *
 * @name GET /api/sessions/:sessionId?
 * @return {WorkSessionResponse} - A work session with the id provided
 * @throws {404} - If no session has id sessionId
 */
router.get(
  '/:sessionId?',
  [
    sessionValidator.isSessionExists
  ],
  async (req: Request, res: Response) => {
    // Check if sessionId parameter was supplied
    const id = req.params.sessionId;
    const session = await WorkSessionCollection.findOne(id);
    const response = util.constructWorkSessionResponse(session);
    res.status(200).json(response);
  }
);

/**
 * Create a new session.
 *
 * @name POST /api/sessions
 *
 * @param {number} numChecks - the number of checks administered to the owner of the session
 * @return {WorkSessionResponse} - The created session
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the numChecks given is not a valid nonnegative integer
 * @throws {409} - If the user has already started a session
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    sessionValidator.isValidSessionNumChecks,
    sessionValidator.isValidSessionCheckFreq,
    sessionValidator.isAlreadyInSession
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const session = await WorkSessionCollection.addOne(userId, req.body.numChecks, req.body.checkFreq);

    res.status(201).json({
      message: 'Your session was created successfully.',
      session: util.constructWorkSessionResponse(session)
    });
  }
);

/**
 * Add a new session check image.
 *
 * @name PATCH /api/sessions/check
 *
 * @throws {403} - If the user is not logged in
 * @throws {409} - If the user is not in a session
 */
router.patch(
  '/check',
  [
    userValidator.isUserLoggedIn,
    sessionValidator.isNotInSession
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const session = await WorkSessionCollection.checkOneByUser(userId, req.body.check);

    res.status(201).json({
      message: 'Successfully uploaded photo check.',
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
 * @throws {404} - If the sessionId is not valid
 */
router.delete(
  '/:sessionId?',
  [
    sessionValidator.isSessionExists
  ],
  async (req: Request, res: Response) => {
    await WorkSessionCollection.deleteOne(req.params.sessionId);
    res.status(200).json({
      message: 'Your session was deleted successfully.'
    });
  }
);

/**
 * End the current session for the user
 *
 * @name POST /api/sessions/end
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the owner of
 *                 the session
 * @throws {404} - If the sessionId is not valid
 * @throws {409} - If the user has already started a session
 */
router.post(
  '/end',
  [
    userValidator.isUserLoggedIn,
    sessionValidator.isNotInSession
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const session = await WorkSessionCollection.endOneByUser(userId, req.body.caption);
    res.status(200).json({
      message: 'Your session was ended successfully.',
      session: util.constructWorkSessionResponse(session)
    });
  }
);

export {router as sessionRouter};
