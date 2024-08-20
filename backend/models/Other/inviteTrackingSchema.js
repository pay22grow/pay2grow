const mongoose = require("mongoose");

const inviteTrackingSchema = new mongoose.Schema(
  {
    uniqueInvitationCode: { type: String, required: true, unique: true },
    invitationCodeOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: "UserDetails", required: true },
    invites: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserDetails" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("InviteTracking", inviteTrackingSchema);
