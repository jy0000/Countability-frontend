import type {HydratedDocument, Types} from 'mongoose';
import type {WorkSession} from './model';
import WorkSessionModel from './model';
import UserCollection from '../user/collection';
import PostCollection from '../post/collection';

/**
 * A collection class representing a work session for a user.
 */
class WorkSessionCollection {
  /**
   * Add a WorkSession to the collection
   *
   * @param {string} sessionOwnerId - The id of the owner of the WorkSession
   * @return {Promise<HydratedDocument<WorkSession>>} - The newly created WorkSession
   */
  static async addOne(
    sessionOwnerId: Types.ObjectId | string,
    numChecks: number, checkFreq: number
  ): Promise<HydratedDocument<WorkSession>> {
    const startDate = new Date();
    const newWorkSession = new WorkSessionModel({
      startDate,
      sessionOwnerId,
      numChecks,
      checks: [],
      checkFreq
    });
    await newWorkSession.save();
    return newWorkSession.populate('sessionOwnerId');
  }

  /**
   * Find a work session by session ID
   *
   * @param {string} workSessionId - The id of the WorkSession to find
   * @return {Promise<HydratedDocument<WorkSession>> | Promise<null> } - The WorkSession with the given WorkSessionId, if any
   */
  static async findOne(workSessionId: Types.ObjectId | string): Promise<HydratedDocument<WorkSession>> {
    return WorkSessionModel.findOne({_id: workSessionId}).populate('sessionOwnerId');
  }

  /**
   * Get all work sessions in the database
   *
   * @return {Promise<HydratedDocument<WorkSession>[]>} - An array of all of the WorkSessions
   */
  static async findAll(): Promise<Array<HydratedDocument<WorkSession>>> {
    // Retrieves WorkSessions and sorts them from most to least recent
    return WorkSessionModel.find({}).sort({startDate: -1}).populate('sessionOwnerId');
  }

  /**
   * Get all work sessions in by given username
   *
   * @param {string} username - The username of owner of the WorkSessions
   * @return {Promise<HydratedDocument<WorkSession>[]>} - An array of all of the WorkSessions
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<WorkSession>>> {
    const owner = await UserCollection.findOneByUsername(username);
    return WorkSessionModel.find({sessionOwnerId: owner._id}).sort({startDate: -1}).populate('sessionOwnerId');
  }

  /**
   * Delete a work session with the given WorkSessionId.
   *
   * @param {string} workSessionId - The WorkSessionId of WorkSession to delete
   * @return {Promise<Boolean>} - true if the WorkSession has been deleted, false otherwise
   */
  static async deleteOne(workSessionId: Types.ObjectId | string): Promise<boolean> {
    const workSession = await WorkSessionModel.deleteOne({_id: workSessionId});
    return workSession !== null;
  }

  /**
   * Delete all the work sessions by the given owner
   *
   * @param {string} sessionOwnerId - The id of the owner of the work sessions
   */
  static async deleteAllByOwnerId(sessionOwnerId: Types.ObjectId | string): Promise<void> {
    await WorkSessionModel.deleteMany({sessionOwnerId});
  }

  /**
   * End a work session with the given WorkSessionId.
   *
   * @param {string} workSessionId - The WorkSessionId of WorkSession to end
   * @return {Promise<HydratedDocument<WorkSession>>} - updated workSession
   */
  static async endOne(workSessionId: Types.ObjectId | string, caption: string, progressReflection: string, focusReflection: string, photo: string): Promise<HydratedDocument<WorkSession>> {
    const workSession = await WorkSessionModel.findOne({_id: workSessionId});
    const endDate = new Date();
    workSession.endDate = endDate;
    await PostCollection.addOne(workSession.sessionOwnerId, photo, caption, focusReflection, progressReflection);
    await workSession.save();
    return workSession.populate('sessionOwnerId');
  }

  /**
   * End a work session for a specific owner.
   *
   * @param {string} userId - The owner id of WorkSession to end
   * @return {Promise<HydratedDocument<WorkSession>>} - updated workSession
   */
  static async endOneByUser(userId: Types.ObjectId | string): Promise<HydratedDocument<WorkSession>> {
    console.log('IN ENDONEBYUSER 1');
    const workSession = await WorkSessionModel.findOne({sessionOwnerId: userId, endDate: undefined});
    const endDate = new Date();
    workSession.endDate = endDate;
    console.log("IN ENDONEBYUSER ", caption, progressReflection, focusReflection);
    //await PostCollection.addOneSession(workSession.sessionOwnerId, caption, progressReflection, focusReflection, photos);
    await workSession.save();
    return workSession.populate('sessionOwnerId');
  }

  /**
   * Add a check to a work session with the given WorkSessionId.
   *
   * @param {string} workSessionId - The WorkSessionId of WorkSession to check
   * @return {Promise<HydratedDocument<WorkSession>>} - updated workSession
   */
  static async checkOne(workSessionId: Types.ObjectId | string, check: string): Promise<HydratedDocument<WorkSession>> {
    const workSession = await WorkSessionModel.findOne({_id: workSessionId});
    workSession.checks.push(check);
    await workSession.save();
    return workSession.populate('sessionOwnerId');
  }

  /**
   * Add a check to a work session with the given WorkSessionId.
   *
   * @param {string} userId - The owner id of WorkSession to check
   * @return {Promise<HydratedDocument<WorkSession>>} - updated workSession
   */
  static async checkOneByUser(userId: Types.ObjectId | string, check: string): Promise<HydratedDocument<WorkSession>> {
    const workSession = await WorkSessionModel.findOne({sessionOwnerId: userId, endDate: undefined});
    workSession.checks.push(check);
    await workSession.save();
    return workSession.populate('sessionOwnerId');
  }

  /**
   * Update a work session with the given WorkSessionId.
   *
   * @param {string} workSessionId - The WorkSessionId of WorkSession to
   * @return {Promise<HydratedDocument<WorkSession>>} - updated workSession
   */
  static async updateOne(workSessionId: Types.ObjectId | string, sessionDetails: {numChecks: number; checks: string[]}): Promise<HydratedDocument<WorkSession>> {
    // TODO: finish function
    const workSession = await WorkSessionModel.findOne({_id: workSessionId});
    const endDate = new Date();
    workSession.endDate = endDate;
    return workSession.populate('sessionOwnerId');
  }
}

export default WorkSessionCollection;
