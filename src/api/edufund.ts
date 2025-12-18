const BASE_URL = "http://localhost:3000";

export async function getFunds() {
  return fetch(`${BASE_URL}/v1/funds`).then(r => r.json());
}

export async function getFundDetail(address: string) {
  return fetch(`${BASE_URL}/v1/funds/${address}`).then(r => r.json());
}

export async function createFund(data: {
  name: string;
  fundAmount: string;
  slots: number;
  description: string;
}) {
  return fetch(`${BASE_URL}/v1/funds`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(r => r.json());
}

export async function applyToFund(address: string, data: {
  name: string;
  gpa: number;
  link: string;
}) {
  return fetch(`${BASE_URL}/v1/funds/${address}/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(r => r.json());
}

export async function voteApplicant(address: string, applicantIndex: number) {
  return fetch(`${BASE_URL}/v1/funds/${address}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ applicantIndex })
  }).then(r => r.json());
}

export async function distributeFund(address: string) {
  return fetch(`${BASE_URL}/v1/funds/${address}/distribute`, {
    method: "POST"
  }).then(r => r.json());
}
