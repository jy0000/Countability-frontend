import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {WorkSession, PopulatedWorkSession} from './model';

type WorkSessionResponse = {
  _id: string;
  startDate: string;
  endDate: string;
  sessionOwner: string;
  numChecks: number;
  checks: string[];
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Session object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Session>} session - A session
 * @returns {SessionResponse} - The session object formatted for the frontend
 */
const constructWorkSessionResponse = (session: HydratedDocument<WorkSession>): WorkSessionResponse => {
  const sessionCopy: PopulatedWorkSession = {
    sessionOwner: session.sessionOwnerId,
    ...session.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  // Make copies to avoid mutation
  const sessionOwnerUsername = sessionCopy.sessionOwner.username;
  const toReturn =  {
    _id: sessionCopy._id.toString(),
    startDate: formatDate(session.startDate),
    endDate: formatDate(session.endDate),
    sessionOwner: sessionOwnerUsername,
    numChecks: sessionCopy.numChecks,
    checks: sessionCopy.checks,
    checkFreq: 300000
  };
  if (!sessionCopy.endDate) {
    delete toReturn.endDate;
  }
  if (sessionCopy.checkFreq) {
    toReturn.checkFreq = sessionCopy.checkFreq;
  }
  return toReturn;
};

export {
  constructWorkSessionResponse
};
