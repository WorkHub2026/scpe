export default function DecisionModal({
  onClose,
  formData,
  setFormData,
  onSubmit,
}: any) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
        <h3 className="text-xl font-bold mb-6">Review Decision</h3>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-bold mb-2">Decision</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#004225]/30 rounded-lg focus:ring-2 focus:ring-[#004225]/50"
            >
              <option value="">Select decision</option>
              <option value="Accepted">Accepted</option>
              <option value="Denied">Denied</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Feedback</label>
            <textarea
              placeholder="Add feedback..."
              value={formData.feedback}
              onChange={(e) =>
                setFormData({ ...formData, feedback: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#004225]/30 rounded-lg focus:ring-2 focus:ring-[#004225]/50 h-24"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onSubmit}
            className="flex-1 px-4 py-3 bg-[#004225] hover:bg-[#003218] text-white rounded-lg font-bold"
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-[#004225]/30 text-gray-700 rounded-lg font-bold hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
