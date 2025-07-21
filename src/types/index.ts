export interface Member {
  id: string;
  memberNumber: string;
  name: string;
  email?: string;
  phone?: string;
  status: MemberStatus;
  dateOfBirth?: string;
  address?: string;
  notes?: string;
  registrationYear: number;
  registrationDate: string;
  profilePicture?: string;
  healthCertificate?: string;
  payments: Payment[];
  delinquentYears: number;
  totalDelinquentAmount: number;
}

export interface Payment {
  year: number;
  date?: string;
  amount: number;
  isPaid: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  memberId?: string;
}

export interface Officer {
  id: string;
  name: string;
  position: string;
  email?: string;
  phone?: string;
  profilePicture?: string;
  memberId?: string;
}

export interface Milestone {
  id: string;
  age: number;
  amount: number;
  description: string;
  isActive: boolean;
}

export interface BulletinPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  isActive: boolean;
}

export type MemberStatus = 'Active' | 'Inactive' | 'Deceased' | 'Dropped' | 'Served';

export type UserRole = 'Admin' | 'President' | 'Secretary' | 'Treasurer' | 'Auditor' | 'Public Information Officer' | 'Board of Directors' | 'Member';

export interface SystemFunction {
  id: number;
  name: string;
  description: string;
  allowedRoles: UserRole[];
}

export const SYSTEM_FUNCTIONS: SystemFunction[] = [
  { id: 1, name: 'Generate and Print Certificate of Membership', description: 'Create membership certificates', allowedRoles: ['Admin', 'President', 'Secretary', 'Treasurer'] },
  { id: 2, name: 'Generate and Print List of Members', description: 'Export member lists', allowedRoles: ['Admin', 'President', 'Secretary', 'Treasurer', 'Auditor', 'Public Information Officer', 'Board of Directors'] },
  { id: 3, name: 'Add Members', description: 'Register new members', allowedRoles: ['Admin', 'President', 'Treasurer'] },
  { id: 4, name: 'Add Files', description: 'Upload member documents', allowedRoles: ['Admin', 'President', 'Treasurer'] },
  { id: 5, name: 'Delete Members', description: 'Remove members from system', allowedRoles: ['Admin', 'President', 'Treasurer'] },
  { id: 6, name: 'Assign Status', description: 'Update member status', allowedRoles: ['Admin', 'President', 'Treasurer'] },
  { id: 7, name: 'Upload Own Profile Picture', description: 'Update personal profile', allowedRoles: ['Admin', 'President', 'Secretary', 'Treasurer', 'Auditor', 'Public Information Officer', 'Board of Directors'] },
  { id: 8, name: 'Upload Profile Pictures to Members and Officers', description: 'Manage member photos', allowedRoles: ['Admin', 'President', 'Secretary', 'Treasurer'] },
  { id: 9, name: 'Add Payment', description: 'Record member payments', allowedRoles: ['Admin', 'President', 'Treasurer'] },
  { id: 10, name: 'Update Payment', description: 'Modify payment records', allowedRoles: ['Admin', 'President', 'Treasurer'] },
  { id: 11, name: 'Export Data to Excel', description: 'Generate Excel reports', allowedRoles: ['Admin', 'President', 'Treasurer', 'Auditor'] },
  { id: 12, name: 'Create and Manage Milestones', description: 'Set milestone benefits', allowedRoles: ['Admin', 'President', 'Treasurer'] },
  { id: 13, name: 'Approve/Disapprove Member Email Accounts', description: 'Manage email access', allowedRoles: ['Admin', 'President'] },
  { id: 14, name: 'Link Email Address to Member ID', description: 'Connect emails to members', allowedRoles: ['Admin', 'President'] },
  { id: 15, name: 'Post Bulletin Updates', description: 'Manage announcements', allowedRoles: ['Admin', 'President', 'Secretary', 'Treasurer', 'Auditor', 'Public Information Officer', 'Board of Directors'] },
  { id: 16, name: 'View All Members and Latest Payments', description: 'Access member overview', allowedRoles: ['Admin', 'President', 'Secretary', 'Treasurer', 'Auditor', 'Public Information Officer', 'Board of Directors', 'Member'] },
  { id: 17, name: 'View All Members and All Payment Records', description: 'Full payment history access', allowedRoles: ['Admin', 'President', 'Treasurer', 'Auditor', 'Public Information Officer', 'Board of Directors'] }
];

export const ANNUAL_FEE = 780;
export const MORTUARY_FEE = 680;
export const OPERATIONAL_FEE = 100;