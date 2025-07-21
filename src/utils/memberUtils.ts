import { Member, MemberStatus, Payment, ANNUAL_FEE } from '../types';

export const generateMemberNumber = (): string => {
  const prefix = 'GM';
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${year}${random}`;
};

export const calculateMemberStatus = (member: Member): MemberStatus => {
  const currentYear = new Date().getFullYear();
  const unpaidYears = getUnpaidYears(member, currentYear);
  
  if (member.status === 'Deceased' || member.status === 'Served') {
    return member.status;
  }
  
  // Check if paid for current year
  const currentYearPayment = member.payments.find(p => p.year === currentYear && p.isPaid);
  
  if (unpaidYears.length >= 4) {
    return 'Dropped';
  } else if (unpaidYears.length >= 3 || !currentYearPayment) {
    return 'Inactive';
  } else if (unpaidYears.length <= 2 && currentYearPayment) {
    return 'Active';
  }
  
  return 'Inactive';
};

export const getUnpaidYears = (member: Member, currentYear: number): number[] => {
  const unpaidYears: number[] = [];
  
  // Start from registration year + 1 (delinquency doesn't count registration year)
  for (let year = member.registrationYear + 1; year <= currentYear; year++) {
    const payment = member.payments.find(p => p.year === year && p.isPaid);
    if (!payment) {
      unpaidYears.push(year);
    }
  }
  
  return unpaidYears;
};

export const calculateDelinquentAmount = (member: Member): number => {
  const currentYear = new Date().getFullYear();
  const unpaidYears = getUnpaidYears(member, currentYear);
  return unpaidYears.length * ANNUAL_FEE;
};

export const updateMemberDelinquency = (member: Member): Member => {
  const currentYear = new Date().getFullYear();
  const unpaidYears = getUnpaidYears(member, currentYear);
  
  return {
    ...member,
    delinquentYears: unpaidYears.length,
    totalDelinquentAmount: unpaidYears.length * ANNUAL_FEE,
    status: calculateMemberStatus(member)
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount);
};

export const getPaymentStatus = (member: Member, year: number): 'Paid' | 'Pending' | 'Delinquent' => {
  const payment = member.payments.find(p => p.year === year);
  
  if (payment && payment.isPaid) {
    return 'Paid';
  } else if (year === new Date().getFullYear()) {
    return 'Pending';
  } else {
    return 'Delinquent';
  }
};

export const getBirthdayCelebrants = (members: Member[]): Member[] => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  
  return members.filter(member => {
    if (!member.dateOfBirth) return false;
    
    const birthDate = new Date(member.dateOfBirth);
    return birthDate.getMonth() === currentMonth && birthDate.getDate() === currentDay;
  });
};