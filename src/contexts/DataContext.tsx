import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member, Officer, Milestone, BulletinPost, Payment } from '../types';
import { updateMemberDelinquency } from '../utils/memberUtils';
import { supabase, logActivity } from '../lib/supabase';

interface DataContextType {
  members: Member[];
  officers: Officer[];
  milestones: Milestone[];
  bulletinPosts: BulletinPost[];
  activityLogs: any[];
  addMember: (member: Omit<Member, 'id'>) => Promise<void>;
  updateMember: (id: string, updates: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  addPayment: (memberId: string, year: number, amount: number, date?: string) => Promise<void>;
  updatePayment: (memberId: string, year: number, updates: Partial<{ amount: number; date: string; isPaid: boolean }>) => Promise<void>;
  addOfficer: (officer: Omit<Officer, 'id'>) => Promise<void>;
  updateOfficer: (id: string, updates: Partial<Officer>) => Promise<void>;
  deleteOfficer: (id: string) => Promise<void>;
  addMilestone: (milestone: Omit<Milestone, 'id'>) => Promise<void>;
  updateMilestone: (id: string, updates: Partial<Milestone>) => Promise<void>;
  deleteMilestone: (id: string) => Promise<void>;
  addBulletinPost: (post: Omit<BulletinPost, 'id'>) => Promise<void>;
  updateBulletinPost: (id: string, updates: Partial<BulletinPost>) => Promise<void>;
  deleteBulletinPost: (id: string) => Promise<void>;
  loadActivityLogs: () => Promise<void>;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [bulletinPosts, setBulletinPosts] = useState<BulletinPost[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadMembers(),
        loadOfficers(),
        loadMilestones(),
        loadBulletinPosts(),
        loadActivityLogs()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadActivityLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setActivityLogs(data || []);
    } catch (error) {
      console.error('Error loading activity logs:', error);
    }
  };
  const loadMembers = async () => {
    try {
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (membersError) throw membersError;

      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*');

      if (paymentsError) throw paymentsError;

      const membersWithPayments = (membersData || []).map(member => {
        const memberPayments = (paymentsData || [])
          .filter(payment => payment.member_id === member.id)
          .map(payment => ({
            year: payment.year,
            date: payment.date || undefined,
            amount: payment.amount,
            isPaid: payment.is_paid
          }));

        const memberData: Member = {
          id: member.id,
          memberNumber: member.member_number,
          name: member.name,
          email: member.email || undefined,
          phone: member.phone || undefined,
          status: member.status,
          dateOfBirth: member.date_of_birth || undefined,
          address: member.address || undefined,
          notes: member.notes || undefined,
          registrationYear: member.registration_year,
          registrationDate: member.registration_date,
          profilePicture: member.profile_picture || undefined,
          healthCertificate: member.health_certificate || undefined,
          payments: memberPayments,
          delinquentYears: member.delinquent_years,
          totalDelinquentAmount: member.total_delinquent_amount
        };

        return updateMemberDelinquency(memberData);
      });

      setMembers(membersWithPayments);
    } catch (error) {
      console.error('Error loading members:', error);
    }
  };

  const loadOfficers = async () => {
    try {
      const { data, error } = await supabase
        .from('officers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const officersData = (data || []).map(officer => ({
        id: officer.id,
        name: officer.name,
        position: officer.position,
        email: officer.email || undefined,
        phone: officer.phone || undefined,
        profilePicture: officer.profile_picture || undefined,
        memberId: officer.member_id || undefined
      }));

      setOfficers(officersData);
    } catch (error) {
      console.error('Error loading officers:', error);
    }
  };

  const loadMilestones = async () => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .order('age', { ascending: true });

      if (error) throw error;

      const milestonesData = (data || []).map(milestone => ({
        id: milestone.id,
        age: milestone.age,
        amount: milestone.amount,
        description: milestone.description,
        isActive: milestone.is_active
      }));

      setMilestones(milestonesData);
    } catch (error) {
      console.error('Error loading milestones:', error);
    }
  };

  const loadBulletinPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('bulletin_posts')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      const postsData = (data || []).map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.author,
        date: post.date,
        isActive: post.is_active
      }));

      setBulletinPosts(postsData);
    } catch (error) {
      console.error('Error loading bulletin posts:', error);
    }
  };

  const addMember = async (memberData: Omit<Member, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .insert({
          member_number: memberData.memberNumber,
          name: memberData.name,
          email: memberData.email,
          phone: memberData.phone,
          status: memberData.status,
          date_of_birth: memberData.dateOfBirth,
          address: memberData.address,
          notes: memberData.notes,
          registration_year: memberData.registrationYear,
          registration_date: memberData.registrationDate,
          profile_picture: memberData.profilePicture,
          health_certificate: memberData.healthCertificate,
          delinquent_years: memberData.delinquentYears,
          total_delinquent_amount: memberData.totalDelinquentAmount
        })
        .select()
        .single();

      if (error) throw error;

      await logActivity('member_add', `New member ${memberData.name} registered`, 'member', data.id);
      await loadMembers();
      await loadActivityLogs();
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  };

  const updateMember = async (id: string, updates: Partial<Member>) => {
    try {
      const updateData: any = {};
      
      if (updates.memberNumber) updateData.member_number = updates.memberNumber;
      if (updates.name) updateData.name = updates.name;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.status) updateData.status = updates.status;
      if (updates.dateOfBirth !== undefined) updateData.date_of_birth = updates.dateOfBirth;
      if (updates.address !== undefined) updateData.address = updates.address;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      if (updates.registrationYear) updateData.registration_year = updates.registrationYear;
      if (updates.registrationDate) updateData.registration_date = updates.registrationDate;
      if (updates.profilePicture !== undefined) updateData.profile_picture = updates.profilePicture;
      if (updates.healthCertificate !== undefined) updateData.health_certificate = updates.healthCertificate;
      if (updates.delinquentYears !== undefined) updateData.delinquent_years = updates.delinquentYears;
      if (updates.totalDelinquentAmount !== undefined) updateData.total_delinquent_amount = updates.totalDelinquentAmount;

      const { error } = await supabase
        .from('members')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      const member = members.find(m => m.id === id);
      await logActivity('member_update', `Member ${member?.name || 'Unknown'} updated`, 'member', id);
      await loadMembers();
      await loadActivityLogs();
    } catch (error) {
      console.error('Error updating member:', error);
      throw error;
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const member = members.find(m => m.id === id);
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await logActivity('member_delete', `Member ${member?.name || 'Unknown'} deleted`, 'member', id);
      await loadMembers();
      await loadActivityLogs();
    } catch (error) {
      console.error('Error deleting member:', error);
      throw error;
    }
  };

  const addPayment = async (memberId: string, year: number, amount: number, date?: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .upsert({
          member_id: memberId,
          year,
          amount,
          date: date || new Date().toISOString().split('T')[0],
          is_paid: true
        });

      if (error) throw error;

      const member = members.find(m => m.id === memberId);
      await logActivity('payment_add', `Payment received from ${member?.name || 'Unknown'} for ${year}`, 'payment', `${memberId}-${year}`);
      await loadMembers();
      await loadActivityLogs();
    } catch (error) {
      console.error('Error adding payment:', error);
      throw error;
    }
  };

  const updatePayment = async (memberId: string, year: number, updates: Partial<{ amount: number; date: string; isPaid: boolean }>) => {
    try {
      const updateData: any = {};
      if (updates.amount !== undefined) updateData.amount = updates.amount;
      if (updates.date !== undefined) updateData.date = updates.date;
      if (updates.isPaid !== undefined) updateData.is_paid = updates.isPaid;

      const { error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('member_id', memberId)
        .eq('year', year);

      if (error) throw error;

      const member = members.find(m => m.id === memberId);
      await logActivity('payment_update', `Payment updated for ${member?.name || 'Unknown'} - ${year}`, 'payment', `${memberId}-${year}`);
      await loadMembers();
      await loadActivityLogs();
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  };

  const addOfficer = async (officerData: Omit<Officer, 'id'>) => {
    try {
      const { error } = await supabase
        .from('officers')
        .insert({
          name: officerData.name,
          position: officerData.position,
          email: officerData.email,
          phone: officerData.phone,
          profile_picture: officerData.profilePicture,
          member_id: officerData.memberId
        });

      if (error) throw error;

      await logActivity('officer_add', `New officer ${officerData.name} added as ${officerData.position}`, 'officer');
      await loadOfficers();
      await loadActivityLogs();
    } catch (error) {
      console.error('Error adding officer:', error);
      throw error;
    }
  };

  const updateOfficer = async (id: string, updates: Partial<Officer>) => {
    try {
      const updateData: any = {};
      if (updates.name) updateData.name = updates.name;
      if (updates.position) updateData.position = updates.position;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.profilePicture !== undefined) updateData.profile_picture = updates.profilePicture;
      if (updates.memberId !== undefined) updateData.member_id = updates.memberId;

      const { error } = await supabase
        .from('officers')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      const officer = officers.find(o => o.id === id);
      await logActivity('officer_update', `Officer ${officer?.name || 'Unknown'} updated`, 'officer', id);
      await loadOfficers();
      await loadActivityLogs();
    } catch (error) {
      console.error('Error updating officer:', error);
      throw error;
    }
  };

  const deleteOfficer = async (id: string) => {
    try {
      const officer = officers.find(o => o.id === id);
      const { error } = await supabase
        .from('officers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await logActivity('officer_delete', `Officer ${officer?.name || 'Unknown'} removed`, 'officer', id);
      await loadOfficers();
      await loadActivityLogs();
    } catch (error) {
      console.error('Error deleting officer:', error);
      throw error;
    }
  };

  const addMilestone = async (milestoneData: Omit<Milestone, 'id'>) => {
    try {
      const { error } = await supabase
        .from('milestones')
        .insert({
          age: milestoneData.age,
          amount: milestoneData.amount,
          description: milestoneData.description,
          is_active: milestoneData.isActive
        });

      if (error) throw error;

      await logActivity('milestone_add', `New milestone created for age ${milestoneData.age}`, 'milestone');
      await loadMilestones();
      await loadActivityLogs();
    } catch (error) {
      console.error('Error adding milestone:', error);
      throw error;
    }
  };

  const updateMilestone = async (id: string, updates: Partial<Milestone>) => {
    try {
      const updateData: any = {};
      if (updates.age !== undefined) updateData.age = updates.age;
      if (updates.amount !== undefined) updateData.amount = updates.amount;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

      const { error } = await supabase
        .from('milestones')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      const milestone = milestones.find(m => m.id === id);
      await logActivity('milestone_update', `Milestone for age ${milestone?.age || 'Unknown'} updated`, 'milestone', id);
      await loadMilestones();
      await loadActivityLogs();
    } catch (error) {
      console.error('Error updating milestone:', error);
      throw error;
    }
  };

  const deleteMilestone = async (id: string) => {
    try {
      const milestone = milestones.find(m => m.id === id);
      const { error } = await supabase
        .from('milestones')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await logActivity('milestone_delete', `Milestone for age ${milestone?.age || 'Unknown'} deleted`, 'milestone', id);
      await loadMilestones();
      await loadActivityLogs();
    } catch (error) {
      console.error('Error deleting milestone:', error);
      throw error;
    }
  };

  const addBulletinPost = async (postData: Omit<BulletinPost, 'id'>) => {
    try {
      const { error } = await supabase
        .from('bulletin_posts')
        .insert({
          title: postData.title,
          content: postData.content,
          author: postData.author,
          date: postData.date,
          is_active: postData.isActive
        });

      if (error) throw error;

      await logActivity('bulletin_add', `New bulletin post "${postData.title}" created`, 'bulletin');
      await loadBulletinPosts();
      await loadActivityLogs();
    } catch (error) {
      console.error('Error adding bulletin post:', error);
      throw error;
    }
  };

  const updateBulletinPost = async (id: string, updates: Partial<BulletinPost>) => {
    try {
      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.content !== undefined) updateData.content = updates.content;
      if (updates.author !== undefined) updateData.author = updates.author;
      if (updates.date !== undefined) updateData.date = updates.date;
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

      const { error } = await supabase
        .from('bulletin_posts')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      const post = bulletinPosts.find(p => p.id === id);
      await logActivity('bulletin_update', `Bulletin post "${post?.title || 'Unknown'}" updated`, 'bulletin', id);
      await loadBulletinPosts();
      await loadActivityLogs();
    } catch (error) {
      console.error('Error updating bulletin post:', error);
      throw error;
    }
  };

  const deleteBulletinPost = async (id: string) => {
    try {
      const post = bulletinPosts.find(p => p.id === id);
      const { error } = await supabase
        .from('bulletin_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await logActivity('bulletin_delete', `Bulletin post "${post?.title || 'Unknown'}" deleted`, 'bulletin', id);
      await loadBulletinPosts();
      await loadActivityLogs();
    } catch (error) {
      console.error('Error deleting bulletin post:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{
      members,
      officers,
      milestones,
      bulletinPosts,
      activityLogs,
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
      loadActivityLogs,
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