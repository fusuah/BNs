import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import ChildrenNutritionData from "@/model/ChildrenNutritionData";
import GenerateReport from "@/model/GenerateReport";
import fs from 'fs';
import path from 'path';

/* ---------------------------------------------
   CELL MAP – EXACT TEMPLATE COORDINATES
---------------------------------------------- */

const ROW_MAP = {
  "WFA - Normal": 17,
  "WFA - Ob": 18,
  "WFA - OW": 19,
  "WFA - MUW": 20,
  "WFA - SUW": 21,

  "L/HFA - Normal": 22,
  "L/HFA - Tall": 23,
  "L/HFA - MSt": 24,
  "L/HFA - SSt": 25,

  "WFL/H - Normal": 26,
  "WFL/H - OW": 27,
  "WFL/H - Ob": 28,
  "WFL/H - MW/MAM": 29,
  "WFL/H - SW/SAM": 30,

  "MUAC - Normal": 31,
  "MUAC - MW/MAM": 32,
  "MUAC - SW/SAM": 33,
};

const AGE_COL_MAP = {
  "0-5": ["B", "C", "D"],
  "6-11": ["E", "F", "G"],
  "12-23": ["H", "I", "J"],
  "24-35": ["K", "L", "M"],
  "36-47": ["N", "O", "P"],
  "48-59": ["Q", "R", "S"],
};

export async function GET(req) {
  // 1. Dependency Check
  let ExcelJS;
  try {
    ExcelJS = require('exceljs');
  } catch (e) {
    return NextResponse.json(
      { message: "Server Error: 'exceljs' is missing. Run 'npm install exceljs' in your terminal." },
      { status: 500 }
    );
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const barangay = searchParams.get("barangay");
    const reportType = searchParams.get("reportType"); // "OPT Plus Form 1B" or "OPT Plus Form 2B"
    
    const isGenerationRequest = (month && month !== "All") || (barangay && barangay !== "All") || reportType;

    if (isGenerationRequest) {
        // Fetch ALL records
        const allChildren = await ChildrenNutritionData.find({}).lean();

        // ------------------------------------------------------------
        // Logic for OPT Consolidated (Form 2B)
        // ------------------------------------------------------------
        if (reportType === "OPT Plus Form 2B") {
            
            // --- 1. STATISTICS AGGREGATION ---
            
            // Initialize Stats Structure
            const stats = {};
            Object.keys(ROW_MAP).forEach(label => {
                stats[label] = {};
                Object.keys(AGE_COL_MAP).forEach(ag => {
                    stats[label][ag] = { M: 0, F: 0 };
                });
            });

            let totalChildrenMeasured = 0;
            let totalBoys = 0;
            let totalGirls = 0;

            allChildren.forEach(child => {
                // Filter Barangay
                if (barangay && barangay !== "All") {
                    const childAddress = (child.address || child.barangay || "").toLowerCase();
                    if (!childAddress.includes(barangay.toLowerCase())) return;
                }

                // Get Best Entry for Month
                if (Array.isArray(child.information) && child.information.length > 0) {
                    let bestEntry = null;
                    let bestDate = null;

                    child.information.forEach(infoString => {
                        try {
                            const info = typeof infoString === 'string' ? JSON.parse(infoString) : infoString;
                            if (!info.date) return;
                            const entryDate = new Date(info.date);
                            if (isNaN(entryDate.getTime())) return;

                            let matchMonth = true;
                            if (month && month !== "All") {
                                const recordMonthName = entryDate.toLocaleString('en-US', { month: 'long' });
                                if (recordMonthName.toLowerCase() !== month.toLowerCase()) matchMonth = false;
                            }

                            if (matchMonth) {
                                if (!bestDate || entryDate > bestDate) {
                                    bestDate = entryDate;
                                    bestEntry = info;
                                }
                            }
                        } catch (err) {}
                    });

                    if (bestEntry) {
                        totalChildrenMeasured++;
                        const sex = (child.sex || child.gender || "").toLowerCase().startsWith("m") ? "M" : "F";
                        if (sex === "M") totalBoys++; else totalGirls++;
                        
                        // Calculate Age in Months
                        let ageInMonths = 0;
                        // Handle inconsistent naming: birthDate (schema) vs dateOfBirth (legacy)
                        const dobRaw = child.birthDate || child.dateOfBirth;
                        
                        if (dobRaw && bestEntry.date) {
                            const dob = new Date(dobRaw);
                            const measured = new Date(bestEntry.date);
                            const diffTime = measured - dob;
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            ageInMonths = Math.floor(diffDays / 30.44);
                        }

                        // Determine Age Group
                        let ag = "";
                        if (ageInMonths >= 0 && ageInMonths <= 5) ag = "0-5";
                        else if (ageInMonths >= 6 && ageInMonths <= 11) ag = "6-11";
                        else if (ageInMonths >= 12 && ageInMonths <= 23) ag = "12-23";
                        else if (ageInMonths >= 24 && ageInMonths <= 35) ag = "24-35";
                        else if (ageInMonths >= 36 && ageInMonths <= 47) ag = "36-47";
                        else if (ageInMonths >= 48 && ageInMonths <= 59) ag = "48-59";

                        if (!ag) return; // Skip if out of range

                        const statusRaw = (bestEntry.status || "").toLowerCase();

                        // --- Status Mapping ---
                        const mapStatus = (target, search) => {
                            if (statusRaw.includes(search)) stats[target][ag][sex]++;
                        };

                        // WFA
                        mapStatus("WFA - SUW", "severely underweight");
                        mapStatus("WFA - MUW", "underweight");
                        if (!statusRaw.includes("underweight")) mapStatus("WFA - Normal", "normal"); 
                        mapStatus("WFA - OW", "overweight");
                        mapStatus("WFA - Ob", "obese");

                        // L/HFA (Stunting)
                        mapStatus("L/HFA - SSt", "severely stunted");
                        mapStatus("L/HFA - MSt", "stunted");
                        mapStatus("L/HFA - Tall", "tall");
                        if (!statusRaw.includes("stunted") && !statusRaw.includes("tall")) mapStatus("L/HFA - Normal", "normal");

                        // WFL/H (Wasting)
                        mapStatus("WFL/H - SW/SAM", "severely wasted");
                        mapStatus("WFL/H - MW/MAM", "wasted");
                        mapStatus("WFL/H - Ob", "obese");
                        mapStatus("WFL/H - OW", "overweight");
                        if (!statusRaw.includes("wasted") && !statusRaw.includes("obese") && !statusRaw.includes("overweight")) mapStatus("WFL/H - Normal", "normal");

                        // MUAC
                        mapStatus("MUAC - Normal", "normal");
                    }
                }
            });

            // --- 2. EXCEL GENERATION (USING TEMPLATE) ---
            const workbook = new ExcelJS.Workbook();
            const templatePath = path.join(process.cwd(), "public/templates/OPT_Plus_Form_2B.xlsx");
            
            // Check if template exists
            if (fs.existsSync(templatePath)) {
                await workbook.xlsx.readFile(templatePath);
            } else {
                // Fallback: Create a basic sheet if template is missing (to prevent crash)
                const ws = workbook.addWorksheet("OPT Plus Form 2B");
                ws.getCell("A1").value = "Template Not Found: Please upload public/templates/OPT_Plus_Form_2B.xlsx";
            }

            const worksheet = workbook.getWorksheet(1); // Get first sheet

            if (worksheet) {
                // --- METADATA ---
                worksheet.getCell("T10").value = totalChildrenMeasured;
                worksheet.getCell("C14").value = totalBoys;
                worksheet.getCell("E14").value = totalGirls;

                // --- WRITE DATA TO TEMPLATE ---
                Object.entries(stats).forEach(([label, ages]) => {
                    const row = ROW_MAP[label];
                    if (!row) return;

                    Object.entries(ages).forEach(([ag, v]) => {
                        const [mCol, fCol, tCol] = AGE_COL_MAP[ag];
                        
                        // Use existing value or 0
                        const currentM = worksheet.getCell(`${mCol}${row}`).value;
                        const currentF = worksheet.getCell(`${fCol}${row}`).value;
                        const currentT = worksheet.getCell(`${tCol}${row}`).value;

                        worksheet.getCell(`${mCol}${row}`).value = (Number(currentM) || 0) + v.M;
                        worksheet.getCell(`${fCol}${row}`).value = (Number(currentF) || 0) + v.F;
                        worksheet.getCell(`${tCol}${row}`).value = (Number(currentT) || 0) + v.M + v.F;
                    });
                });
            }

            const buffer = await workbook.xlsx.writeBuffer();
            return new NextResponse(buffer, {
              headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="OPT_Plus_Form_2B_${month || 'All'}.xlsx"`,
              },
            });

        } 
        
        // ------------------------------------------------------------
        // Logic for Form 1B (Individual List)
        // ------------------------------------------------------------
        else {
            const excelRows = [];

            allChildren.forEach(child => {
                if (barangay && barangay !== "All") {
                    const childAddress = (child.address || child.barangay || "").toLowerCase();
                    if (!childAddress.includes(barangay.toLowerCase())) return;
                }

                if (Array.isArray(child.information) && child.information.length > 0) {
                    let bestEntry = null;
                    let bestDate = null;

                    child.information.forEach(infoString => {
                        try {
                            const info = typeof infoString === 'string' ? JSON.parse(infoString) : infoString;
                            if (!info.date) return;
                            const entryDate = new Date(info.date);
                            if (isNaN(entryDate.getTime())) return;

                            let matchMonth = true;
                            if (month && month !== "All") {
                                const recordMonthName = entryDate.toLocaleString('en-US', { month: 'long' });
                                if (recordMonthName.toLowerCase() !== month.toLowerCase()) matchMonth = false;
                            }

                            if (matchMonth) {
                                if (!bestDate || entryDate > bestDate) {
                                    bestDate = entryDate;
                                    bestEntry = info;
                                }
                            }
                        } catch (err) {}
                    });

                    if (bestEntry) {
                        // Normalize fields: Check common variations
                        const childName = child.fullName || child.childName || child.name || "Unknown";
                        const childSex = child.sex || child.gender || "-";
                        
                        // NEW: Capture Mother Name
                        const motherName = child.mother || "-";

                        // Check updated schema field first (birthDate), then legacy (dateOfBirth)
                        const childDobRaw = child.birthDate || child.dateOfBirth || child.dob || child.birthday;
                        const childAddress = child.address || child.barangay || "-";

                        // NEW: Capture IP, Disability, Edema
                        const isIndigenous = child.isIndigenous ? "Yes" : "No";
                        const hasDisability = child.hasDisability ? "Yes" : "No";
                        const hasEdema = bestEntry.hasEdema ? "Yes" : "No";

                        let ageInMonths = "-";
                        if (childDobRaw && bestEntry.date) {
                            const dob = new Date(childDobRaw);
                            const measured = new Date(bestEntry.date);
                            const diffTime = measured - dob;
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            ageInMonths = Math.floor(diffDays / 30.44);
                        }

                        excelRows.push({
                            name: childName,
                            sex: childSex,
                            dob: childDobRaw ? new Date(childDobRaw).toLocaleDateString() : "-",
                            dateMeasured: bestEntry.date ? new Date(bestEntry.date).toLocaleDateString() : "-",
                            weight: bestEntry.weightKg || "-",
                            height: bestEntry.heightCm || "-",
                            age: ageInMonths,
                            status: bestEntry.status || "-",
                            barangay: childAddress,
                            // NEW FIELDS
                            mother: motherName,
                            ip: isIndigenous,
                            disability: hasDisability,
                            edema: hasEdema
                        });
                    }
                }
            });

            if (excelRows.length === 0) {
                return NextResponse.json(
                    { message: `No measurements found for ${month || 'All Months'} in ${barangay || 'All Barangays'}.` }, 
                    { status: 404 }
                );
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Consolidated Report");

            // Updated Columns to include new data
            worksheet.columns = [
              { header: "Seq", key: "seq", width: 5 },
              { header: "Name of Child", key: "name", width: 25 },
              { header: "Sex", key: "sex", width: 8 },
              { header: "Date of Birth", key: "dob", width: 15 },
              { header: "Date Measured", key: "dateMeasured", width: 15 },
              { header: "Weight (kg)", key: "weight", width: 12 },
              { header: "Height (cm)", key: "height", width: 12 },
              { header: "Age (mos)", key: "age", width: 10 },
              { header: "Status", key: "status", width: 20 },
              { header: "Address", key: "barangay", width: 25 },
              // NEW HEADERS
              { header: "Mother", key: "mother", width: 25 },
              { header: "IP", key: "ip", width: 8 },
              { header: "Disability", key: "disability", width: 10 },
              { header: "Edema", key: "edema", width: 8 },
            ];

            const headerRow = worksheet.getRow(1);
            headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };

            excelRows.forEach((row, index) => {
                worksheet.addRow({ seq: index + 1, ...row });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            return new NextResponse(buffer, {
              headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="Consolidated_Report_Form1B.xlsx"`,
              },
            });
        }

    } else {
        const reports = await GenerateReport.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json(reports, { status: 200 });
    }

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}