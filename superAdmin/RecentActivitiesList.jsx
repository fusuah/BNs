'use client';

const activities = [
  {
    name: 'Juan Dela Cruz',
    initials: 'JD',
    action: 'submitted monthly nutrition report',
    role: 'BNS - San Antonio',
    time: '11:23 AM',
  },
  {
    name: 'Maria Santos',
    initials: 'MS',
    action: 'registered 3 new children',
    role: 'BNS - Poblacion',
    time: '10:45 AM',
  },
  {
    name: 'System',
    initials: 'SY',
    action: 'generated monthly compliance report',
    role: 'Automated',
    time: '10:00 AM',
  },
  {
    name: 'Pedro Reyes',
    initials: 'PR',
    action: 'updated child nutrition status',
    role: 'BNS - Santa Maria',
    time: '9:32 AM',
  },
  {
    name: 'Ana Rivera',
    initials: 'AR',
    action: 'requested supply inventory',
    role: 'BNS - San Jose',
    time: '9:15 AM',
  },
];

export default function RecentActivityList() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-full max-w-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>

      <ul className="space-y-4">
        {activities.map((a, i) => (
          <li key={i} className="flex gap-3 border-b pb-4 last:border-none">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-medium text-gray-700 text-sm">
              {a.initials}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">
                <span className="font-semibold">{a.name}</span> {a.action}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {a.role} <span className="mx-1">•</span> {a.time}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-center">
        <button className="text-sm font-medium text-green-600 hover:underline">
          View all activities
        </button>
      </div>
    </div>
  );
}
