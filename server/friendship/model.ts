import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * A model representing a mutual friendship between user A and user B
 */

export type Friendship = {
  _id: Types.ObjectId;
  userOneId: Types.ObjectId;
  userTwoId: Types.ObjectId;
  dateCreated: Date;
};

export type PopulatedFriendship = {
  _id: Types.ObjectId;
  userOneId: User;
  userTwoId: User;
  dateCreated: Date;
};

const FriendshipSchema = new Schema<Friendship>({
  userOneId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  userTwoId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  dateCreated: {
    type: Date,
    required: true
  }
});

const FriendshipModel = model<Friendship>('Friendship', FriendshipSchema);
export default FriendshipModel;
