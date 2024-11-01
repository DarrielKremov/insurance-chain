import { expect } from "chai";
import { ethers } from "hardhat";
import { InsuranceClaims } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("InsuranceClaims", () => {
    let insuranceClaims: InsuranceClaims;
    let owner: SignerWithAddress;
    let customer: SignerWithAddress;
    let claimId: string;
    let customerId: string;

    beforeEach(async () => {
        [owner, customer] = await ethers.getSigners();

        const InsuranceClaims = await ethers.getContractFactory("InsuranceClaims");
        insuranceClaims = await InsuranceClaims.deploy(owner.address);
        await insuranceClaims.waitForDeployment(); 

        claimId = ethers.id("CLAIM-001");
        customerId = ethers.id("CUSTOMER-001");
    });

    describe("Deployment", () => {
        it("Should set the right owner", async () => {
            expect(await insuranceClaims.owner()).to.equal(owner.address);
        });
    });

    describe("Claim Submission", () => {
        it("Should emit ClaimSubmitted event on successful submission", async () => {
            const amount = ethers.parseEther("1.0");
            
            await expect(insuranceClaims.connect(customer)
                .submitClaim(customerId, claimId, amount))
                .to.emit(insuranceClaims, "ClaimSubmitted")
                .withArgs(claimId, customer.address, amount, (_: any) => true); // ignore the timestamp for now
        });

        it("Should reject duplicate claim IDs", async () => {
            const amount = ethers.parseEther("1.0");
            
            await insuranceClaims.connect(customer).submitClaim(customerId, claimId, amount);

            await expect(insuranceClaims.connect(customer)
                .submitClaim(customerId, claimId, amount))
                .to.be.revertedWith("Claim already exists");
        });
    });

    describe("Status Updates", () => {
        beforeEach(async () => {
            const amount = ethers.parseEther("1.0");
            await insuranceClaims.connect(customer).submitClaim(customerId, claimId, amount);
        });

        it("Should allow owner to update claim status", async () => {
            await expect(insuranceClaims.connect(owner)
                .updateClaimStatus(claimId, "APPROVED"))
                .to.emit(insuranceClaims, "ClaimStatusUpdated")
                .withArgs(claimId, "APPROVED");
        });

        it("Should reject status updates from non-owners", async () => {
            await expect(insuranceClaims.connect(customer)
                .updateClaimStatus(claimId, "APPROVED"))
                .to.be.revertedWithCustomError(insuranceClaims, "OwnableUnauthorizedAccount")
                .withArgs(customer.address);
        });
    });

    describe("Retrieve Claim Details", function () {
        it("Should return correct claim details", async function () {
            const amount = ethers.parseEther("1.0");
            await insuranceClaims.connect(customer).submitClaim(customerId, claimId, amount);

            const claim = await insuranceClaims.getClaim(claimId);
            expect(claim.customerId).to.equal(customerId);
            expect(claim.amount).to.equal(amount);
            expect(claim.status).to.equal("Submitted");
        });
    });
});