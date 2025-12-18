import { Fund, Applicant } from '../types';
import { MOCK_OWNER_ADDRESS } from '../hooks/useWallet';

// We export these as mutable arrays to simulate a database in memory
export const MOCK_FUNDS: Fund[] = [
  {
    id: '1',
    title: 'Học bổng Tài Năng Công Nghệ 2024',
    description: 'Hỗ trợ sinh viên ngành KHMT có hoàn cảnh khó khăn nhưng đạt thành tích xuất sắc.',
    fullDescription: 'Chương trình học bổng thường niên dành cho sinh viên năm 3-4 chuyên ngành Khoa học máy tính, Kỹ thuật phần mềm. Chúng tôi tìm kiếm những cá nhân không chỉ giỏi chuyên môn mà còn có đóng góp tích cực cho cộng đồng mã nguồn mở.',
    targetAmount: 5000,
    raisedAmount: 3250,
    creator: MOCK_OWNER_ADDRESS, // Match mock wallet for owner testing
    deadline: '2024-12-31',
    category: 'Tech',
    status: 'Active',
    applicantsCount: 3
  },
  {
    id: '2',
    title: 'Quỹ Nghệ Thuật Sáng Tạo Trẻ',
    description: 'Dành cho các bạn trẻ đam mê thiết kế đồ họa và nghệ thuật đương đại.',
    fullDescription: 'Quỹ hỗ trợ các dự án nghệ thuật thể nghiệm, triển lãm cá nhân hoặc nhóm.',
    targetAmount: 2000,
    raisedAmount: 2000,
    creator: '0x456...def',
    deadline: '2024-10-15',
    category: 'Arts',
    status: 'Reviewing',
    applicantsCount: 1
  },
  {
    id: '3',
    title: 'Học bổng Môi Trường Xanh',
    description: 'Hỗ trợ các nghiên cứu sinh về bảo vệ môi trường và năng lượng tái tạo.',
    fullDescription: 'Tài trợ cho các đề tài nghiên cứu cấp trường/thành phố về giải pháp xử lý rác thải.',
    targetAmount: 8000,
    raisedAmount: 1200,
    creator: '0x789...ghi',
    deadline: '2025-02-28',
    category: 'Science',
    status: 'Active',
    applicantsCount: 0
  },
  {
    id: '4',
    title: 'Hỗ trợ sinh viên vùng cao',
    description: 'Quỹ thiện nguyện hỗ trợ chi phí sinh hoạt cho sinh viên dân tộc thiểu số.',
    fullDescription: 'Hỗ trợ 100% học phí và sinh hoạt phí cho 10 em sinh viên có hoàn cảnh đặc biệt khó khăn.',
    targetAmount: 10000,
    raisedAmount: 4500,
    creator: '0xabc...xyz',
    deadline: '2024-11-20',
    category: 'Social',
    status: 'Active',
    applicantsCount: 0
  }
];

export const MOCK_APPLICANTS: Applicant[] = [
  {
    id: 'a1',
    fundId: '1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    gpa: 3.8,
    major: 'Khoa học Máy tính',
    bio: 'Em là sinh viên năm 3, đã có 2 bài báo nghiên cứu khoa học.',
    portfolioLink: 'github.com/nguyenvana',
    status: 'Approved',
    walletAddress: '0xabc...123',
    submittedAt: '2024-05-20',
    votes: 12
  },
  {
    id: 'a2',
    fundId: '1',
    name: 'Trần Thị B',
    email: 'tranthib@email.com',
    gpa: 3.5,
    major: 'Kỹ thuật Phần mềm',
    bio: 'Đam mê lập trình mobile và thiết kế UI/UX.',
    portfolioLink: 'behance.net/tranthib',
    status: 'Pending',
    walletAddress: '0xdef...456',
    submittedAt: '2024-05-22',
    votes: 5
  },
  {
    id: 'a3',
    fundId: '1',
    name: 'Lê Văn C',
    email: 'levanc@email.com',
    gpa: 3.9,
    major: 'Hệ thống thông tin',
    bio: 'Thủ khoa đầu vào khoá 2021.',
    portfolioLink: 'linkedin.com/in/levanc',
    status: 'Pending',
    walletAddress: '0xghi...789',
    submittedAt: '2024-05-25',
    votes: 8
  },
  {
    id: 'a4',
    fundId: '2',
    name: 'Phạm Minh D',
    email: 'phamminhd@email.com',
    gpa: 3.2,
    major: 'Thiết kế đồ họa',
    bio: 'Portfolio bao gồm các dự án branding cho startup.',
    portfolioLink: 'behance.net/phamminhd',
    status: 'Pending',
    walletAddress: '0x987...654',
    submittedAt: '2024-06-01',
    votes: 20
  }
];

export const TRUST_LOGOS = [
  { name: 'University A', color: '#1a202c' },
  { name: 'Tech Corp', color: '#2d3748' },
  { name: 'Foundation X', color: '#4a5568' },
];