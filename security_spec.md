# Security Specification for Bali2Ride

## 1. Data Invariants
- A `BikeListing` must refer to a valid `Bike` and a valid `Owner`.
- An `Owner` can have multiple `areas` (referenced by `id`).
- `Bookings` must have a valid `bikeId`.
- `Areas` are read-only for public, managed by admin.

## 2. The Dirty Dozen Payloads
1. **Malicious ID**: Create a district with ID `../sneaky/path`. (Blocked by `isValidId`)
2. **Shadow Field**: Adding `isVerified: true` to a bike. (Blocked by `hasOnly`)
3. **Price Manipulation**: Updating bike price to 0. (Blocked by `isValidBike`)
4. **Owner Spoofing**: Creating an owner with `id` of another user. (Blocked by `auth.uid` check if it was user-based, but here it's admin-managed)
5. **Listing Hijack**: Changing `ownerId` of a listing. (Blocked by `immutable` check)
6. **Orphaned Listing**: Creating a listing with non-existent `bikeId`. (Blocked by `exists`)
7. **Mass Profile Read**: Scraping all owners. (Blocked by `allow list: if false` or strictly checked)
8. **Booking Modification**: Changing price of an existing booking. (Blocked by `allow update: if false`)
9. **Spam Bookings**: Creating 1000 bookings in 1 second. (WAF/Rate limit level, but rules should check `request.time`)
10. **Area Poisoning**: Injecting 1MB of text into district keywords. (Blocked by `.size()` check)
11. **Status Shortcut**: Moving listing from `maintenance` back to `available` without permission (if restricted).
12. **Admin Escalation**: Trying to create a document in `/admins/` collection.

## 3. Test Cases (Mental)
- [PASS] Public can read bikes.
- [PASS] Public can read colors.
- [PASS] Public can read areas.
- [FAIL] Public can create bike.
- [FAIL] Public can delete bike.
- [PASS] Admin (verified in `/admins/`) can manage everything.
