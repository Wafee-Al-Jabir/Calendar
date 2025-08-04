import { Schema, models, model } from "mongoose"

const EventSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  color: {
    type: String,
    default: "bg-blue-500", // Default color if not provided
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
  attendees: {
    type: [String],
    default: [],
  },
  organizer: {
    type: String,
  },
})

const Event = models.Event || model("Event", EventSchema)

export default Event
