
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SupplyItem } from '@/contexts/SupplyContext';

// Interface for the report data
interface ReportData {
  foodProgress: number;
  kitProgress: number;
  overallScore: number;
  priorityItems: SupplyItem[];
  completedCounts: {
    complete: number;
    inProgress: number;
    notStarted: number;
  };
}

// Helper function to format date
const formatDate = (): string => {
  const date = new Date();
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

// Helper function to determine text color based on progress value
const getStatusColor = (progress: number): string => {
  if (progress >= 75) return '#22c55e'; // Green
  if (progress >= 50) return '#0ea5e9'; // Blue
  if (progress >= 25) return '#f59e0b'; // Amber
  return '#ef4444'; // Red
};

// Main function to generate PDF report
export const generatePDF = (reportData: ReportData): void => {
  const { foodProgress, kitProgress, overallScore, priorityItems, completedCounts } = reportData;
  const doc = new jsPDF();
  
  // Set title
  doc.setFontSize(22);
  doc.setTextColor('#0f172a');
  doc.text('Preparedness Report', 105, 20, { align: 'center' });
  
  // Set date
  doc.setFontSize(12);
  doc.setTextColor('#64748b');
  doc.text(`Generated on: ${formatDate()}`, 105, 30, { align: 'center' });
  
  // Add overall score section
  doc.setDrawColor(0);
  doc.setFillColor(245, 247, 250);
  doc.rect(20, 40, 170, 40, 'F');
  
  doc.setFontSize(16);
  doc.setTextColor('#0f172a');
  doc.text('Overall Readiness Score', 105, 55, { align: 'center' });
  
  doc.setFontSize(28);
  doc.setTextColor(getStatusColor(overallScore));
  doc.text(`${overallScore}%`, 105, 70, { align: 'center' });
  
  // Add progress sections
  doc.setFontSize(14);
  doc.setTextColor('#0f172a');
  doc.text('Readiness by Category', 20, 100);
  
  // Create progress table
  autoTable(doc, {
    startY: 110,
    head: [['Category', 'Progress']],
    body: [
      ['72-Hour Emergency Kit', `${kitProgress}%`],
      ['Food Storage', `${foodProgress}%`],
    ],
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255]
    },
    bodyStyles: {
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [241, 245, 249]
    },
  });
  
  // Add completed items section
  doc.setFontSize(14);
  doc.setTextColor('#0f172a');
  doc.text('Item Completion Status', 20, 150);
  
  // Create completion status table
  autoTable(doc, {
    startY: 160,
    head: [['Status', 'Count']],
    body: [
      ['Complete', completedCounts.complete],
      ['In Progress', completedCounts.inProgress],
      ['Not Started', completedCounts.notStarted],
    ],
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255]
    },
    bodyStyles: {
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [241, 245, 249]
    },
  });
  
  // Add priority items section if we have any
  if (priorityItems.length > 0) {
    doc.addPage();
    
    doc.setFontSize(14);
    doc.setTextColor('#0f172a');
    doc.text('Top Priority Items', 20, 20);
    
    // Call autoTable and properly handle the result
    let finalYPosition = 30;
    
    // Execute autoTable
    autoTable(doc, {
      startY: 30,
      head: [['Item', 'Category', 'Current', 'Needed']],
      body: priorityItems.map(item => [
        item.name,
        item.category,
        `${item.currentAmount} ${item.unit}`,
        `${item.recommendedAmount} ${item.unit}`,
      ]),
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255]
      },
      bodyStyles: {
        textColor: [30, 41, 59]
      },
      alternateRowStyles: {
        fillColor: [241, 245, 249]
      },
      didDrawPage: function(data) {
        finalYPosition = data.cursor.y;
      }
    });
    
    // Use the finalYPosition from the callback
    doc.setFontSize(12);
    doc.setTextColor('#64748b');
    doc.text(
      'RECOMMENDATION: Focus on obtaining these priority items to quickly improve your preparedness score.',
      20,
      finalYPosition + 20,
      { maxWidth: 170 }
    );
  }
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor('#94a3b8');
    doc.text(
      'Powered by RelianceHQ - Your Family Preparedness Partner',
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save('preparedness-report.pdf');
};
