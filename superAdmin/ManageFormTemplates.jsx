"use client";
import { useState } from "react";
// Changed from "@/service/forms/formsApiSlice" to relative path to fix build error
import { useAddFormMutation, useGetFormsQuery } from "../../service/forms/formsApiSlice";
import { Plus, Link as LinkIcon, FileText, Trash2, Pencil, ExternalLink, Maximize2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ManageFormTemplates() {
  const { data: forms, isLoading, refetch } = useGetFormsQuery();
  const [addForm, { isLoading: isAdding }] = useAddFormMutation();
  // Assuming you might add update/delete mutations later to your slice
  // const [deleteForm] = useDeleteFormMutation(); 
  // const [updateForm] = useUpdateFormMutation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState(null); // Track which form is being edited

  const [formData, setFormData] = useState({
    formName: "",
    formDescription: "",
    embeddedLink: "",
    mdeText: "",
    formType: "BNAP"
  });

  const handleOpenAdd = () => {
    setEditingForm(null);
    setFormData({ formName: "", formDescription: "", embeddedLink: "", mdeText: "", formType: "BNAP" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (form) => {
    setEditingForm(form);
    setFormData({
      formName: form.formName,
      formDescription: form.formDescription,
      embeddedLink: form.embeddedLink,
      mdeText: form.mdeText,
      formType: form.formType || "BNAP"
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingForm) {
        // Logic for Update (Need to implement updateForm in slice)
        // await updateForm({ id: editingForm._id, ...formData }).unwrap();
        toast.success("Form updated! (Mock)");
      } else {
        await addForm(formData).unwrap();
        toast.success("Form template added successfully!");
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to save form");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
      if(confirm("Are you sure you want to delete this template?")) {
          // await deleteForm(id).unwrap();
          toast.success("Form deleted! (Mock)");
          refetch();
      }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">Form Templates</h3>
        <button 
          onClick={handleOpenAdd}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-green-700"
        >
          <Plus size={16} /> Add New Template
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading templates...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms?.data?.map((form) => (
            <div key={form._id} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-gray-50 relative group">
              <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900 truncate pr-2">{form.formName}</h4>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full whitespace-nowrap">{form.formType}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2 h-8">{form.formDescription || "No description"}</p>
              
              <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 p-2 rounded truncate mb-2">
                 <LinkIcon size={12} className="shrink-0" /> 
                 <a href={form.embeddedLink} target="_blank" rel="noreferrer" className="truncate hover:underline">
                   Link
                 </a>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-gray-200">
                  <button 
                    onClick={() => handleOpenEdit(form)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit"
                  >
                      <Pencil size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(form._id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                      <Trash2 size={14} />
                  </button>
              </div>
            </div>
          ))}
          
          {(!forms?.data || forms.data.length === 0) && (
              <div className="col-span-full py-12 text-center text-gray-400 border-2 border-dashed rounded-lg">
                  <FileText size={48} className="mx-auto mb-2 opacity-20" />
                  <p>No templates found.</p>
                  <p className="text-xs">Click "Add New Template" to create one.</p>
              </div>
          )}
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          {/* Increased max-width to 6xl and height handling */}
          <div className="bg-white p-6 rounded-lg w-full max-w-6xl shadow-xl max-h-[95vh] overflow-y-auto flex flex-col">
            <h3 className="text-xl font-bold mb-4">{editingForm ? "Edit Template" : "Add Template"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Form Name <span className="text-red-500">*</span></label>
                  <input 
                    className="w-full border p-2 rounded text-sm" 
                    value={formData.formName}
                    onChange={e => setFormData({...formData, formName: e.target.value})}
                    required
                    placeholder="e.g. Monthly Weighing Report"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input 
                    className="w-full border p-2 rounded text-sm" 
                    value={formData.formDescription}
                    onChange={e => setFormData({...formData, formDescription: e.target.value})}
                    placeholder="Brief description..."
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Embed Link (Google Sheet/Doc) <span className="text-red-500">*</span></label>
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                    <input 
                      className="flex-1 border p-2 rounded text-sm" 
                      placeholder="https://docs.google.com/spreadsheets/..."
                      value={formData.embeddedLink}
                      onChange={e => setFormData({...formData, embeddedLink: e.target.value})}
                      required
                    />
                    <div className="flex gap-2">
                      <a 
                        href="https://sheets.new" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="shrink-0 bg-green-50 text-green-700 px-3 py-2 rounded text-sm font-medium hover:bg-green-100 flex items-center gap-1 border border-green-200 transition-colors"
                        title="Create a new Google Sheet (opens in new tab)"
                      >
                        <Plus size={14} /> New Sheet
                      </a>
                      
                      {/* Full View Button */}
                      {formData.embeddedLink && (
                        <a 
                          href={formData.embeddedLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="shrink-0 bg-blue-50 text-blue-700 px-3 py-2 rounded text-sm font-medium hover:bg-blue-100 flex items-center gap-1 border border-blue-200 transition-colors"
                          title="Open full document in new tab"
                        >
                          <Maximize2 size={14} /> Full View
                        </a>
                      )}
                    </div>
                </div>
                
                {/* Embed Preview - Increased Height */}
                {formData.embeddedLink && (
                  <div className="w-full h-[500px] border rounded bg-gray-50 overflow-hidden relative shadow-inner">
                    <div className="absolute top-0 right-0 p-1 bg-gray-100 rounded-bl text-[10px] text-gray-500 z-10 font-medium px-2 border-l border-b border-gray-200">
                        Live Preview
                    </div>
                    <iframe 
                      src={formData.embeddedLink} 
                      className="w-full h-full"
                      title="Sheet Preview"
                      loading="lazy"
                    />
                  </div>
                )}
                <p className="text-[11px] text-gray-500 mt-1">
                  Note: Ensure the Google Sheet is published or shared correctly to be visible in the iframe.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Documentation (Markdown)</label>
                <textarea 
                  className="w-full border p-2 rounded text-sm h-32 font-mono" 
                  value={formData.mdeText}
                  onChange={e => setFormData({...formData, mdeText: e.target.value})}
                  placeholder="# Instructions for filling this form..."
                />
              </div>

              <div className="flex justify-end gap-2 mt-6 border-t pt-4 sticky bottom-0 bg-white">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isAdding}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
                >
                  {isAdding ? "Saving..." : "Save Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}