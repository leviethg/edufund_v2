
// src/api/api.ts
import { Fund, Applicant, FundFilter } from '../types';

let apiBaseURL = 'http://localhost:3000/v1';

/** Helper build query client-side */
function buildQuery(filters: FundFilter): string {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.status && filters.status !== 'All') params.append('status', filters.status);
  if (filters.category) params.append('category', filters.category);
  if (filters.minAmount > 0) params.append('minAmount', filters.minAmount.toString());
  if (filters.maxAmount < 999999) params.append('maxAmount', filters.maxAmount.toString());
  return params.toString();
}

/** Helper fetch */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${apiBaseURL.replace(/\/$/, '')}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      if (data && (data as any).error) {
        msg = (data as any).error;
      }
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  try {
    return (await res.json()) as T;
  } catch {
    return {} as T;
  }
}

/** Map JSON backend */
function mapFundListItem(raw: any): Fund {
  return {
    id: raw.address,
    title: raw.name,
    description: typeof raw.description === 'string' ? raw.description : '',
    fullDescription: typeof raw.description === 'string' ? raw.description : '',
    targetAmount: Number(raw.totalFund),   
    raisedAmount: Number(raw.totalFund),
    creator: raw.owner || '',
    deadline: '',
    category: 'General',
    status: raw.status || 'Active', 
    applicantsCount: raw.applicationCount ?? 0,
    slots: Number(raw.slots) || 1,
    transactionHash: raw.txHash,
  };
}

function mapFundDetail(raw: any): Fund {
  return {
    id: raw.address,
    title: raw.name,
    description: typeof raw.description === 'string' ? raw.description : '',
    fullDescription: typeof raw.description === 'string' ? raw.description : '',

    targetAmount: Number(raw.totalFund),
    raisedAmount: Number(raw.totalFund),
    creator: raw.owner || '',
    deadline: '',
    category: 'General',
    status: raw.status || 'Active', 
    applicantsCount: raw.applicationCount ?? (raw.applications?.length ?? 0),
    slots: Number(raw.slots) || 1, 
    transactionHash: raw.txHash,
  };
}

function mapApplicant(fundId: string, raw: any): Applicant {
  const gpaRaw = Number(raw.gpa ?? 0); 
  return {
    id: String(raw.id),
    fundId,
    name: raw.name,
    email: undefined,
    gpa: gpaRaw / 10,
    major: '',
    bio: undefined,
    portfolioLink: raw.link,
    status: 'Pending',
    walletAddress: raw.applicant,
    submittedAt: '', 
    votes: Number(raw.voteCount ?? 0),
    lastVoteTimestamp: Number(raw.lastVoteTimestamp ?? 0),
  };
}

export const api = {
  configure(config: { apiEndpoint: string; accessToken?: string }) {
    if (config.apiEndpoint) {
      apiBaseURL = config.apiEndpoint;
    }
  },

  async getFunds(filters: FundFilter): Promise<Fund[]> {
    const rawList = await request<any[]>('/funds');
    let funds = rawList.map(mapFundListItem);

    const { search, minAmount, maxAmount } = filters;
    if (search) {
      const key = search.toLowerCase();
      funds = funds.filter(
        (f) =>
          f.title.toLowerCase().includes(key) ||
          (f.description || '').toLowerCase().includes(key),
      );
    }
    if (minAmount > 0) funds = funds.filter((f) => f.targetAmount >= minAmount);
    if (maxAmount < 999999) funds = funds.filter((f) => f.targetAmount <= maxAmount);

    return funds;
  },

  async getFundById(fundId: string): Promise<Fund> {
    const raw = await request<any>(`/funds/${fundId}`);
    return mapFundDetail(raw);
  },

  async createFund(data: Partial<Fund>, userAddress?: string | null): Promise<Fund> {
    const body = {
      name: data.title,
      fundAmount: data.targetAmount,              
      slots: data.slots || 1,                     
      description: data.description ?? '',
    };

    const headers: Record<string, string> = {};
    if (userAddress) headers['x-wallet-address'] = userAddress;

    const res = await request<{ status: string; fundAddress: string }>('/funds', {
      method: 'POST',
      body: JSON.stringify(body),
      headers
    });
    return this.getFundById(res.fundAddress);
  },

  async getApplicants(fundId: string): Promise<Applicant[]> {
    const raw = await request<any>(`/funds/${fundId}`);
    const apps = raw.applications || [];
    return apps.map((a: any) => mapApplicant(raw.address ?? fundId, a));
  },

  async applyForFund(fundId: string, data: any, userAddress?: string | null): Promise<Applicant> {
    const payload = {
      name: data.name,
      gpa: Math.round(Number(data.gpa) * 10),
      link: data.portfolioLink || data.portfolio || '',
    };
    const headers: Record<string, string> = {};
    if (userAddress) headers['x-wallet-address'] = userAddress;

    await request(`/funds/${fundId}/apply`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers
    });
    const applicants = await this.getApplicants(fundId);
    return applicants[applicants.length - 1];
  },

  async voteForApplicant(fundId: string, applicantId: string, userAddress?: string | null): Promise<{ votes: number; lastVoteTimestamp: number }> {
    const index = parseInt(applicantId, 10);
    const headers: Record<string, string> = {};
    if (userAddress) headers['x-wallet-address'] = userAddress;

    const res = await request<{ status: string, votes: number, lastVoteTimestamp: number }>(`/funds/${fundId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ applicantIndex: index }),
      headers
    });
    return { votes: res.votes, lastVoteTimestamp: res.lastVoteTimestamp };
  },

  async approveApplicant(_applicantId: string): Promise<boolean> {
    return true;
  },

  async rewardFund(fundId: string, winners: { address: string, amount: number }[], userAddress?: string | null): Promise<boolean> {
    const headers: Record<string, string> = {};
    if (userAddress) headers['x-wallet-address'] = userAddress;

    // Gửi danh sách người thắng (winners) để backend tự chuyển tiền
    await request(`/funds/${fundId}/distribute`, {
      method: 'POST',
      body: JSON.stringify({ winners }), 
      headers
    });
    return true;
  },
};