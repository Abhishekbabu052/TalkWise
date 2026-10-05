const User = require('../models/User');

/**
 * Ensures the superadmin account exists and is up to date.
 * Called once after the DB connection is established.
 * Safe to run on every startup — it only creates/updates when needed.
 */
async function ensureSuperAdmin() {
  const email = (process.env.SUPERADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.SUPERADMIN_PASSWORD || '';

  if (!email || !password) {
    console.warn('[SuperAdmin] SUPERADMIN_EMAIL or SUPERADMIN_PASSWORD not set — skipping superadmin seed.');
    return;
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // Create fresh superadmin — password will be hashed by the pre-save hook
      user = new User({ name: 'Superadmin', email, password, role: 'superadmin', isBlocked: false });
      await user.save();
      console.log(`[SuperAdmin] Created superadmin account: ${email}`);
    } else {
      let needsSave = false;
      if (user.role !== 'superadmin') {
        user.role = 'superadmin';
        needsSave = true;
      }
      if (user.isBlocked) {
        user.isBlocked = false;
        needsSave = true;
      }
      // Check if current password matches env password, if not update it
      const match = await user.matchPassword(password);
      if (!match) {
        user.password = password; // pre-save hook will hash it
        needsSave = true;
      }
      if (needsSave) {
        await user.save();
        console.log(`[SuperAdmin] Updated/synchronized superadmin account: ${email}`);
      } else {
        console.log(`[SuperAdmin] Superadmin account is up to date: ${email}`);
      }
    }
  } catch (err) {
    console.error('[SuperAdmin] Failed to seed superadmin:', err.message);
  }
}

module.exports = ensureSuperAdmin;
