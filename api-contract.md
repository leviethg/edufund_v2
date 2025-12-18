# API & Smart Contract Interface

## Smart Contract Methods (Expected)

### `createFund(string memory _metadataCid, uint256 _target, uint256 _deadline)`
- **Description:** Creates a new scholarship fund.
- **Parameters:**
  - `_metadataCid`: IPFS hash containing title, description, requirements.
  - `_target`: Target amount in Wei/USDT.
  - `_deadline`: Unix timestamp.

### `applyForFund(uint256 _fundId, string memory _applicationCid)`
- **Description:** Student submits application.
- **Parameters:**
  - `_fundId`: ID of the fund.
  - `_applicationCid`: IPFS hash of encrypted CV/Portfolio.

### `voteForApplicant(uint256 _fundId, address _applicant)`
- **Description:** DAO member or admin votes for an applicant.

## Backend API (Mock)

### `GET /api/v1/funds`
- Returns list of active funds.

### `GET /api/v1/funds/:id`
- Returns detailed info including applicant status (if authorized).

### `POST /api/v1/apply`
- Proxy for gasless transactions (meta-transactions) if implemented.
