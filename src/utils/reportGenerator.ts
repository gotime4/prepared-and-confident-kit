import { SupplyItem } from "../contexts/SupplyContext";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generatePDF = (
  foodItems: SupplyItem[],
  kitItems: SupplyItem[],
  overallScore: number,
  statusCounts: { complete: number, inProgress: number, notStarted: number },
  priorities: SupplyItem[]
) => {
  try {
    // Create a new PDF document with cleaner formatting
    const doc = new jsPDF();
    
    // Helper function to add page numbers
    const addPageNumbers = () => {
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Page ${i} of ${totalPages}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
      }
    };

    // Document header
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.text("Family Readiness Report", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text("A personalized snapshot of your emergency and long-term preparedness", 105, 30, { align: "center" });
    
    // Date and household info
    const dateGenerated = new Date().toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });
    doc.setFontSize(10);
    doc.text(`Date Generated: ${dateGenerated}`, 20, 40);
    doc.text("Prepared For: Your Household", 20, 45);

    // Start Y position for first section
    let yPos = 55;

    // Section 1: Long-Term Food Storage
    doc.setFontSize(14);
    doc.text("Section 1: Long-Term Food Storage Overview", 20, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.text(
      "Based on your family's selected size and our recommended yearly supply guidelines, here is your current food storage status.",
      20,
      yPos
    );
    yPos += 8;
    
    // Food storage data table
    const foodData = foodItems.length > 0 ? foodItems.map(item => [
      item.category,
      item.name,
      `${item.recommendedAmount} ${item.unit}`,
      `${item.currentAmount} ${item.unit}`,
      `${Math.min(Math.floor((item.currentAmount / item.recommendedAmount) * 100), 100)}%`,
      getStatusText(item.currentAmount, item.recommendedAmount)
    ]) : [["No data", "-", "-", "-", "-", "-"]];
    
    // Add food items table with tight formatting
    doc.autoTable({
      head: [["Category", "Item", "Recommended", "You Have", "Progress", "Status"]],
      body: foodData,
      startY: yPos,
      headStyles: { fillColor: [176, 196, 222] },
      alternateRowStyles: { fillColor: [240, 248, 255] },
      styles: { cellPadding: 2, fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' },
        4: { cellWidth: 'auto' },
        5: { cellWidth: 'auto' }
      },
      margin: { top: 10 },
    });
    
    // Update position after table
    yPos = (doc as any).lastAutoTable.finalY + 5;

    // Top Priority Suggestions
    if (priorities.length > 0) {
      const foodPriorities = priorities.filter(item => item.type === 'food');
      if (foodPriorities.length > 0) {
        const priorityNames = foodPriorities.map(item => item.name).join(", ");
        doc.text(`Top Priority Suggestions: ${priorityNames}`, 20, yPos);
        yPos += 8;
      }
    } else {
      doc.text("No priority items identified yet.", 20, yPos);
      yPos += 8;
    }

    // Section 2: 72-Hour Emergency Kit
    // Check if we need to start a new page for better formatting
    if (yPos > doc.internal.pageSize.height - 120) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.text("Section 2: 72-Hour Emergency Kit", 20, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.text("Here's how your short-term emergency supply is shaping up.", 20, yPos);
    yPos += 8;
    
    // Kit data table
    const kitData = kitItems.length > 0 ? kitItems.map(item => [
      item.category,
      item.name,
      `${item.recommendedAmount} ${item.unit === 'quantity' ? '' : item.unit}`,
      `${item.currentAmount} ${item.unit === 'quantity' ? '' : item.unit}`,
      `${Math.min(Math.floor((item.currentAmount / item.recommendedAmount) * 100), 100)}%`,
      getStatusText(item.currentAmount, item.recommendedAmount)
    ]) : [["No data", "-", "-", "-", "-", "-"]];
    
    // Add kit items table with tight formatting
    doc.autoTable({
      head: [["Category", "Item", "Recommended", "You Have", "Progress", "Status"]],
      body: kitData,
      startY: yPos,
      headStyles: { fillColor: [176, 196, 222] },
      alternateRowStyles: { fillColor: [240, 248, 255] },
      styles: { cellPadding: 2, fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' },
        4: { cellWidth: 'auto' },
        5: { cellWidth: 'auto' }
      },
      margin: { top: 10 },
    });
    
    // Update position after table
    yPos = (doc as any).lastAutoTable.finalY + 8;

    // Make sure the summary section starts on a clean page if near bottom
    if (yPos > doc.internal.pageSize.height - 60) {
      doc.addPage();
      yPos = 20;
    }

    // Section 3: Summary
    doc.setFontSize(14);
    doc.text("Section 3: Summary", 20, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.text(`■ Fully Prepared Categories: ${statusCounts.complete}`, 20, yPos);
    yPos += 6;
    
    doc.text(`■ In Progress Categories: ${statusCounts.inProgress}`, 20, yPos);
    yPos += 6;
    
    doc.text(`■ Not Started Categories: ${statusCounts.notStarted}`, 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.text(`Your Overall Readiness Score: ${overallScore}%`, 20, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.text(
      "You're making great progress! Focus on the high-need items above to strengthen your family's readiness.",
      20,
      yPos
    );

    // Add page numbers
    addPageNumbers();

    // Return the completed PDF
    return doc;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF report");
  }
};

// Helper function to get status text
const getStatusText = (current: number, recommended: number): string => {
  if (recommended === 0) return "N/A";
  const percentage = (current / recommended) * 100;
  if (percentage >= 100) return "Complete";
  if (percentage > 0) return "In Progress";
  return "Not Started";
};
