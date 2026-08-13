
export const invitationStatus  = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
} as const 

export const invitationActions = {
  ACCEPT: 'accept',
  REJECT: 'reject'
} as const