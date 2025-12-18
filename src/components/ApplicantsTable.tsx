import React from 'react';
import { Applicant } from '../types';

interface Props {
  applicants: Applicant[];
  isOwner: boolean;
  onVote: (id: string, name: string) => void;
  onApprove: (id: string) => void;
  votingId?: string | null;
}

const ApplicantsTable: React.FC<Props> = ({ applicants, isOwner, onVote, onApprove, votingId }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-text-secondary border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 font-semibold">Ứng viên</th>
            <th className="px-6 py-4 font-semibold">Thông tin</th>
            <th className="px-6 py-4 font-semibold text-center">GPA</th>
            <th className="px-6 py-4 font-semibold text-center">Votes</th>
            <th className="px-6 py-4 font-semibold text-right">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {applicants.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                Chưa có ứng viên nào.
              </td>
            </tr>
          ) : applicants.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-primary flex items-center justify-center font-bold">
                    {app.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{app.name}</div>
                    <div className="text-xs text-text-muted font-mono">{app.walletAddress?.slice(0,6)}...</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-gray-900 font-medium">{app.major}</div>
                {app.portfolioLink && (
                    <a href={app.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Xem Portfolio</a>
                )}
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`px-2 py-1 rounded text-xs font-bold ${app.gpa >= 3.6 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {app.gpa}
                </span>
              </td>
              <td className="px-6 py-4 text-center font-bold text-gray-900">{app.votes}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  {isOwner && app.status === 'Pending' ? (
                     <button onClick={() => onApprove(app.id)} className="px-3 py-1.5 text-xs font-bold text-white bg-accent hover:bg-green-600 rounded-lg">Duyệt</button>
                  ) : (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${app.status === 'Approved' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
                      {app.status === 'Approved' ? 'Đã duyệt' : 'Đang chờ'}
                    </span>
                  )}
                  
                  <button onClick={() => onVote(app.id, app.name)} disabled={votingId === app.id} className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50">
                    {votingId === app.id ? '...' : '👍'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ApplicantsTable;