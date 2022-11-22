import type{Post} from '../post/model';
import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in Endorse.
 */
export type Endorse = {
  _id: Types.ObjectId; // Id of this endorsement.
  endorserId: Types.ObjectId; // Different than endorsement ID
  endorsedPostId: Types.ObjectId;
  endorsedPostAuthorId: Types.ObjectId;
  dateEndorsed: Date;
};

export type PopulatedEndorse = {
  _id: Types.ObjectId; // Id of this endorsement.
  endorserId: User;
  endorsedPostId: Post;
  endorsedPostAuthorId: User;
  dateEndorsed: Date;
};

const EndorseSchema = new Schema({
  endorserId: {
    type: Schema.Types.ObjectId, // Use Types.ObjectId outside of the schema
    required: true,
    ref: 'User'
  },
  endorsedPostId: {
    type: Schema.Types.ObjectId, // Use Types.ObjectId outside of the schema
    required: true,
    ref: 'Post'
  },
  endorsedPostAuthorId: {
    type: Schema.Types.ObjectId, // Use Types.ObjectId outside of the schema
    required: true,
    ref: 'User'
  },
  dateEndorsed: {
    type: Date,
    required: true
  }
});

const EndorseModel = model<Endorse>('Endorse', EndorseSchema);
export default EndorseModel;
