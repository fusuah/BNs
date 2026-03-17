'use client';

const pendingUsers = [
  {
    name: 'Juan Dela Cruz',
    initials: 'JD',
    role: 'Barangay Nutrition Scholar - San Antonio',
    dateRequested: '2025-04-28',
  },
  {
    name: 'Maria Santos',
    initials: 'MS',
    role: 'Barangay Nutrition Scholar - Poblacion',
    dateRequested: '2025-04-29',
  },
  {
    name: 'Jose Ramos',
    initials: 'JR',
    role: 'Barangay Nutrition Scholar - Santa Maria',
    dateRequested: '2025-04-30',
  },
  {
    name: 'Ana Lopez',
    initials: 'AL',
    role: 'Barangay Nutrition Scholar - San Isidro',
    dateRequested: '2025-05-01',
  },
];

export default function PendingUserApprovals() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-full ">
      <h2 className="text-lg font-semibold text-gray-900">Pending User Approvals</h2>
      <p className="text-sm text-gray-500 mb-4">
        Approve or reject new BNS account requests
      </p>

      <div className="space-y-4">
        {pendingUsers.slice(0, 3).map((user, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-semibold text-green-700 text-sm">
                {user.initials}
              </div>
              <div>
                <div className="font-semibold text-gray-900 leading-tight">
                  {user.name}
                </div>
                <div className="text-sm text-gray-600">{user.role}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Requested on {user.dateRequested}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100">
                Reject
              </button>
              <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                Approve
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View all button */}
      <div className="mt-6 text-center">
        <button className="text-sm font-medium text-green-600 hover:underline">
          View all requests
        </button>
      </div>
    </div>
  );
}
