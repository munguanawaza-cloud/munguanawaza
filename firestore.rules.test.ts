/**
 * Dirty Dozen Security Rule Verification Spec for MUANS Operations.
 * Intended for validation against Firebase Firestore Emulator (@firebase/rules-unit-testing).
 */

export interface DirtyDozenCase {
  id: number;
  name: string;
  collection: 'admins' | 'kolwezi_chat' | 'orders';
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  expected: 'PERMISSION_DENIED';
  payload?: Record<string, unknown>;
}

export const DIRTY_DOZEN_PAYLOADS: DirtyDozenCase[] = [
  {
    id: 1,
    name: 'Unauthenticated list on orders',
    collection: 'orders',
    operation: 'list',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Spoofed admin email with email_verified=false',
    collection: 'orders',
    operation: 'list',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Privilege escalation into /admins/{uid}',
    collection: 'admins',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { uid: 'attacker123', email: 'attacker@example.com' },
  },
  {
    id: 4,
    name: 'Non-admin spoofing Admin role in kolwezi_chat',
    collection: 'kolwezi_chat',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: {
      channel: 'kolwezi-dispatch',
      senderUid: 'driver1',
      senderName: 'Driver',
      senderRole: 'Admin',
      message: 'Fake admin broadcast',
    },
  },
  {
    id: 5,
    name: 'Chat senderUid mismatch',
    collection: 'kolwezi_chat',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: {
      channel: 'kolwezi-dispatch',
      senderUid: 'otherUserUid',
      senderName: 'Impersonator',
      senderRole: 'Chauffeur',
      message: 'Spoofed sender',
    },
  },
  {
    id: 6,
    name: 'Chat shadow field injection',
    collection: 'kolwezi_chat',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: {
      channel: 'kolwezi-dispatch',
      senderUid: 'driver1',
      senderName: 'Driver',
      senderRole: 'Chauffeur',
      message: 'Hello',
      isOfficial: true,
    },
  },
  {
    id: 7,
    name: 'Order created already completed',
    collection: 'orders',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: {
      creatorUid: 'merchant1',
      creatorName: 'Merchant',
      customer: 'Station Dilala',
      details: '2 cartons',
      status: 'completed',
      acceptedByUid: 'merchant1',
      acceptedByName: 'Merchant',
    },
  },
  {
    id: 8,
    name: 'Order created with client timestamp instead of server request.time',
    collection: 'orders',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: {
      creatorUid: 'merchant1',
      creatorName: 'Merchant',
      customer: 'Station Dilala',
      details: '2 cartons',
      status: 'pending',
      acceptedByUid: '',
      acceptedByName: '',
      createdAt: '2020-01-01T00:00:00Z',
    },
  },
  {
    id: 9,
    name: 'Order shadow update injecting unapproved fee field',
    collection: 'orders',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: {
      status: 'accepted',
      acceptedByUid: 'driver1',
      acceptedByName: 'Driver 1',
      feeOverride: 999,
    },
  },
  {
    id: 10,
    name: 'Order state shortcut pending -> completed by non-admin',
    collection: 'orders',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: {
      status: 'completed',
    },
  },
  {
    id: 11,
    name: 'Terminal state mutation on completed order by non-admin',
    collection: 'orders',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: {
      status: 'pending',
    },
  },
  {
    id: 12,
    name: 'Document ID path poisoning',
    collection: 'orders',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
  },
];
