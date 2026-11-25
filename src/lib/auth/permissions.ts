import { CanonicalRole, UserRole } from '../types';
import { ADMIN_NAV_ITEMS, USER_NAV_ITEMS } from '../constants';

/**
 * Normalizes any persisted role value into the 3 canonical RBAC roles.
 * Legacy `'admin'` maps to `'team_leader'`.
 */
export function normalizeRole(role?: UserRole | string | null): CanonicalRole {
  if (role === 'super_admin') return 'super_admin';
  if (role === 'team_leader' || role === 'admin') return 'team_leader';
  return 'user';
}

export function isSuperAdmin(role?: UserRole | string | null): boolean {
  return normalizeRole(role) === 'super_admin';
}

export function isTeamLeader(role?: UserRole | string | null): boolean {
  return normalizeRole(role) === 'team_leader';
}

export function isManager(role?: UserRole | string | null): boolean {
  const canonical = normalizeRole(role);
  return canonical === 'super_admin' || canonical === 'team_leader';
}

export function canCreateTeam(role?: UserRole | string | null): boolean {
  return isManager(role);
}

export function canDeleteTeam(role?: UserRole | string | null): boolean {
  return isSuperAdmin(role);
}

export function canChangeUserRoles(role?: UserRole | string | null): boolean {
  return isSuperAdmin(role);
}

export function getHomeRoute(role?: UserRole | string | null): string {
  return isManager(role) ? '/admin/dashboard' : '/dashboard';
}

export function getRoleLabel(role?: UserRole | string | null): string {
  switch (normalizeRole(role)) {
    case 'super_admin':
      return 'مدير المنصة العام (Super Admin)';
    case 'team_leader':
      return 'قائد فريق (Team Leader)';
    case 'user':
    default:
      return 'عضو فريق';
  }
}

export function getPortalLabel(role?: UserRole | string | null): string {
  switch (normalizeRole(role)) {
    case 'super_admin':
      return 'بوابة مدير المنصة العام (Super Admin)';
    case 'team_leader':
      return 'بوابة قائد الفريق';
    case 'user':
    default:
      return 'مساحة العمل';
  }
}

export function getNavItemsForRole(role?: UserRole | string | null) {
  return isManager(role) ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;
}
