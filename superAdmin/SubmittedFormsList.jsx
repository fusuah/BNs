"use client";
import { useState, useEffect, useMemo } from "react";
import { FileText, Eye, Calendar, Filter, Trash2, MapPin, X, FileSearch, Clock, FileDown, Loader2, FileBarChart } from "lucide-react";
import toast from "react-hot-toast";

const MONTHS = [
  "All",
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function SubmittedFormsList({ barangayFilter = "All" }) {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");
  const [filterMonth, setFilterMonth] = useState("All");
  const [filterBarangay, setFilterBarangay] = useState(barangayFilter);
  const [deletingId, setDeletingId] = useState(null);
  const [viewingForm, setViewingForm] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [generatingConsolidated, setGeneratingConsolidated] = useState(false);

  // Sync local state if the prop changes
  useEffect(() => {
    setFilterBarangay(barangayFilter);
  }, [barangayFilter]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch("/api/superAdmin/submitted-forms");
        if (res.ok) {
          const data = await res.json();
          setForms(data);
        }
      } catch (error) {
        console.error("Failed to fetch forms", error);
        toast.error("Failed to load submitted forms");
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  const formTypes = useMemo(() => {
    const types = new Set(forms.map((form) => form.formTitle));
    return ["All", ...Array.from(types).sort()];
  }, [forms]);

  const barangayOptions = useMemo(() => {
    const barangays = new Set(
      forms
        .map((form) => form.barangay || form.submittedBy?.barangay)
        .filter((b) => b)
    );
    return ["All", ...Array.from(barangays).sort()];
  }, [forms]);

  const filteredForms = useMemo(() => {
    return forms.filter((form) => {
      const matchesType = filterType === "All" || form.formTitle === filterType;
      const formBarangay = form.barangay || form.submittedBy?.barangay;
      const matchesBarangay = filterBarangay === "All" || formBarangay === filterBarangay;
      
      const submissionDate = new Date(form.submissionDate);
      const submissionMonth = MONTHS[submissionDate.getMonth() + 1];
      const matchesMonth = filterMonth === "All" || submissionMonth === filterMonth;

      return matchesType && matchesBarangay && matchesMonth;
    });
  }, [forms, filterType, filterBarangay, filterMonth]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/superAdmin/submitted-forms?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setForms((prev) => prev.filter((form) => form._id !== id));
        toast.success("Report deleted successfully");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Error deleting report");
    } finally {
      setDeletingId(null);
    }
  };

  const handleGenerateReport = async (type) => {
    // type can be "Form1B" or "Consolidated"
    const isConsolidated = type === "Consolidated";
    const setLoading = isConsolidated ? setGeneratingConsolidated : setGeneratingReport;
    const reportTypeParam = isConsolidated ? "OPT Plus Form 2B" : "OPT Plus Form 1B";
    const fileNamePrefix = isConsolidated ? "OPT_Plus_Form_2B" : "Consolidated_OPT_Plus_Form_1B";

    setLoading(true);
    try {
      const params = {
        reportType: reportTypeParam
      };
      if (filterMonth !== "All") params.month = filterMonth;
      if (filterBarangay !== "All") params.barangay = filterBarangay;
      
      const queryParams = new URLSearchParams(params);

      const res = await fetch(`/api/superAdmin/report/generate?${queryParams}`);
      
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to generate report");
      }

      if (!res.ok) {
        throw new Error(`Server Error: ${res.statusText}`);
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const monthLabel = filterMonth === "All" ? "All_Months" : filterMonth;
      const barangayLabel = filterBarangay === "All" ? "All_Barangays" : filterBarangay;
      a.download = `${fileNamePrefix}_${monthLabel}_${barangayLabel}.xlsx`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success(`${isConsolidated ? "Summary" : "Consolidated"} report generated!`);
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(error.message); 
    } finally {
      setLoading(false);
    }
  };

  const renderFilePreview = (form) => {
    const url = form.fileUrl;
    if (!url) return <div className="text-gray-500 text-center p-8">No file URL provided.</div>;
    const extension = url.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return (
        <div className="flex flex-col items-center gap-4 w-full p-4">
          <img src={url} alt={form.formTitle} className="max-w-full h-auto rounded-lg shadow-lg border" />
          <p className="text-xs text-gray-400">Image Preview</p>
        </div>
      );
    }
    if (extension === 'pdf') {
      return <iframe src={`${url}#toolbar=0&navpanes=0`} className="w-full h-full rounded-lg border-0" title="PDF Viewer" />;
    }
    if (['xlsx', 'xls', 'csv', 'doc', 'docx'].includes(extension)) {
      const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
      return <iframe src={googleViewerUrl} className="w-full h-full rounded-lg border-0 bg-white" title="Document Viewer" />;
    }
    return <iframe src={url} className="w-full h-full rounded-lg border-0" title="File Viewer" />;
  };

  if (loading) return <div className="p-4 text-center text-gray-500">Loading submitted forms...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-col gap-4 bg-gray-50">
        
        {/* Top Row: Title & Buttons */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <FileText size={18} className="text-blue-600" />
            Submitted Reports
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border ml-2">Total: {filteredForms.length}</span>
          </h3>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => handleGenerateReport("Form1B")}
              disabled={generatingReport || generatingConsolidated}
              className={`flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition shadow-sm ${generatingReport ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {generatingReport ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
              {generatingReport ? "Generating..." : "Generate Masterlist (Form 1B)"}
            </button>

            <button 
              onClick={() => handleGenerateReport("Consolidated")}
              disabled={generatingReport || generatingConsolidated}
              className={`flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm ${generatingConsolidated ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {generatingConsolidated ? <Loader2 size={16} className="animate-spin" /> : <FileBarChart size={16} />}
              {generatingConsolidated ? "Generating..." : "Generate OPT Consolidated"}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 w-full">
          <div className="flex items-center gap-2 flex-1 min-w-[200px] sm:flex-none">
            <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><Clock size={14} /> Month:</label>
            <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="w-full pl-3 pr-8 py-1.5 text-sm border rounded-md">
              {MONTHS.map((month) => <option key={month} value={month}>{month}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-[200px] sm:flex-none">
            <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><MapPin size={14} /> Barangay:</label>
            <select value={filterBarangay} onChange={(e) => setFilterBarangay(e.target.value)} className="w-full pl-3 pr-8 py-1.5 text-sm border rounded-md">
              {barangayOptions.map((brgy) => <option key={brgy} value={brgy}>{brgy}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-[200px] sm:flex-none">
            <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><Filter size={14} /> Type:</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full pl-3 pr-8 py-1.5 text-sm border rounded-md">
              {formTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3">Report Title</th>
              <th className="px-4 py-3">Submitted By</th>
              <th className="px-4 py-3">Barangay</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredForms.length === 0 ? (
              <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-400">No reports found.</td></tr>
            ) : (
              filteredForms.map((form) => (
                <tr key={form._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{form.formTitle}</td>
                  <td className="px-4 py-3 text-gray-600">{form.submittedBy?.fullName || "Unknown"}</td>
                  <td className="px-4 py-3 text-gray-600">{form.barangay || form.submittedBy?.barangay}</td>
                  <td className="px-4 py-3 text-gray-500"><div className="flex items-center gap-1"><Calendar size={12} />{new Date(form.submissionDate).toLocaleDateString()}</div></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setViewingForm(form)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-xs font-medium"><Eye size={14} /> View</button>
                      <button onClick={() => handleDelete(form._id)} disabled={deletingId === form._id} className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 text-xs font-medium"><Trash2 size={14} /> Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {viewingForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">{viewingForm.formTitle}</h3>
              <button onClick={() => setViewingForm(null)}><X size={20} /></button>
            </div>
            <div className="flex-1 bg-gray-200 overflow-auto flex items-center justify-center p-4 relative">
              <div className="w-full h-full max-w-4xl bg-white rounded shadow-sm flex items-center justify-center">
                {renderFilePreview(viewingForm)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}