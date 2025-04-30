import { SupplyItem } from "../contexts/SupplyContext";
import { jsPDF } from "jspdf";
// Import autoTable directly (fix for missing autoTable function)
import autoTable from 'jspdf-autotable';

// Add the autoTable method to the jsPDF instance
jsPDF.prototype.autoTable = autoTable;

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
    const dateGenerated = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    // Add header
    doc.setFontSize(22);
    doc.text("Family Readiness Report", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text("A personalized snapshot of your emergency and long-term preparedness", 105, 30, { align: "center" });
    
    doc.setFontSize(10);
    doc.text(`Date Generated: ${dateGenerated}`, 20, 40);
    doc.text("Prepared For: Your Household", 20, 45);

    let yPos = 50; // Starting position closer to the top

    // Section 1: Long-Term Food Storage
    doc.setFontSize(14);
    doc.text("Section 1: Long-Term Food Storage Overview", 20, yPos);
    yPos += 8; // Reduced spacing
    
    doc.setFontSize(10);
    doc.text(
      "Based on your family's selected size and our recommended yearly supply guidelines, here is your current food storage status.",
      20,
      yPos
    );
    yPos += 6; // Reduced spacing
    
    // Food storage data table with improved continuous table handling
    const foodData = foodItems.length > 0 ? foodItems.map(item => [
      item.category,
      item.name,
      `${item.recommendedAmount} ${item.unit}`,
      `${item.currentAmount} ${item.unit}`,
      `${Math.min(Math.floor((item.currentAmount / item.recommendedAmount) * 100), 100)}%`,
      getStatusText(item.currentAmount, item.recommendedAmount)
    ]) : [["No data", "-", "-", "-", "-", "-"]];

    // Group food items by category to break the table at logical points
    const groupedFoodItems = {};
    foodItems.forEach(item => {
      if (!groupedFoodItems[item.category]) {
        groupedFoodItems[item.category] = [];
      }
      groupedFoodItems[item.category].push(item);
    });
    
    // Use autoTable directly with optimized spacing and better pagination control
    autoTable(doc, {
      head: [["Category", "Item", "Recommended", "You Have", "Progress", "Status"]],
      body: foodData,
      startY: yPos,
      headStyles: { fillColor: [176, 196, 222] },
      alternateRowStyles: { fillColor: [240, 248, 255] },
      margin: { top: yPos },
      styles: { cellPadding: 2 }, // Reduced cell padding
      showHead: 'firstPage', // Show header on first page only
      pageBreak: 'avoid', // Avoid breaking rows across pages if possible
      didDrawPage: (data) => {
        // Add page number at the bottom
        doc.setFontSize(8);
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
        }
      }
    });
    
    // Get the final Y position after the table
    yPos = (doc as any).lastAutoTable.finalY + 5; // Reduced spacing after table

    // Top Priority Suggestions
    if (priorities.length > 0) {
      const foodPriorities = priorities.filter(item => item.type === 'food');
      if (foodPriorities.length > 0) {
        const priorityNames = foodPriorities.map(item => item.name).join(", ");
        doc.text(`Top Priority Suggestions: ${priorityNames}`, 20, yPos);
        yPos += 8; // Reduced spacing
      } else {
        yPos += 3; // Even less spacing if no priorities
      }
    } else {
      doc.text("No priority items identified yet.", 20, yPos);
      yPos += 8; // Reduced spacing
    }

    // Section 2: 72-Hour Emergency Kit
    doc.setFontSize(14);
    doc.text("Section 2: 72-Hour Emergency Kit", 20, yPos);
    yPos += 8; // Reduced spacing
    
    doc.setFontSize(10);
    doc.text("Here's how your short-term emergency supply is shaping up.", 20, yPos);
    yPos += 6; // Reduced spacing
    
    // Kit data table with improved continuous table handling
    const kitData = kitItems.length > 0 ? kitItems.map(item => [
      item.category,
      item.name,
      `${item.recommendedAmount} ${item.unit === 'quantity' ? '' : item.unit}`,
      `${item.currentAmount} ${item.unit === 'quantity' ? '' : item.unit}`,
      `${Math.min(Math.floor((item.currentAmount / item.recommendedAmount) * 100), 100)}%`,
      getStatusText(item.currentAmount, item.recommendedAmount)
    ]) : [["No data", "-", "-", "-", "-", "-"]];
    
    // Group kit items by category 
    const groupedKitItems = {};
    kitItems.forEach(item => {
      if (!groupedKitItems[item.category]) {
        groupedKitItems[item.category] = [];
      }
      groupedKitItems[item.category].push(item);
    });

    // Use autoTable directly with optimized spacing
    autoTable(doc, {
      head: [["Category", "Item", "Recommended", "You Have", "Progress", "Status"]],
      body: kitData,
      startY: yPos,
      headStyles: { fillColor: [176, 196, 222] },
      alternateRowStyles: { fillColor: [240, 248, 255] },
      margin: { top: yPos },
      styles: { cellPadding: 2 }, // Reduced cell padding
      pageBreak: 'avoid', // Avoid breaking rows across pages if possible
      showHead: 'everyPage', // Show header on every page
    });
    
    // Get the final Y position after the table
    yPos = (doc as any).lastAutoTable.finalY + 8; // Spacing after table

    // Check if we need to add a page for the summary
    if (yPos > doc.internal.pageSize.height - 60) {
      doc.addPage();
      yPos = 20;
    }

    // Section 3: Summary
    doc.setFontSize(14);
    doc.text("Section 3: Summary", 20, yPos);
    yPos += 8; // Reduced spacing
    
    doc.setFontSize(10);
    doc.text(`■ Fully Prepared Categories: ${statusCounts.complete}`, 20, yPos);
    yPos += 5;
    
    doc.text(`■ In Progress Categories: ${statusCounts.inProgress}`, 20, yPos);
    yPos += 5;
    
    doc.text(`■ Not Started Categories: ${statusCounts.notStarted}`, 20, yPos);
    yPos += 8; // Slightly larger spacing before overall score
    
    doc.setFontSize(12); // Slightly larger font for the score
    doc.text(`Your Overall Readiness Score: ${overallScore}%`, 20, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.text(
      "You're making great progress! Focus on the high-need items above to strengthen your family's readiness.",
      20,
      yPos
    );

    // Save the PDF
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
