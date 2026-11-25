# MUANS Operations Security Specification

## 1. Data Invariants
1. **Verified Identity**: All writes and internal queries require a signed-in Google user (`request.auth != null`) with `request.auth.token.email_verified == true`.
2. **Admin Escalation Lock**: Admin privileges derive exclusively from `/admins/{uid}` existence or the verified bootstrapped operator email (`munguanawaza@gmail.com` with `email_verified == true`). No client user can self-assign `Admin` role on `/admins/{uid}` or post chat messages with `senderRole == 'Admin'` unless `isAdmin()`.
3. **Immutable Audit Fields**: `creatorUid`, `creatorName`, `senderUid`, and `createdAt` can never be changed after document creation; all timestamps must match `request.time`.
4. **Delivery Order State Machine**: New orders must start at `status == 'pending'` with `acceptedByUid == ''` and `acceptedByName == ''`. Non-admin operators cannot skip from `pending` directly to `completed`, nor modify `completed` or `cancelled` terminal orders.
5. **Strict Volumetric Bounds**: Every string and document ID is bounded (`id <= 128`, `customer <= 120`, `details <= 500`, `message <= 1000`) and extra shadow fields are rejected via `hasAll`/`hasOnly` and `affectedKeys().hasOnly(...)`.

## 2. The "Dirty Dozen" Adversarial Payloads
1. Unauthenticated read/write to `/orders` or `/kolwezi_chat` -> `PERMISSION_DENIED`.
2. Unverified email token (`email_verified: false`) masquerading as `munguanawaza@gmail.com` -> `PERMISSION_DENIED`.
3. Self-promotion write to `/admins/{attackerUid}` -> `PERMISSION_DENIED`.
4. Non-admin posting to `/kolwezi_chat` with `senderRole: "Admin"` -> `PERMISSION_DENIED`.
5. Chat spoofing (`senderUid != request.auth.uid`) -> `PERMISSION_DENIED`.
6. Chat payload exceeding 1000 characters or shadow key `isOfficial: true` -> `PERMISSION_DENIED`.
7. Order creation with forged `status: "completed"` or forged `creatorUid` -> `PERMISSION_DENIED`.
8. Order creation with backdated client timestamp (`createdAt != request.time`) -> `PERMISSION_DENIED`.
9. Order shadow update injecting `{ status: "accepted", feeOverride: 999 }` -> `PERMISSION_DENIED`.
10. Order state shortcut (`pending` -> `completed`) by non-admin -> `PERMISSION_DENIED`.
11. Mutating an order already in terminal state (`completed` or `cancelled`) by non-admin -> `PERMISSION_DENIED`.
12. Path ID poisoning (`/orders/invalid$id...` > 128 chars or special characters) -> `PERMISSION_DENIED`.
