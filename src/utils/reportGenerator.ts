import { SupplyItem } from "../contexts/SupplyContext";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

// Fix for jsPDF typing
declare module 'jspdf' {
  interface jsPDF {
    autoTable: any;
  }
}

// Safely calculate percentage to avoid NaN or Infinity
const safeCalculatePercentage = (current: number, recommended: number): number => {
  if (recommended <= 0 || isNaN(recommended) || isNaN(current)) return 0;
  return Math.min(Math.floor((current / recommended) * 100), 100);
};

// Safely format item text
const safeFormatText = (text: string | number | undefined): string => {
  if (text === undefined || text === null) return "-";
  return String(text);
};

export const generatePDF = (
  foodItems: SupplyItem[],
  kitItems: SupplyItem[],
  overallScore: number,
  statusCounts: { complete: number, inProgress: number, notStarted: number },
  priorities: SupplyItem[]
) => {
  try {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Helper function to add page numbers
    const addPageNumbers = () => {
      try {
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text(`Page ${i} of ${totalPages}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
        }
      } catch (err) {
        console.warn("Could not add page numbers:", err);
        // Continue without page numbers if there's an error
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
    
    // Prepare food storage data - with simpler structure to avoid autoTable issues
    try {
      if (foodItems && foodItems.length > 0) {
        // Create a simple table manually instead of using autoTable
        const columns = ["Category", "Item", "Recommended", "You Have", "Progress", "Status"];
        const columnWidths = [30, 40, 30, 30, 20, 30];
        const startX = 20;
        let currentY = yPos;
        
        // Draw header
        doc.setFillColor(176, 196, 222);
        doc.rect(startX, currentY, 180, 8, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        
        let xPos = startX + 2;
        for (let i = 0; i < columns.length; i++) {
          doc.text(columns[i], xPos, currentY + 5.5);
          xPos += columnWidths[i];
        }
        currentY += 8;
        
        // Draw data rows
        doc.setFont("helvetica", "normal");
        let rowColor = false;
        
        for (let i = 0; i < Math.min(foodItems.length, 20); i++) { // Limit to 20 rows to avoid oversized PDF
          const item = foodItems[i];
          
          if (rowColor) {
            doc.setFillColor(240, 248, 255);
            doc.rect(startX, currentY, 180, 8, 'F');
          }
          rowColor = !rowColor;
          
          const unit = safeFormatText(item.unit || '');
          const progress = safeCalculatePercentage(
            Number(item.currentAmount || 0), 
            Number(item.recommendedAmount || 1)
          );
          
          xPos = startX + 2;
          doc.text(safeFormatText(item.category), xPos, currentY + 5.5);
          xPos += columnWidths[0];
          
          doc.text(safeFormatText(item.name), xPos, currentY + 5.5);
          xPos += columnWidths[1];
          
          doc.text(`${safeFormatText(item.recommendedAmount)} ${unit}`, xPos, currentY + 5.5);
          xPos += columnWidths[2];
          
          doc.text(`${safeFormatText(item.currentAmount)} ${unit}`, xPos, currentY + 5.5);
          xPos += columnWidths[3];
          
          doc.text(`${progress}%`, xPos, currentY + 5.5);
          xPos += columnWidths[4];
          
          doc.text(getStatusText(Number(item.currentAmount || 0), Number(item.recommendedAmount || 0)), xPos, currentY + 5.5);
          
          currentY += 8;
          
          // Check if we need a new page
          if (currentY > doc.internal.pageSize.height - 20) {
            doc.addPage();
            currentY = 20;
          }
        }
        
        yPos = currentY + 5;
      } else {
        doc.text("No food storage items found.", 20, yPos);
        yPos += 10;
      }
    } catch (tableErr) {
      console.error("Error creating food storage table:", tableErr);
      doc.setTextColor(255, 0, 0);
      doc.text("Could not generate food storage table due to an error.", 20, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 10;
    }

    // Top Priority Suggestions
    try {
      if (priorities && priorities.length > 0) {
        const foodPriorities = priorities.filter(item => item.type === 'food');
        if (foodPriorities.length > 0) {
          const priorityNames = foodPriorities.map(item => safeFormatText(item.name)).join(", ");
          doc.text(`Top Priority Suggestions: ${priorityNames}`, 20, yPos);
          yPos += 8;
        }
      } else {
        doc.text("No priority items identified yet.", 20, yPos);
        yPos += 8;
      }
    } catch (priorityErr) {
      console.error("Error displaying priorities:", priorityErr);
      doc.text("Could not display priorities.", 20, yPos);
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
    
    // Create emergency kit data table manually
    try {
      if (kitItems && kitItems.length > 0) {
        // Create a simple table manually instead of using autoTable
        const columns = ["Category", "Item", "Recommended", "You Have", "Progress", "Status"];
        const columnWidths = [30, 40, 30, 30, 20, 30];
        const startX = 20;
        let currentY = yPos;
        
        // Draw header
        doc.setFillColor(176, 196, 222);
        doc.rect(startX, currentY, 180, 8, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        
        let xPos = startX + 2;
        for (let i = 0; i < columns.length; i++) {
          doc.text(columns[i], xPos, currentY + 5.5);
          xPos += columnWidths[i];
        }
        currentY += 8;
        
        // Draw data rows
        doc.setFont("helvetica", "normal");
        let rowColor = false;
        
        for (let i = 0; i < Math.min(kitItems.length, 20); i++) { // Limit to 20 rows
          const item = kitItems[i];
          
          if (rowColor) {
            doc.setFillColor(240, 248, 255);
            doc.rect(startX, currentY, 180, 8, 'F');
          }
          rowColor = !rowColor;
          
          const unit = item.unit === 'quantity' ? '' : safeFormatText(item.unit || '');
          const progress = safeCalculatePercentage(
            Number(item.currentAmount || 0), 
            Number(item.recommendedAmount || 1)
          );
          
          xPos = startX + 2;
          doc.text(safeFormatText(item.category), xPos, currentY + 5.5);
          xPos += columnWidths[0];
          
          doc.text(safeFormatText(item.name), xPos, currentY + 5.5);
          xPos += columnWidths[1];
          
          doc.text(`${safeFormatText(item.recommendedAmount)} ${unit}`, xPos, currentY + 5.5);
          xPos += columnWidths[2];
          
          doc.text(`${safeFormatText(item.currentAmount)} ${unit}`, xPos, currentY + 5.5);
          xPos += columnWidths[3];
          
          doc.text(`${progress}%`, xPos, currentY + 5.5);
          xPos += columnWidths[4];
          
          doc.text(getStatusText(Number(item.currentAmount || 0), Number(item.recommendedAmount || 0)), xPos, currentY + 5.5);
          
          currentY += 8;
          
          // Check if we need a new page
          if (currentY > doc.internal.pageSize.height - 20) {
            doc.addPage();
            currentY = 20;
          }
        }
        
        yPos = currentY + 5;
      } else {
        doc.text("No emergency kit items found.", 20, yPos);
        yPos += 10;
      }
    } catch (tableErr) {
      console.error("Error creating emergency kit table:", tableErr);
      doc.setTextColor(255, 0, 0);
      doc.text("Could not generate emergency kit table due to an error.", 20, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 10;
    }

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
    doc.text(`■ Fully Prepared Categories: ${statusCounts?.complete || 0}`, 20, yPos);
    yPos += 6;
    
    doc.text(`■ In Progress Categories: ${statusCounts?.inProgress || 0}`, 20, yPos);
    yPos += 6;
    
    doc.text(`■ Not Started Categories: ${statusCounts?.notStarted || 0}`, 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.text(`Your Overall Readiness Score: ${isNaN(overallScore) ? 0 : overallScore}%`, 20, yPos);
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
    // Create a simple error PDF rather than failing completely
    try {
      const errorDoc = new jsPDF();
      errorDoc.setFontSize(16);
      errorDoc.setTextColor(255, 0, 0);
      errorDoc.text("Error Generating Complete Report", 105, 20, { align: "center" });
      
      errorDoc.setFontSize(12);
      errorDoc.setTextColor(0, 0, 0);
      errorDoc.text("We encountered an error while generating your full report.", 105, 40, { align: "center" });
      errorDoc.text("Please try again or contact support if the issue persists.", 105, 50, { align: "center" });
      
      const dateGenerated = new Date().toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      });
      errorDoc.setFontSize(10);
      errorDoc.text(`Date: ${dateGenerated}`, 105, 70, { align: "center" });
      
      return errorDoc;
    } catch (fallbackError) {
      console.error("Failed to create even error document:", fallbackError);
      throw new Error("Failed to generate PDF report");
    }
  }
};

// Helper function to get status text
const getStatusText = (current: number, recommended: number): string => {
  if (isNaN(current) || isNaN(recommended)) return "N/A";
  if (recommended === 0) return "N/A";
  const percentage = (current / recommended) * 100;
  if (percentage >= 100) return "Complete";
  if (percentage > 0) return "In Progress";
  return "Not Started";
};
