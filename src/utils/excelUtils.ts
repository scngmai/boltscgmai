import { Member, Payment } from '../types';

export const generateExcelData = (members: Member[]) => {
  const currentYear = new Date().getFullYear();
  const startYear = 2016;
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);
  
  // Create headers
  const headers = [
    'NO.',
    'NAME',
    'MEMBERSHIP STATUS',
    ...years.flatMap(year => [`YEAR ${year} Date`, `YEAR ${year} Amount`]),
    'YEARS OF DELINQUENT',
    'TOTAL AMOUNT'
  ];
  
  // Create data rows
  const data = members.map(member => {
    const row = [
      member.memberNumber,
      member.name,
      member.status
    ];
    
    // Add payment data for each year
    years.forEach(year => {
      const payment = member.payments.find(p => p.year === year && p.isPaid);
      row.push(payment?.date || '');
      row.push(payment?.amount || '');
    });
    
    // Add delinquent info
    row.push(member.delinquentYears.toString());
    row.push(member.totalDelinquentAmount.toString());
    
    return row;
  });
  
  return [headers, ...data];
};

export const parseExcelData = (data: any[][]): Partial<Member>[] => {
  if (data.length < 2) return [];
  
  const headers = data[0];
  const rows = data.slice(1);
  
  return rows.map(row => {
    const member: Partial<Member> = {
      memberNumber: row[0]?.toString() || '',
      name: row[1]?.toString() || '',
      status: row[2] as any || 'Inactive',
      payments: []
    };
    
    // Parse payment data
    const payments: Payment[] = [];
    let colIndex = 3;
    
    // Extract year columns (assuming pattern: Date, Amount, Date, Amount...)
    while (colIndex < row.length - 2) {
      const date = row[colIndex]?.toString();
      const amount = parseFloat(row[colIndex + 1]?.toString() || '0');
      
      if (date || amount > 0) {
        // Extract year from header or assume sequential years starting from 2016
        const yearMatch = headers[colIndex]?.match(/YEAR (\d{4})/);
        const year = yearMatch ? parseInt(yearMatch[1]) : 2016 + Math.floor((colIndex - 3) / 2);
        
        payments.push({
          year,
          date: date || undefined,
          amount: amount || 780,
          isPaid: !!(date || amount > 0)
        });
      }
      
      colIndex += 2;
    }
    
    member.payments = payments;
    
    // Parse delinquent data
    const delinquentYears = parseInt(row[row.length - 2]?.toString() || '0');
    const totalAmount = parseFloat(row[row.length - 1]?.toString() || '0');
    
    member.delinquentYears = delinquentYears;
    member.totalDelinquentAmount = totalAmount;
    
    return member;
  });
};

export const downloadExcel = (data: any[][], filename: string) => {
  // Create CSV content
  const csvContent = data.map(row => 
    row.map(cell => `"${cell?.toString().replace(/"/g, '""') || ''}"`).join(',')
  ).join('\n');
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};