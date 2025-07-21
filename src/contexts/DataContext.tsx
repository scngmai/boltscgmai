import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member, Officer, Milestone, BulletinPost } from '../types';
import { updateMemberDelinquency } from '../utils/memberUtils';

interface DataContextType {
  members: Member[];
  officers: Officer[];
  milestones: Milestone[];
  bulletinPosts: BulletinPost[];
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  addPayment: (memberId: string, year: number, amount: number, date?: string) => void;
  updatePayment: (memberId: string, year: number, updates: Partial<{ amount: number; date: string; isPaid: boolean }>) => void;
  addOfficer: (officer: Omit<Officer, 'id'>) => void;
  updateOfficer: (id: string, updates: Partial<Officer>) => void;
  deleteOfficer: (id: string) => void;
  addMilestone: (milestone: Omit<Milestone, 'id'>) => void;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;
  deleteMilestone: (id: string) => void;
  addBulletinPost: (post: Omit<BulletinPost, 'id'>) => void;
  updateBulletinPost: (id: string, updates: Partial<BulletinPost>) => void;
  deleteBulletinPost: (id: string) => void;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data for demonstration
const mockMembers: Member[] = [
  {
    id: '1',
    memberNumber: 'GM20240001',
    name: 'Juan Dela Cruz',
    email: 'juan@email.com',
    phone: '+63 912 345 6789',
    status: 'Active',
    dateOfBirth: '1980-05-15',
    address: 'Surigao City',
    registrationYear: 2020,
    registrationDate: '2020-01-15',
    payments: [
      { year: 2020, date: '2020-02-01', amount: 780, isPaid: true },
      { year: 2021, date: '2021-01-15', amount: 780, isPaid: true },
      { year: 2022, date: '2022-01-20', amount: 780, isPaid: true },
      { year: 2023, date: '2023-01-10', amount: 780, isPaid: true },
      { year: 2024, date: '2024-01-05', amount: 780, isPaid: true }
    ],
    delinquentYears: 0,
    totalDelinquentAmount: 0
  },
  {
    id: '2',
    memberNumber: 'GM20190002',
    name: 'Maria Santos',
    email: 'maria@email.com',
    phone: '+63 923 456 7890',
    status: 'Inactive',
    dateOfBirth: '1975-08-22',
    address: 'Surigao del Norte',
    registrationYear: 2019,
    registrationDate: '2019-03-10',
    payments: [
      { year: 2020, date: '2020-02-15', amount: 780, isPaid: true },
      { year: 2021, date: '2021-02-10', amount: 780, isPaid: true }
    ],
    delinquentYears: 3,
    totalDelinquentAmount: 2340
  }
];

const mockOfficers: Officer[] = [
];

const mockMilestones: Milestone[] = [
  {
    id: '1',
    age: 60,
    amount: 50000,
    description: 'Senior Citizen Benefit',
    isActive: true
  },
  {
    id: '2',
    age: 65,
    amount: 75000,
    description: 'Retirement Benefit',
    isActive: true
  },
  {
    id: '3',
    age: 70,
    amount: 100000,
    description: 'Golden Years Benefit',
    isActive: true
  }
];

const mockBulletinPosts: BulletinPost[] = [
  {
    id: '1',
    title: 'Annual General Assembly 2024',
    content: 'The Annual General Assembly will be held on December 15, 2024, at the Surigao City Convention Center.',
    author: 'Admin',
    date: '2024-11-15',
    isActive: true
  },
  {
    id: '2',
    title: 'Membership Fee Reminder',
    content: 'Please be reminded that the annual membership fee of ₱780 is due by January 31, 2025.',
    author: 'Treasurer',
    date: '2024-11-10',
    isActive: true
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [bulletinPosts, setBulletinPosts] = useState<BulletinPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load data from localStorage or use mock data
    const storedMembers = localStorage.getItem('scngmai_members');
    const storedOfficers = localStorage.getItem('scngmai_officers');
    const storedMilestones = localStorage.getItem('scngmai_milestones');
    const storedBulletinPosts = localStorage.getItem('scngmai_bulletin_posts');

    setMembers(storedMembers ? JSON.parse(storedMembers) : mockMembers.map(updateMemberDelinquency));
    setOfficers(storedOfficers ? JSON.parse(storedOfficers) : mockOfficers);
    setMilestones(storedMilestones ? JSON.parse(storedMilestones) : mockMilestones);
    setBulletinPosts(storedBulletinPosts ? JSON.parse(storedBulletinPosts) : mockBulletinPosts);
    
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('scngmai_members', JSON.stringify(members));
    }
  }, [members, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('scngmai_officers', JSON.stringify(officers));
    }
  }, [officers, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('scngmai_milestones', JSON.stringify(milestones));
    }
  }, [milestones, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('scngmai_bulletin_posts', JSON.stringify(bulletinPosts));
    }
  }, [bulletinPosts, isLoading]);

  const addMember = (memberData: Omit<Member, 'id'>) => {
    const newMember: Member = {
      ...memberData,
      id: Date.now().toString()
    };
    
    const updatedMember = updateMemberDelinquency(newMember);
    setMembers(prev => [...prev, updatedMember]);
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers(prev => prev.map(member => {
      if (member.id === id) {
        const updated = { ...member, ...updates };
        return updateMemberDelinquency(updated);
      }
      return member;
    }));
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(member => member.id !== id));
  };

  const addOfficer = (officerData: Omit<Officer, 'id'>) => {
    const newOfficer: Officer = {
      ...officerData,
      id: Date.now().toString()
    };
    setOfficers(prev => [...prev, newOfficer]);
  };

  const updateOfficer = (id: string, updates: Partial<Officer>) => {
    setOfficers(prev => prev.map(officer => 
      officer.id === id ? { ...officer, ...updates } : officer
    ));
  };

  const deleteOfficer = (id: string) => {
    setOfficers(prev => prev.filter(officer => officer.id !== id));
  };

  const addPayment = (memberId: string, year: number, amount: number, date?: string) => {
    setMembers(prev => prev.map(member => {
      if (member.id === memberId) {
        const existingPaymentIndex = member.payments.findIndex(p => p.year === year);
        const newPayment = {
          year,
          date: date || new Date().toISOString().split('T')[0],
          amount,
          isPaid: true
        };

        let updatedPayments;
        if (existingPaymentIndex >= 0) {
          updatedPayments = [...member.payments];
          updatedPayments[existingPaymentIndex] = newPayment;
        } else {
          updatedPayments = [...member.payments, newPayment];
        }

        const updated = { ...member, payments: updatedPayments };
        return updateMemberDelinquency(updated);
      }
      return member;
    }));
  };

  const updatePayment = (memberId: string, year: number, updates: Partial<{ amount: number; date: string; isPaid: boolean }>) => {
    setMembers(prev => prev.map(member => {
      if (member.id === memberId) {
        const updatedPayments = member.payments.map(payment => {
          if (payment.year === year) {
            return { ...payment, ...updates };
          }
          return payment;
        });

        const updated = { ...member, payments: updatedPayments };
        return updateMemberDelinquency(updated);
      }
      return member;
    }));
  };

  const addMilestone = (milestoneData: Omit<Milestone, 'id'>) => {
    const newMilestone: Milestone = {
      ...milestoneData,
      id: Date.now().toString()
    };
    setMilestones(prev => [...prev, newMilestone]);
  };

  const updateMilestone = (id: string, updates: Partial<Milestone>) => {
    setMilestones(prev => prev.map(milestone => 
      milestone.id === id ? { ...milestone, ...updates } : milestone
    ));
  };

  const deleteMilestone = (id: string) => {
    setMilestones(prev => prev.filter(milestone => milestone.id !== id));
  };

  const addBulletinPost = (postData: Omit<BulletinPost, 'id'>) => {
    const newPost: BulletinPost = {
      ...postData,
      id: Date.now().toString()
    };
    setBulletinPosts(prev => [newPost, ...prev]);
  };

  const updateBulletinPost = (id: string, updates: Partial<BulletinPost>) => {
    setBulletinPosts(prev => prev.map(post => 
      post.id === id ? { ...post, ...updates } : post
    ));
  };

  const deleteBulletinPost = (id: string) => {
    setBulletinPosts(prev => prev.filter(post => post.id !== id));
  };

  return (
    <DataContext.Provider value={{
      members,
      officers,
      milestones,
      bulletinPosts,
      addMember,
      updateMember,
      deleteMember,
      addPayment,
      updatePayment,
      addOfficer,
      updateOfficer,
      deleteOfficer,
      addMilestone,
      updateMilestone,
      deleteMilestone,
      addBulletinPost,
      updateBulletinPost,
      deleteBulletinPost,
      isLoading
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};