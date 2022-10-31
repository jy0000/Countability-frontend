import type {HydratedDocument} from 'mongoose';
import type {Endorse, PopulatedEndorse} from './model';
import moment from 'moment';

type EndorseResponse = {
  _id: string;
  endorserUsername: string;
  endorsedFreetId: string;
  endorsedFreetAuthorName: string;
  dateEndorsed: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Endorse object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Endorse>} Endorse - A Endorse
 * @returns {EndorseResponse} - The freet object formatted for the frontend
 */
const constructEndorseResponse = (Endorse: HydratedDocument<Endorse>): EndorseResponse => {
  const EndorseCopy: PopulatedEndorse = {
    ...Endorse.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    _id: EndorseCopy._id.toString(),
    endorserUsername: EndorseCopy.endorserId.username,
    endorsedFreetId: EndorseCopy.endorsedFreetId._id.toString(),
    endorsedFreetAuthorName: EndorseCopy.endorsedFreetAuthorId.username,
    dateEndorsed: formatDate(Endorse.dateEndorsed)
  };
};

export {
  constructEndorseResponse
};
