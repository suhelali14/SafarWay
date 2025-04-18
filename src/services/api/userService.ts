/**
 * @deprecated Use agencyUserService instead
 * This file is kept for backward compatibility.
 */
import { agencyUserService } from './agencyUserService';
export * from './agencyUserService';

// Re-export all agencyUserService functions
export const {
  getAgencyUsers,
  getAgencyUser,
  addAgencyUser,
  updateAgencyUser,
  deleteAgencyUser,
  inviteAgencyUser,
  resendInvitation,
  suspendUser,
  activateUser,
  updateUserRole
} = agencyUserService; 