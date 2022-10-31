import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Trust, PopulatedTrust} from './model';

type TrustResponse = {
  _id: string;
  trustGiver: string;
  trustReceiver: string;
  dateTrusted: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Trust object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Trust>} trust - A trust
 * @returns {TrustResponse} - The freet object formatted for the frontend
 */
const constructTrustResponse = (trust: HydratedDocument<Trust>): TrustResponse => {
  const trustCopy: PopulatedTrust = {
    ...trust.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const trustGiverUsername = trustCopy.trustGiverId.username;
  const trustReceiverUsername = trustCopy.trustReceiverId.username;
  delete trustCopy.trustGiverId;
  delete trustCopy.trustReceiverId;
  return {
    ...trustCopy,
    _id: trustCopy._id.toString(),
    trustGiver: trustGiverUsername,
    trustReceiver: trustReceiverUsername, // Actual response include human-readable info
    dateTrusted: formatDate(trust.dateTrusted)
  };
};

export {
  constructTrustResponse
};
