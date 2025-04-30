import { SupplyItem } from "../contexts/SupplyContext";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

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
    doc.setFontSize(24);
    doc.text("Family Readiness Report", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text("A personalized snapshot of your emergency and long-term preparedness", 105, 30, { align: "center" });
    
    doc.setFontSize(10);
    doc.text(`Date Generated: ${dateGenerated}`, 20, 40);
    doc.text("Prepared For: Your Household", 20, 45);

    let yPos = 55;

    // Section 1: Long-Term Food Storage
    doc.setFontSize(16);
    doc.text("Section 1: Long-Term Food Storage Overview", 20, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.text(
      "Based on your family's selected size and our recommended yearly supply guidelines, here is your current food storage status.",
      20,
      yPos
    );
    yPos += 10;
    
    // Food storage data table
    const foodData = foodItems.length > 0 ? foodItems.map(item => [
      item.category,
      item.name,
      `${item.recommendedAmount} ${item.unit}`,
      `${item.currentAmount} ${item.unit}`,
      `${Math.min(Math.floor((item.currentAmount / item.recommendedAmount) * 100), 100)}%`,
      getStatusText(item.currentAmount, item.recommendedAmount)
    ]) : [["No data", "", "", "", "", ""]];
    
    // Only add table if we have food items
    doc.autoTable({
      head: [["Category", "Item", "Recommended", "You Have", "Progress", "Status"]],
      body: foodData,
      startY: yPos,
      headStyles: { fillColor: [176, 196, 222] },
      alternateRowStyles: { fillColor: [240, 248, 255] },
      margin: { top: yPos }
    });
    
    // Get the final Y position after the table
    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Top Priority Suggestions
    if (priorities.length > 0) {
      const priorityNames = priorities
        .filter(item => item.type === 'food')
        .map(item => item.name)
        .join(", ");
      
      if (priorityNames) {
        doc.text(`Top Priority Suggestions: ${priorityNames}`, 20, yPos);
        yPos += 15;
      } else {
        yPos += 5;
      }
    } else {
      doc.text("No priority items identified yet.", 20, yPos);
      yPos += 15;
    }

    // Section 2: 72-Hour Emergency Kit
    doc.setFontSize(16);
    doc.text("Section 2: 72-Hour Emergency Kit", 20, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.text("Here's how your short-term emergency supply is shaping up.", 20, yPos);
    yPos += 10;
    
    // Kit data table
    const kitData = kitItems.length > 0 ? kitItems.map(item => [
      item.category,
      item.name,
      `${item.recommendedAmount} ${item.unit === 'quantity' ? '' : item.unit}`,
      `${item.currentAmount} ${item.unit === 'quantity' ? '' : item.unit}`,
      `${Math.min(Math.floor((item.currentAmount / item.recommendedAmount) * 100), 100)}%`,
      getStatusText(item.currentAmount, item.recommendedAmount)
    ]) : [["No data", "", "", "", "", ""]];
    
    doc.autoTable({
      head: [["Category", "Item", "Recommended", "You Have", "Progress", "Status"]],
      body: kitData,
      startY: yPos,
      headStyles: { fillColor: [176, 196, 222] },
      alternateRowStyles: { fillColor: [240, 248, 255] },
      margin: { top: yPos }
    });
    
    // Get the final Y position after the table
    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Section 3: Summary
    doc.setFontSize(16);
    doc.text("Section 3: Summary", 20, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.text(`■ Fully Prepared Categories: ${statusCounts.complete}`, 20, yPos);
    yPos += 5;
    
    doc.text(`■ In Progress Categories: ${statusCounts.inProgress}`, 20, yPos);
    yPos += 5;
    
    doc.text(`■ Not Started Categories: ${statusCounts.notStarted}`, 20, yPos);
    yPos += 10;
    
    doc.text(`Your Overall Readiness Score: ${overallScore}%`, 20, yPos);
    yPos += 10;
    
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
