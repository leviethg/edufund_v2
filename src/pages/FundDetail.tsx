
import React, { useEffect, useState } from "react";
import { useParams } from "../context/RouterContext";
import { api } from "../api/api";
import { Fund, Applicant } from "../types";
import { useToast } from "../context/ToastContext";
import { useWallet } from "../hooks/useWallet";

const FundDetail: React.FC = () => {
  const { params } = useParams();
  const fundId = params?.id;
  const { address, isConnected, signAction } = useWallet(); // signAction used to simulate auth signature if needed

  const { addToast } = useToast();

  const [fund, setFund] = useState<Fund | null>(null);
  const [apps, setApps] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [gpa, setGpa] = useState("");
  const [portfolio, setPortfolio] = useState("");

  const [voting, setVoting] = useState<string | null>(null);
  const [distributing, setDistributing] = useState(false);
  const [rewarded, setRewarded] = useState(false);

  /** LOAD FUND + APPLICANTS */
  useEffect(() => {
    if (!fundId) return;

    const load = async () => {
      setLoading(true);
      try {
        const f = await api.getFundById(fundId);
        const a = await api.getApplicants(fundId);
        setFund(f);
        setApps(a);

        if (f.status === "Completed") setRewarded(true);
      } catch (e: any) {
        addToast("Không tải được thông tin quỹ.", "error");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fundId]);

  /** SUBMIT APPLICATION */
  const submitApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
        addToast("Vui lòng kết nối ví để nộp hồ sơ.", "error");
        return;
    }
    if (!name.trim() || !gpa.trim() || !portfolio.trim()) {
      addToast("Vui lòng nhập đủ thông tin hồ sơ.", "error");
      return;
    }

    const gpaNum = Number(gpa);
    if (gpaNum <= 0 || gpaNum > 4) {
      addToast("GPA phải trong khoảng 0–4.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const newOne = await api.applyForFund(fundId!, {
        name,
        gpa: gpaNum,
        portfolioLink: portfolio,
      }, address);

      setApps((prev) => [...prev, newOne]);
      addToast("Nộp hồ sơ thành công!", "success");

      setName("");
      setGpa("");
      setPortfolio("");
    } catch (e: any) {
      addToast(e.message || "Lỗi gửi hồ sơ.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  /** VOTE */
  const vote = async (appId: string) => {
    if (!fundId) return;
    if (!isConnected) {
        addToast("Kết nối ví để bình chọn.", "info");
        return;
    }

    setVoting(appId);
    try {
      const { votes, lastVoteTimestamp } = await api.voteForApplicant(fundId, appId, address);
      
      setApps((prev) =>
        prev.map((x) => (x.id === appId ? { ...x, votes, lastVoteTimestamp } : x))
      );
      addToast("Vote thành công!", "success");
    } catch (e: any) {
      addToast(e.message || "Lỗi vote.", "error");
    } finally {
      setVoting(null);
    }
  };

  /** SORTING LOGIC */
  const sortedApps = [...apps].sort((a, b) => {
      if (b.votes !== a.votes) return b.votes - a.votes;
      return (a.lastVoteTimestamp || Infinity) - (b.lastVoteTimestamp || Infinity);
  });

  /** DISTRIBUTE REWARD VIA SERVER (SMART CONTRACT SIMULATION) */
  const distribute = async () => {
    if (!fundId || !fund) return;
    
    if (sortedApps.length === 0) {
        addToast("Chưa có ứng viên nào để trao thưởng.", "error");
        return;
    }

    // Logic: Lấy Top K (fund.slots) người giỏi nhất
    const k = fund.slots || 1;
    const winners = sortedApps.slice(0, k);

    // Tính tiền chia đều
    const amountPerPerson = fund.targetAmount / winners.length;
    const safeAmount = Math.floor(amountPerPerson * 10000) / 10000;

    const confirmMsg = `Kích hoạt Smart Contract?\n\n` +
      `- Tổng quỹ: ${fund.targetAmount} ETH\n` +
      `- Số suất (k): ${k}\n` +
      `- Người nhận: ${winners.length}\n` +
      `- Mỗi người nhận: ~${safeAmount} ETH\n\n` +
      `Hệ thống sẽ tự động giải ngân từ Vault đến ví người thắng. Bạn chỉ cần ký xác nhận lệnh.`;

    if (!window.confirm(confirmMsg)) {
        return;
    }

    setDistributing(true);
    try {
      addToast("Đang gửi lệnh giải ngân lên Smart Contract...", "info");

      // Giả lập ký lệnh (để chứng minh quyền chủ quỹ)
      await signAction("Distribute Rewards");
      
      // Tạo danh sách phân bổ gửi cho Backend
      const distributionList = winners.map(w => ({
          address: w.walletAddress,
          amount: safeAmount
      }));
      
      // Gọi API Backend -> Backend sẽ gọi JSON-RPC để chuyển tiền thật từ Vault
      await api.rewardFund(fundId, distributionList, address);
      
      setRewarded(true);
      setFund({ ...fund, status: "Completed" });
      addToast("🎉 Smart Contract đã giải ngân thành công!", "success");

    } catch (e: any) {
      console.error(e);
      addToast(e.message || "Lỗi giải ngân.", "error");
    } finally {
      setDistributing(false);
    }
  };

  const isOwner = address && fund?.creator && address.toLowerCase() === fund.creator.toLowerCase();

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu quỹ...</div>;
  if (!fund) return <div className="p-8 text-center text-red-500">Không tìm thấy quỹ hoặc quỹ không tồn tại.</div>;

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 animate-fade-in-up">
      <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">{fund.title}</h1>
            <p className="text-sm text-gray-500">Tạo bởi: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-primary">{fund.creator}</span></p>
          </div>
          <div className={`px-4 py-1 rounded-full text-sm font-bold border ${rewarded ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
              {rewarded ? "ĐÃ HOÀN THÀNH" : "ĐANG HOẠT ĐỘNG"}
          </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
        <p className="text-gray-700 mb-6 leading-relaxed text-lg">{fund.fullDescription || fund.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
             <div>
                 <p className="text-xs text-gray-500 uppercase font-bold mb-1">Giá trị quỹ</p>
                 <p className="text-2xl font-bold text-primary">{fund.targetAmount} ETH</p>
             </div>
             <div>
                 <p className="text-xs text-gray-500 uppercase font-bold mb-1">Số suất (k)</p>
                 <p className="text-2xl font-bold text-gray-900">{fund.slots || 1}</p>
             </div>
             <div>
                 <p className="text-xs text-gray-500 uppercase font-bold mb-1">Số ứng viên</p>
                 <p className="text-2xl font-bold text-gray-900">{apps.length}</p>
             </div>
             <div>
                 <p className="text-xs text-gray-500 uppercase font-bold mb-1">Trạng thái</p>
                 <p className="text-lg font-medium text-gray-700">{rewarded ? "Đã phát thưởng" : "Đang nhận hồ sơ"}</p>
             </div>
        </div>
      </div>

      {/* APPLY FORM */}
      {!rewarded && (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-10 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            📝 Nộp hồ sơ ứng tuyển
          </h2>
          <form onSubmit={submitApp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <label className="label">Họ và tên</label>
                <input
                placeholder="Nhập họ tên đầy đủ"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label className="label">GPA (Thang 4)</label>
                <input
                placeholder="Ví dụ: 3.6"
                type="number"
                step="0.1"
                min="0"
                max="4"
                className="input-field"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                />
            </div>
            <div>
                <label className="label">Link Portfolio / CV</label>
                <input
                placeholder="Google Drive, Github, Behance..."
                className="input-field"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                />
            </div>
            <div className="md:col-span-2 pt-2">
                <button disabled={submitting} className="btn-primary w-full md:w-auto">
                {submitting ? "Đang gửi hồ sơ..." : "Nộp hồ sơ ngay"}
                </button>
            </div>
          </form>
        </div>
      )}

      {/* APPLICANTS TABLE */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
            👥 Bảng Xếp Hạng ({sortedApps.length})
            </h2>
            <div className="text-sm text-gray-500">
                Top <strong className="text-primary">{fund.slots || 1}</strong> người dẫn đầu sẽ nhận thưởng
            </div>
        </div>

        {sortedApps.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
             <p className="text-gray-500">Chưa có hồ sơ nào được nộp.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                <tr>
                    <th className="px-6 py-4 rounded-l-lg">Hạng</th>
                    <th className="px-6 py-4">Ứng viên</th>
                    <th className="px-6 py-4 text-center">GPA</th>
                    <th className="px-6 py-4">Hồ sơ</th>
                    <th className="px-6 py-4 text-center">Votes</th>
                    <th className="px-6 py-4 rounded-r-lg text-right">Hành động</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {sortedApps.map((a, i) => {
                    const isWinnerZone = i < (fund.slots || 1);
                    return (
                        <tr key={a.id} className={`transition-colors ${isWinnerZone ? 'bg-green-50/60 hover:bg-green-100/60' : 'hover:bg-gray-50'}`}>
                            <td className="px-6 py-4">
                                <span className={`font-bold ${isWinnerZone ? 'text-green-700 text-lg' : 'text-gray-400'}`}>
                                    #{i + 1}
                                </span>
                                {isWinnerZone && <span className="ml-1 text-xs text-green-600">🏆</span>}
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-bold text-gray-900">{a.name}</div>
                                <div className="text-xs text-gray-400 font-mono">{a.walletAddress.slice(0,6)}...{a.walletAddress.slice(-4)}</div>
                            </td>
                            <td className="px-6 py-4 text-center font-mono font-medium text-primary bg-primary-50 rounded">{a.gpa.toFixed(1)}</td>
                            <td className="px-6 py-4">
                            <a href={a.portfolioLink} className="text-blue-600 hover:underline text-sm font-medium" target="_blank" rel="noreferrer">
                                Xem Link ↗
                            </a>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <div className="font-bold text-lg text-gray-800">{a.votes}</div>
                                {a.votes > 0 && <div className="text-[10px] text-gray-400">cập nhật lúc {new Date(a.lastVoteTimestamp).toLocaleTimeString()}</div>}
                            </td>
                            <td className="px-6 py-4 text-right">
                            {!rewarded && (
                                <button
                                className="px-4 py-1.5 rounded-lg border border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-all text-sm font-medium disabled:opacity-50"
                                disabled={voting === a.id}
                                onClick={() => vote(a.id)}
                                >
                                {voting === a.id ? "..." : "Vote 👍"}
                                </button>
                            )}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DISTRIBUTE BUTTON (ONLY OWNER) */}
      {!rewarded && isOwner && (
        <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
              <h3 className="font-bold text-blue-900">Khu vực dành cho người tạo quỹ</h3>
              <p className="text-sm text-blue-700">
                  Quỹ (<strong>{fund.targetAmount} ETH</strong>) đang được giữ an toàn trong Smart Contract.<br/>
                  Nhấn nút bên dưới để giải ngân học bổng cho <strong>Top {fund.slots || 1}</strong>.
              </p>
          </div>
          <button
            className="px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-green-600 shadow-md hover:shadow-lg transition-all whitespace-nowrap"
            disabled={distributing}
            onClick={distribute}
          >
            {distributing ? "Đang xử lý giao dịch..." : "💸 Phát thưởng ngay"}
          </button>
        </div>
      )}
      
      <style>{`
        .input-field {
            width: 100%;
            padding: 10px 16px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            outline: none;
            transition: all 0.2s;
        }
        .input-field:focus {
            border-color: #0f62fe;
            box-shadow: 0 0 0 3px rgba(15, 98, 254, 0.1);
        }
        .label {
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
            margin-bottom: 0.5rem;
        }
        .btn-primary {
            background-color: #0f62fe;
            color: white;
            padding: 10px 24px;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.2s;
        }
        .btn-primary:hover {
            background-color: #0b5be6;
            box-shadow: 0 4px 12px rgba(15, 98, 254, 0.2);
        }
        .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default FundDetail;