const express = require('express');
const router = express.Router();
const InviteTracking = require('../../models/Other/inviteTrackingSchema');
router.post('/check-invite-code', async (req, res) => {
  const { uniqueInvitationCode } = req.body;

  try {
    const invite = await InviteTracking.findOne({ uniqueInvitationCode });

    if (invite) {
      return res.status(200).json({ valid: true, message: 'Invitation code is valid.' });
    } else {
      return res.status(404).json({ valid: false, message: 'Invalid invitation code.' });
    }
  } catch (error) {
    console.error('Error while checking invitation code:', error);
    return res.status(500).json({ valid: false, message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
