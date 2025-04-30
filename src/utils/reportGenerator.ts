
import { SupplyItem } from "../contexts/SupplyContext";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Extend jsPDF with autoTable plugin
declare module "jspdf" {
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

  // Section 1: Long-Term Food Storage
  doc.setFontSize(16);
  doc.text("Section 1: Long-Term Food Storage Overview", 20, 55);
  
  doc.setFontSize(10);
  doc.text(
    "Based on your family's selected size and our recommended yearly supply guidelines, here is your current food storage status.",
    20,
    65
  );
  
  // Food storage data table
  const foodData = foodItems.map(item => [
    item.category,
    item.name,
    `${item.recommendedAmount} ${item.unit}`,
    `${item.currentAmount} ${item.unit}`,
    `${Math.min(Math.floor((item.currentAmount / item.recommendedAmount) * 100), 100)}%`,
    getStatusText(item.currentAmount, item.recommendedAmount)
  ]);
  
  doc.autoTable({
    startY: 70,
    head: [["Category", "Item", "Recommended", "You Have", "Progress", "Status"]],
    body: foodData,
    headStyles: { fillColor: [176, 196, 222] },
    alternateRowStyles: { fillColor: [240, 248, 255] },
    margin: { top: 70 }
  });

  // Top Priority Suggestions
  const priorityNames = priorities
    .filter(item => item.type === 'food')
    .map(item => item.name)
    .join(", ");
  
  if (priorityNames) {
    doc.text(`Top Priority Suggestions: ${priorityNames}`, 20, doc.autoTable.previous.finalY + 10);
  }

  // Section 2: 72-Hour Emergency Kit
  doc.setFontSize(16);
  doc.text("Section 2: 72-Hour Emergency Kit", 20, doc.autoTable.previous.finalY + 25);
  
  doc.setFontSize(10);
  doc.text("Here's how your short-term emergency supply is shaping up.", 20, doc.autoTable.previous.finalY + 10);
  
  // Kit data table
  const kitData = kitItems.map(item => [
    item.category,
    item.name,
    `${item.recommendedAmount} ${item.unit === 'quantity' ? '' : item.unit}`,
    `${item.currentAmount} ${item.unit === 'quantity' ? '' : item.unit}`,
    `${Math.min(Math.floor((item.currentAmount / item.recommendedAmount) * 100), 100)}%`,
    getStatusText(item.currentAmount, item.recommendedAmount)
  ]);
  
  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 15,
    head: [["Category", "Item", "Recommended", "You Have", "Progress", "Status"]],
    body: kitData,
    headStyles: { fillColor: [176, 196, 222] },
    alternateRowStyles: { fillColor: [240, 248, 255] },
    margin: { top: doc.autoTable.previous.finalY + 15 }
  });

  // Section 3: Summary
  doc.setFontSize(16);
  doc.text("Section 3: Summary", 20, doc.autoTable.previous.finalY + 25);
  
  doc.setFontSize(10);
  doc.text(`■ Fully Prepared Categories: ${statusCounts.complete}`, 20, doc.autoTable.previous.finalY + 10);
  doc.text(`■ In Progress Categories: ${statusCounts.inProgress}`, 20, doc.autoTable.previous.finalY + 15);
  doc.text(`■ Not Started Categories: ${statusCounts.notStarted}`, 20, doc.autoTable.previous.finalY + 20);
  
  doc.text(`Your Overall Readiness Score: ${overallScore}%`, 20, doc.autoTable.previous.finalY + 30);
  
  doc.text(
    "You're making great progress! Focus on the high-need items above to strengthen your family's readiness.",
    20,
    doc.autoTable.previous.finalY + 40
  );

  // Save the PDF
  return doc;
};

// Helper function to get status text
const getStatusText = (current: number, recommended: number): string => {
  const percentage = (current / recommended) * 100;
  if (percentage >= 100) return "Complete";
  if (percentage > 0) return "In Progress";
  return "Not Started";
};
