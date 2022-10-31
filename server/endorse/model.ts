import type{Freet} from '../freet/model';
import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in Endorse.
 */
export type Endorse = {
  _id: Types.ObjectId; // Id of this endorsement.
  endorserId: Types.ObjectId; // Different than endorsement ID
  endorsedFreetId: Types.ObjectId;
  endorsedFreetAuthorId: Types.ObjectId;
  dateEndorsed: Date;
};

export type PopulatedEndorse = {
  _id: Types.ObjectId; // Id of this endorsement.
  endorserId: User;
  endorsedFreetId: Freet;
  endorsedFreetAuthorId: User;
  dateEndorsed: Date;
};

const EndorseSchema = new Schema({
  endorserId: {
    type: Schema.Types.ObjectId, // Use Types.ObjectId outside of the schema
    required: true,
    ref: 'User'
  },
  endorsedFreetId: {
    type: Schema.Types.ObjectId, // Use Types.ObjectId outside of the schema
    required: true,
    ref: 'Freet'
  },
  endorsedFreetAuthorId: {
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
