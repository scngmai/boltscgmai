import React, { useState } from 'react';
import { Download, FileText, Filter, Calendar } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { generateExcelData, downloadExcel } from '../../utils/excelUtils';
import { formatCurrency } from '../../utils/memberUtils';
import MemberList from './MemberList';
import PaymentHistory from './PaymentHistory';

const Reports: React.FC = () => {
  const { members } = useData();
  const [activeReport, setActiveReport] = useState('summary');
  const [filters, setFilters] = useState({
    status: 'all',
    paymentStatus: 'all',
    yearRange: 'all'
  });

  const handleExportExcel = () => {
    const data = generateExcelData(members);
    downloadExcel(data, `SCNGMAI_Members_${new Date().toISOString().split('T')[0]}`);
  };

  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'Active').length;
  const inactiveMembers = members.filter(m => m.status === 'Inactive').length;
  const deceasedMembers = members.filter(m => m.status === 'Deceased').length;
  const droppedMembers = members.filter(m => m.status === 'Dropped').length;
  const servedMembers = members.filter(m => m.status === 'Served').length;
  const delinquentMembers = members.filter(m => m.delinquentYears > 0).length;
  const totalCollectibles = members.reduce((sum, m) => sum + m.totalDelinquentAmount, 0);

  const reportTabs = [
    { id: 'summary', name: 'Summary', icon: FileText },
    { id: 'members', name: 'Member List', icon: FileText },
    { id: 'payments', name: 'Payment History', icon: Calendar }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and export association reports</p>
        </div>
        <button
          onClick={handleExportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export to Excel</span>
        </button>
      </div>

      {/* Report Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {reportTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveReport(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeReport === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeReport === 'summary' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Membership Summary</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-600">Total Members</h3>
                  <p className="text-2xl font-bold text-blue-900">{totalMembers}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-600">Active</h3>
                  <p className="text-2xl font-bold text-green-900">{activeMembers}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-yellow-600">Inactive</h3>
                  <p className="text-2xl font-bold text-yellow-900">{inactiveMembers}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-red-600">Delinquent</h3>
                  <p className="text-2xl font-bold text-red-900">{delinquentMembers}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-600">Deceased</h3>
                  <p className="text-2xl font-bold text-gray-900">{deceasedMembers}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-600">Served</h3>
                  <p className="text-2xl font-bold text-purple-900">{servedMembers}</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-indigo-600">Total Collectibles</h3>
                  <p className="text-2xl font-bold text-indigo-900">{formatCurrency(totalCollectibles)}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Status Distribution</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Members</span>
                    <span className="text-sm font-medium">{((activeMembers / totalMembers) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Inactive Members</span>
                    <span className="text-sm font-medium">{((inactiveMembers / totalMembers) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Delinquent Members</span>
                    <span className="text-sm font-medium">{((delinquentMembers / totalMembers) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeReport === 'members' && <MemberList />}
          {activeReport === 'payments' && <PaymentHistory />}
        </div>
      </div>
    </div>
  );
};

export default Reports;