import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Point.
 */
export type Point = {
  _id: Types.ObjectId; // The id of this point
  point: number;
  username: string;
  privileges: Map<string, boolean>;
};

const PointSchema = new Schema({
  // Current user point
  point: {
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

const PointModel = model<Point>('Point', PointSchema);
export default PointModel;
