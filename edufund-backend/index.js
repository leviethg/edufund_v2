// index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { ethers } = require("ethers");

const { provider, wallet, factory, getFundContract } = require("./blockchain");


const app = express();
app.use(cors());
app.use(express.json());


// ================================
// 1. HEALTH CHECK
// ================================
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


// ================================
// 2. GET /v1/funds
//    Lấy danh sách các quỹ từ FundFactory
// ================================
app.get("/v1/funds", async (req, res) => {
  try {
    // Lấy list địa chỉ quỹ từ smart contract FundFactory
    const addresses = await factory.getAllFunds();

    // Mảng kết quả trả về client
    const results = [];

    // Lặp qua từng quỹ
    for (const addr of addresses) {
      const fund = getFundContract(addr);

      const [name, slots, totalFund] = await Promise.all([
        fund.name(),
        fund.slots(),
        fund.totalFund()
      ]);

      results.push({
        address: addr,
        name,
        slots: Number(slots),
        totalFund: ethers.utils.formatEther(totalFund)
      });
    }

    res.json(results);

  } catch (err) {
    console.error("GET /v1/funds error:", err.message);
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ================================
// SERVER LISTEN
// ================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`EduFund backend running at http://localhost:${PORT}`);
});


// ================================
// 3. GET /v1/funds/:address
//    Lấy chi tiết 1 quỹ + danh sách ứng viên
// ================================
app.get("/v1/funds/:address", async (req, res) => {
  try {
    const addr = req.params.address;
    const fund = getFundContract(addr);

    // Lấy thông tin cơ bản
    const [
      name,
      description,
      totalFund,
      slots,
      appCountBN
    ] = await Promise.all([
      fund.name(),
      fund.description(),
      fund.totalFund(),
      fund.slots(),
      fund.getApplicationCount()
    ]);

    const slotNumber = Number(slots);
    const applicationCount = Number(appCountBN);

    // Lấy danh sách ứng viên
    const applications = [];
    for (let i = 0; i < applicationCount; i++) {
      const a = await fund.applications(i);

      applications.push({
        id: i,
        name: a.name,
        gpa: Number(a.gpa),                      // uint256 → number
        link: a.link,
        applicant: a.applicant,                 
        voteCount: Number(a.voteCount),
        lastVoteTimestamp: Number(a.lastVoteTimestamp)
      });
    }

    // Trả về JSON
    res.json({
      address: addr,
      name,
      description,
      totalFund: ethers.utils.formatEther(totalFund),
      slots: slotNumber,
      applicationCount,
      applications
    });

  } catch (err) {
    console.error("GET /v1/funds/:address error:", err);
    res.status(500).json({ error: "Failed to fetch fund details" });
  }
});


// ================================
// 4. POST /v1/funds
//    Tạo quỹ mới (createFund)
// ================================
app.post("/v1/funds", async (req, res) => {
  try {
    const { name, fundAmount, slots, description } = req.body;

    if (!name || !fundAmount || !slots) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // fundAmount là số ETH → convert sang wei
    const amountWei = ethers.utils.parseEther(fundAmount.toString());

    // Tính phí sàn 5%
    const platformFee = amountWei.mul(5).div(100);

    // Tổng ETH phải gửi
    const totalValue = amountWei.add(platformFee);

    console.log("\n--- Creating Fund ---");
    console.log("Name:", name);
    console.log("Amount(wei):", amountWei.toString());
    console.log("Slots:", slots);
    console.log("Description:", description);
    console.log("Total value sent:", totalValue.toString());
    console.log("----------------------");

    // Gọi createFund
    const tx = await factory.createFund(
      name,
      amountWei,
      slots,
      description ?? "",
      { value: totalValue } // gửi ETH khi gọi hàm
    );

    const receipt = await tx.wait();

    // Tìm event FundCreated
    const event = receipt.events?.find(
      (e) => e.event === "FundCreated"
    );

    if (!event) {
      return res.status(500).json({ error: "Event FundCreated not found" });
    }

    const fundAddress = event.args.fundAddress;

    return res.json({
      status: "success",
      fundAddress
    });

  } catch (err) {
    console.error("POST /v1/funds error:", err);
    res.status(500).json({
      error: err.reason || err.message || "Failed to create fund"
    });
  }
});

// ================================
// 5. POST /v1/funds/:address/apply
//    Nộp đơn ứng tuyển vào quỹ
// ================================
app.post("/v1/funds/:address/apply", async (req, res) => {
  try {
    const fundAddress = req.params.address;
    const { name, gpa, link } = req.body;

    if (!name || !gpa || !link) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Tạo contract object kết nối đến quỹ
    // const fund = new ethers.Contract(
    //   fundAddress,
    //   require("./abi/ScholarshipFund.json"),
    //   wallet
    // );
    const fund = getFundContract(fundAddress, true);

    // Gọi submitApplication
    const tx = await fund.submitApplication(name, gpa, link);
    await tx.wait();

    res.json({ ok: true });

  } catch (err) {
    console.error("apply error:", err);
    res.status(500).json({ error: err.reason || err.message });
  }
});


// ================================
// 6. POST /v1/funds/:address/vote
//    Vote cho 1 ứng viên trong quỹ
// ================================
app.post("/v1/funds/:address/vote", async (req, res) => {
  try {
    const fundAddress = req.params.address;
    const { applicantIndex } = req.body;

    if (applicantIndex === undefined) {
      return res.status(400).json({ error: "Missing applicantIndex" });
    }

    // Lấy contract quỹ
    // const fund = new ethers.Contract(
    //   fundAddress,
    //   require("./abi/ScholarshipFund.json"),
    //   wallet
    // );

    const fund = getFundContract(fundAddress, true);

    // Gọi vote(index)
    const tx = await fund.vote(applicantIndex);
    await tx.wait();

    res.json({ ok: true });

  } catch (err) {
    console.error("vote error:", err);
    res.status(500).json({ error: err.reason || err.message });
  }
});


// ================================
// 7. POST /v1/funds/:address/distribute
//    Chia thưởng cho winners (top-k)
// ================================
app.post("/v1/funds/:address/distribute", async (req, res) => {
  try {
    const fundAddress = req.params.address;

    // Lấy contract quỹ
    // const fund = new ethers.Contract(
    //   fundAddress,
    //   require("./abi/ScholarshipFund.json"),
    //   wallet
    // );

    const fund = getFundContract(fundAddress, true);


    // Gọi distributeReward()
    const tx = await fund.distributeReward();
    const receipt = await tx.wait();

    res.json({ ok: true, txHash: receipt.transactionHash });

  } catch (err) {
    console.error("distribute error:", err);
    res.status(500).json({
      error: err.reason || err.message || "Failed to distribute rewards"
    });
  }
});


app.get("/balance/:address", async (req, res) => {
  const bal = await provider.getBalance(req.params.address);
  res.json({ balance: ethers.utils.formatEther(bal) });
});
