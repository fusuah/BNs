"use client";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { Upload, FileText, CheckCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase"; // Import Supabase client

export default function FormUploadWidget() {
  const { id: userId, barangay } = useAuth();
  const [file, setFile] = useState(null);
  
  // Use category instead of direct title input for filtering
  const [category, setCategory] = useState("");
  const [customTitle, setCustomTitle] = useState(""); 
  
  const [loading, setLoading] = useState(false);

  const reportCategories = [
    "Monthly Weighing Report",
    "Quarterly Narrative Report",
    "BNS Accomplishment Report",
    "Nutrition Action Plan",
    "Feedback Report",
    "Inventory Report",
    "Others"
  ];

  const handleUpload = async (e) => {
    e.preventDefault();
    
    // Determine the final title
    const finalTitle = category === "Others" ? customTitle : category;

    if (!file || !finalTitle) return toast.error("Please provide a category and file");

    setLoading(true);
    try {
      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`; // Organize by userId

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('Report-Form') // Bucket name provided by user
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('Report-Form')
        .getPublicUrl(filePath);

      // 3. Save metadata to MongoDB via API
      const res = await fetch("/api/bnsUsers/submit-form", {
        method: "POST",
        body: JSON.stringify({
          formTitle: finalTitle,
          submittedBy: userId,
          barangay: barangay || "Unknown",
          fileUrl: publicUrl // Store the Supabase URL
        }),
      });

      if (res.ok) {
        toast.success("Form submitted successfully!");
        setFile(null);
        setCategory("");
        setCustomTitle("");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Submission failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
        <Upload size={16} className="text-orange-500" /> Upload Report
      </h3>

      <form onSubmit={handleUpload} className="space-y-3 flex-1 flex flex-col">
        {/* Category Dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:border-orange-500"
        >
          <option value="" disabled>Select Report Category</option>
          {reportCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Custom Title Input (Only if 'Others' is selected) */}
        {category === "Others" && (
          <input
            type="text"
            placeholder="Specify Report Title"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:border-orange-500 animate-in fade-in slide-in-from-top-1"
          />
        )}

        <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-3 text-center hover:bg-gray-50 transition cursor-pointer flex-1 flex flex-col justify-center items-center group">
          <input 
            type="file" 
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" // Expanded accepted types for reports
            onChange={(e) => setFile(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={loading}
          />
          <div className="flex flex-col items-center justify-center text-gray-400">
              {file ? (
                <div className="flex flex-col items-center gap-2 text-green-600 relative z-20">
                  <CheckCircle size={24} />
                  <span className="text-xs truncate max-w-[150px] font-medium">{file.name}</span>
                  <button 
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent opening file dialog
                        e.preventDefault();
                        clearFile();
                    }}
                    className="text-red-400 hover:text-red-600 text-[10px] flex items-center gap-1 mt-1 px-2 py-1 bg-red-50 rounded-full"
                  >
                    <X size={10} /> Remove
                  </button>
                </div>
              ) : (
                <>
                  <FileText size={24} className="mb-2 group-hover:text-orange-400 transition-colors" />
                  <span className="text-[10px] uppercase font-bold text-gray-500 group-hover:text-gray-700">Click to attach file</span>
                  <span className="text-[9px] text-gray-400 mt-1">PDF, Images, Docs</span>
                </>
              )}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full font-medium py-2 rounded text-xs mt-1 transition-colors ${loading ? 'bg-orange-300 cursor-not-allowed text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
        >
          {loading ? "UPLOADING..." : "SUBMIT REPORT"}
        </button>
      </form>
    </div>
  );
}