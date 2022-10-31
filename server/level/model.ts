import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Level.
 */
export type Level = {
  _id: Types.ObjectId; // The id of this level
  level: number;
  username: string;
  privileges: Map<string, boolean>;
};

const LevelSchema = new Schema({
  // Current user level
  level: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  // User priviledges
  privileges: {
    type: Map,
    required: true
  }
});

const LevelModel = model<Level>('Level', LevelSchema);
export default LevelModel;
