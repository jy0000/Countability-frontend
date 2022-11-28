import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Drawing, PopulatedDrawing} from './model';

// Update this if you add a property to the Drawing type!
type DrawingResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  photo: string;
  dateModified: string;
  caption: string;
  focusReflection: string;
  progressReflection: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Drawing object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Drawing>} drawing - A drawing
 * @returns {DrawingResponse} - The drawing object formatted for the frontend
 */
const constructDrawingResponse = (drawing: HydratedDocument<Drawing>): DrawingResponse => {
  const drawingCopy: PopulatedDrawing = {
    ...drawing.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = drawingCopy.authorId;
  delete drawingCopy.authorId;
  return {
    ...drawingCopy,
    _id: drawingCopy._id.toString(),
    author: username,
    dateCreated: formatDate(drawing.dateCreated),
    dateModified: formatDate(drawing.dateModified),
    caption: drawingCopy.caption,
    // Defaults to empty string if the drawing type does not have this property.
    focusReflection: drawingCopy.caption === 'News' ? drawingCopy.focusReflection : '',
    progressReflection: drawingCopy.caption === 'Fibe' ? drawingCopy.progressReflection : ''
  };
};

export {
  constructDrawingResponse
};
