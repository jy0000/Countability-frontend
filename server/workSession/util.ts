import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Session, PopulatedSession} from './model';

// Update this if you add a property to the Session type!
type SessionResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  content: string;
  dateModified: string;
  sessionType: string;
  sourceLink: string;
  emoji: string;
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
const constructWorkSessionResponse = (session: HydratedDocument<Session>): SessionResponse => {
  const sessionCopy: PopulatedSession = {
    ...session.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = sessionCopy.authorId;
  delete sessionCopy.authorId;
  return {
    ...sessionCopy,
    _id: sessionCopy._id.toString(),
    author: username,
    dateCreated: formatDate(session.dateCreated),
    dateModified: formatDate(session.dateModified),
    sessionType: sessionCopy.sessionType,
    // Defaults to empty string if the session type does not have this property.
    sourceLink: sessionCopy.sessionType === 'News' ? sessionCopy.sourceLink : '',
    emoji: sessionCopy.sessionType === 'Fibe' ? sessionCopy.emoji : ''
  };
};

export {
  constructSessionResponse
};
