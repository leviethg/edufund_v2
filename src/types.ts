
export interface Fund {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  targetAmount: number;
  raisedAmount: number;
  creator: string;
  deadline: string;
  category: 'Tech' | 'Arts' | 'Science' | 'Social' | 'General';
  status: 'Active' | 'Closed' | 'Reviewing' | 'Completed';
  applicantsCount: number; // Số người đã nộp
  slots: number;           // Số suất học bổng (k)
  transactionHash?: string;
}

export interface Applicant {
  id: string;
  fundId: string;
  name: string;
  email?: string;
  gpa: number;
  major: string;
  bio?: string;
  portfolioLink?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  walletAddress: string;
  submittedAt: string;
  votes: number;
  lastVoteTimestamp: number; // Thời điểm nhận vote cuối cùng
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
}

export interface FundFilter {
  search: string;
  status: 'All' | 'Active' | 'Closed';
  category: string;
  minAmount: number;
  maxAmount: number;
}

export type SortOption = 'newest' | 'most_applicants' | 'highest_amount';

export enum ThemeMode {
  LIGHT = 'light',
  WARM = 'warm',
  BLUE = 'blue'
}