
const http = require('http');

const PORT = 3000;
const HARDHAT_RPC = 'http://127.0.0.1:8545';
// Vault Address (Hardhat Account #0)
const VAULT_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

let funds = [];

const setCors = (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-wallet-address');
};

// Helper to make JSON-RPC calls to Hardhat Node
const callRpc = (method, params) => {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            jsonrpc: "2.0",
            method: method,
            params: params,
            id: new Date().getTime()
        });
        
        const req = http.request(HARDHAT_RPC, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': payload.length
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.error) reject(json.error);
                    else resolve(json.result);
                } catch(e) { reject(e); }
            });
        });
        
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
};

const server = http.createServer((req, res) => {
    setCors(res);

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;
    const userWallet = req.headers['x-wallet-address'] ? req.headers['x-wallet-address'].toLowerCase() : null;

    console.log(`[${req.method}] ${path} (User: ${userWallet || 'Guest'})`);

    // GET /v1/funds
    if (path === '/v1/funds' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(funds));
        return;
    }

    // GET /v1/funds/:id
    if (path.match(/\/v1\/funds\/[^\/]+$/) && req.method === 'GET') {
        const id = path.split('/')[3];
        const fund = funds.find(f => f.address === id);
        if (fund) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(fund));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Fund not found" }));
        }
        return;
    }

    // POST /v1/funds (Create)
    if (path === '/v1/funds' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const creator = userWallet || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
                
                const newFund = {
                    address: "0x" + Math.random().toString(16).substr(2, 40),
                    name: data.name,
                    description: data.description,
                    totalFund: data.fundAmount,
                    slots: parseInt(data.slots) || 1,
                    owner: creator, 
                    status: "Active",
                    applicationCount: 0,
                    applications: []
                };
                funds.push(newFund);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: "created", fundAddress: newFund.address }));
            } catch (e) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: "Invalid JSON" }));
            }
        });
        return;
    }

    // POST /v1/funds/:id/apply
    if (path.match(/\/v1\/funds\/[^\/]+\/apply$/) && req.method === 'POST') {
        const fundId = path.split('/')[3];
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
             const fund = funds.find(f => f.address === fundId);
             if (fund) {
                 if (fund.status !== 'Active') {
                     res.writeHead(400, { 'Content-Type': 'application/json' });
                     res.end(JSON.stringify({ error: "Quỹ đã đóng." }));
                     return;
                 }
                 const data = JSON.parse(body);
                 const applicantWallet = userWallet || "0xUserWallet...";
                 const existing = fund.applications.find(a => a.applicant.toLowerCase() === applicantWallet);
                 if (existing) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Bạn đã nộp hồ sơ rồi." }));
                    return;
                 }
                 fund.applications.push({
                     id: Date.now().toString(),
                     name: data.name,
                     link: data.link,
                     gpa: data.gpa,
                     voteCount: 0,
                     lastVoteTimestamp: 0,
                     applicant: applicantWallet,
                     voters: []
                 });
                 fund.applicationCount++;
                 res.writeHead(200, { 'Content-Type': 'application/json' });
                 res.end(JSON.stringify({ status: "success" }));
             } else {
                 res.writeHead(404);
                 res.end(JSON.stringify({ error: "Fund not found" }));
             }
        });
        return;
    }

    // POST /v1/funds/:id/vote
    if (path.match(/\/v1\/funds\/[^\/]+\/vote$/) && req.method === 'POST') {
        const fundId = path.split('/')[3];
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
             const fund = funds.find(f => f.address === fundId);
             if (fund) {
                 if (fund.status !== 'Active') {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Quỹ đã kết thúc." }));
                    return;
                 }
                 if (!userWallet) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Vui lòng kết nối ví." }));
                    return;
                 }
                 try {
                     const data = JSON.parse(body);
                     const applicant = fund.applications.find(a => parseInt(a.id) === data.applicantIndex || a.id === String(data.applicantIndex));
                     
                     if (applicant) {
                         if (!applicant.voters) applicant.voters = [];
                         if (applicant.voters.includes(userWallet)) {
                             res.writeHead(400, { 'Content-Type': 'application/json' });
                             res.end(JSON.stringify({ error: "Bạn đã bình chọn rồi." }));
                             return;
                         }
                         applicant.voters.push(userWallet);
                         applicant.voteCount = (applicant.voteCount || 0) + 1;
                         applicant.lastVoteTimestamp = Date.now();
                         res.writeHead(200, { 'Content-Type': 'application/json' });
                         res.end(JSON.stringify({ 
                             status: "success", 
                             votes: applicant.voteCount,
                             lastVoteTimestamp: applicant.lastVoteTimestamp 
                        }));
                     } else {
                         res.writeHead(404);
                         res.end(JSON.stringify({ error: "Applicant not found" }));
                     }
                 } catch(e) {
                     res.writeHead(400);
                     res.end(JSON.stringify({ error: "Invalid body" }));
                 }
             } else {
                 res.writeHead(404);
                 res.end(JSON.stringify({ error: "Fund not found" }));
             }
        });
        return;
    }

    // POST /v1/funds/:id/distribute
    if (path.match(/\/v1\/funds\/[^\/]+\/distribute$/) && req.method === 'POST') {
        const fundId = path.split('/')[3];
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            const fund = funds.find(f => f.address === fundId);
            
            if (!fund) {
                res.writeHead(404);
                res.end(JSON.stringify({ error: "Fund not found" }));
                return;
            }

            // Check owner
            if (!userWallet || fund.owner.toLowerCase() !== userWallet) {
                res.writeHead(403, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Not authorized" }));
                return;
            }

            try {
                const { winners } = JSON.parse(body);
                // winners = [{ address: "0x...", amount: 1.5 }, ...]

                console.log(`💰 Smart Contract Distributing for Fund ${fund.name}`);
                
                // Thực hiện chuyển tiền ETH thật thông qua RPC
                for (const winner of winners) {
                    const amountEth = winner.amount;
                    // Convert ETH to Hex Wei
                    const weiValue = BigInt(Math.floor(amountEth * 1e18));
                    const hexValue = "0x" + weiValue.toString(16);

                    console.log(`   -> Transferring ${amountEth} ETH to ${winner.address}...`);

                    // Gọi JSON-RPC eth_sendTransaction
                    // Từ VAULT_ADDRESS (Account #0 - Mặc định Unlock)
                    await callRpc('eth_sendTransaction', [{
                        from: VAULT_ADDRESS,
                        to: winner.address,
                        value: hexValue
                    }]);
                }

                fund.status = "Completed"; 
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: "success", fundStatus: "Completed" }));
            } catch(e) {
                console.error("Distribution Error:", e);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Blockchain transaction failed: " + e.message }));
            }
        });
        return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Endpoint not found" }));
});

server.listen(PORT, () => {
    console.log(`\n🚀 Smart Contract Simulator (Backend) running at: http://localhost:${PORT}/v1`);
    console.log(`   - Vault Address: ${VAULT_ADDRESS}`);
});