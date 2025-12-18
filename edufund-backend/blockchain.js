// blockchain.js
require("dotenv").config();
const { ethers } = require("ethers");

// Lấy ABI từ folder abi
// const factoryArtifact = require("./abi/FundFactory.json");
// const fundArtifact = require("./abi/ScholarshipFund.json");

const factoryAbi = require("./abi/FundFactory.json").abi;
const fundAbi = require("./abi/ScholarshipFund.json").abi;


// Kết nối RPC (Hardhat local)
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

// Tạo signer từ PRIVATE_KEY (ví deployer của Hardhat node)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Tạo object FundFactory để gọi các hàm createFund(), getAllFunds(), ...

const factory = new ethers.Contract(
  process.env.FACTORY_ADDRESS,
  factoryAbi,     // ✔ mảng ABI hợp lệ
  wallet
);


// Hàm tạo 1 đối tượng ScholarshipFund theo địa chỉ quỹ


function getFundContract(address, withSigner = false) {
  return new ethers.Contract(
    address,
    fundAbi,
    withSigner ? wallet : provider
  );
}


// Xuất ra để file khác dùng
module.exports = {
  provider,
  wallet,
  factory,
  getFundContract
};
