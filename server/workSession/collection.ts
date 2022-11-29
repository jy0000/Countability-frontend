import type {HydratedDocument, Types} from 'mongoose';
import type {WorkSession} from './model';
import WorkSessionModel from './model';
import UserCollection from '../user/collection';

/**
 * A collection class representing a work session for a user.
 */
class WorkSessionCollection {
    /** Operations:
   *  addOne - Add a WorkSession to the collection
   *  findOne - Find a work session by session ID
   *  findAll - Get all work sessions 
   *  findAllByUsername - Get all work sessions in by given username
   *  deleteOne - Delete a work session with the given WorkSessionId.
   *  deleteAllByOwnerId - Delete all the work sessions by the given owner
   */

  /**
   * Add a WorkSession to the collection
   *
   * @param {string} authorId - The id of the author of the WorkSession
   * @param {string} content - The id of the content of the WorkSession
   * @return {Promise<HydratedDocument<WorkSession>>} - The newly created WorkSession
   */
  static async addOne(
    sessionOwnerId: Types.ObjectId | string,
    numChecks: number
  ): Promise<HydratedDocument<WorkSession>> {
    const startDate = new Date();
    const newWorkSession = new WorkSessionModel({
      startDate,
      sessionOwnerId,
      numChecks,
      checks: []
    });
    await newWorkSession.save();
    return newWorkSession.populate('startDate');
  }

  /**
   * Find a work session by session ID
   *
   * @param {string} workSessionId - The id of the WorkSession to find
   * @return {Promise<HydratedDocument<WorkSession>> | Promise<null> } - The WorkSession with the given WorkSessionId, if any
   */
  static async findOne(workSessionId: Types.ObjectId | string): Promise<HydratedDocument<WorkSession>> {
    return WorkSessionModel.findOne({_id: workSessionId}).populate('startDate');
  }

  /**
   * Get all work sessions in the database
   *
   * @return {Promise<HydratedDocument<WorkSession>[]>} - An array of all of the WorkSessions
   */
  static async findAll(): Promise<Array<HydratedDocument<WorkSession>>> {
    // Retrieves WorkSessions and sorts them from most to least recent
    return WorkSessionModel.find({}).sort({startDate: -1}).populate('startDate');
  }

  /**
   * Get all work sessions in by given username
   *
   * @param {string} username - The username of owner of the WorkSessions
   * @return {Promise<HydratedDocument<WorkSession>[]>} - An array of all of the WorkSessions
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<WorkSession>>> {
    const owner = await UserCollection.findOneByUsername(username);
    return WorkSessionModel.find({sessionOwnerId: owner._id}).sort({startDate: -1}).populate('startDate');
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
}

export default WorkSessionCollection;
