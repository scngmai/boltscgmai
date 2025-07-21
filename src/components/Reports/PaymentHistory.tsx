import React, { useState } from 'react';
import { Calendar, DollarSign, Filter } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { formatCurrency } from '../../utils/memberUtils';

const PaymentHistory: React.FC = () => {
  const { members } = useData();
  const [selectedYearRange, setSelectedYearRange] = useState('2020-2025');

  const yearRanges = [
    { value: '2000-2005', label: '2000-2005' },
    { value: '2005-2010', label: '2005-2010' },
    { value: '2010-2015', label: '2010-2015' },
    { value: '2015-2020', label: '2015-2020' },
    { value: '2020-2025', label: '2020-2025' }
  ];

  const [startYear, endYear] = selectedYearRange.split('-').map(Number);
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  const getPaymentData = () => {
    return members.map(member => {
      const memberPayments = years.map(year => {
        const payment = member.payments.find(p => p.year === year && p.isPaid);
        return {
          year,
          amount: payment?.amount || 0,
          date: payment?.date || '',
          isPaid: !!payment
        };
      });

      const totalPaid = memberPayments.reduce((sum, p) => sum + p.amount, 0);
      const yearsPaid = memberPayments.filter(p => p.isPaid).length;

      return {
        member,
        payments: memberPayments,
        totalPaid,
        yearsPaid
      };
    });
  };

  const paymentData = getPaymentData();
  const grandTotal = paymentData.reduce((sum, data) => sum + data.totalPaid, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={selectedYearRange}
            onChange={(e) => setSelectedYearRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {yearRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                {years.map(year => (
                  <th key={year} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {year}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentData.map((data) => (
                <tr key={data.member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white">
                    {data.member.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {data.member.memberNumber}
                  </td>
                  {data.payments.map((payment) => (
                    <td key={payment.year} className="px-4 py-4 whitespace-nowrap text-center">
                      {payment.isPaid ? (
                        <div className="text-sm">
                          <div className="text-green-600 font-medium">
                            {formatCurrency(payment.amount)}
                          </div>
                          {payment.date && (
                            <div className="text-xs text-gray-500">
                              {new Date(payment.date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-red-400 text-sm">—</div>
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(data.totalPaid)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {data.yearsPaid} of {years.length} years
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={2} className="px-6 py-4 text-sm font-medium text-gray-900">
                  Grand Total
                </td>
                {years.map(year => {
                  const yearTotal = paymentData.reduce((sum, data) => {
                    const payment = data.payments.find(p => p.year === year);
                    return sum + (payment?.amount || 0);
                  }, 0);
                  return (
                    <td key={year} className="px-4 py-4 text-center text-sm font-medium text-gray-900">
                      {yearTotal > 0 ? formatCurrency(yearTotal) : '—'}
                    </td>
                  );
                })}
                <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                  {formatCurrency(grandTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center">
          <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">Payment Summary ({selectedYearRange})</h3>
            <p className="text-sm text-blue-700">
              Total collected: {formatCurrency(grandTotal)} • 
              Average per member: {formatCurrency(grandTotal / members.length)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;