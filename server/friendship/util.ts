import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Friendship, PopulatedFriendship} from './model';

type response = {
  _id: string;
  userOne: string;
  userTwo: string;
  dateCreated: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
  * Transform a raw Friend object from the database into an object
  * with all the information needed by the frontend
  *
  * @param {HydratedDocument<Friendship>} friendship - A friendship object representing mutual friendship between 2 users
  * @returns {response} - The post object formatted for the frontend
  */
const constructResponse = (friendship: HydratedDocument<Friendship>): response => {
  const copy: PopulatedFriendship = {
    ...friendship.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  // Avoid mutation and aliasing
  const userOneName = copy.userOneId.username;
  const userTwoName = copy.userTwoId.username;
  delete copy.userOneId;
  delete copy.userTwoId;

  return {
    ...copy,
    _id: copy._id.toString(),
    userOne: userOneName,
    userTwo: userTwoName,
    dateCreated: formatDate(friendship.dateCreated)
  };
};

export {
  constructResponse
};

