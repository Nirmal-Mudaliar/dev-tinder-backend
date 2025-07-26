const { type } = require("express/lib/response");
const { default: mongoose } = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: String,
    },
    toUserId: {
      type: String,
    },
    status: {
      type: String,
      enum: {
        values: ['accepted', 'rejected', 'ignored', 'interested'],
        message: `{VALUE} is incorrect status type`,
      }
    }
  },
  {
    timestamps: true
  }
);

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = {
  ConnectionRequest,
}