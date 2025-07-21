import { UserRole, SystemFunction, SYSTEM_FUNCTIONS } from '../types';

export const hasAccess = (userRole: UserRole, functionId: number): boolean => {
  const systemFunction = SYSTEM_FUNCTIONS.find(f => f.id === functionId);
  return systemFunction ? systemFunction.allowedRoles.includes(userRole) : false;
};

export const getAccessibleFunctions = (userRole: UserRole): SystemFunction[] => {
  return SYSTEM_FUNCTIONS.filter(func => func.allowedRoles.includes(userRole));
};

export const canViewTab = (userRole: UserRole, tab: string): boolean => {
  switch (tab) {
    case 'dashboard':
      return true; // All roles can view dashboard
    case 'registration':
      return hasAccess(userRole, 3); // Add Members
    case 'officers':
      return ['Admin', 'President', 'Secretary', 'Treasurer'].includes(userRole);
    case 'reports':
      return hasAccess(userRole, 2); // Generate and Print List of Members
    case 'profile':
      return true; // All roles can view their profile
    case 'milestones':
      return hasAccess(userRole, 12); // Create and Manage Milestones
    case 'user-management':
      return userRole === 'Admin';
    default:
      return false;
  }
};

export const getRoleColor = (role: UserRole): string => {
  const colors = {
    'Admin': 'bg-red-100 text-red-800',
    'President': 'bg-purple-100 text-purple-800',
    'Secretary': 'bg-blue-100 text-blue-800',
    'Treasurer': 'bg-green-100 text-green-800',
    'Auditor': 'bg-yellow-100 text-yellow-800',
    'Public Information Officer': 'bg-indigo-100 text-indigo-800',
    'Board of Directors': 'bg-gray-100 text-gray-800',
    'Member': 'bg-slate-100 text-slate-800'
  };
  
  return colors[role] || 'bg-gray-100 text-gray-800';
};