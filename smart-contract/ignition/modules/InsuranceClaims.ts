import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("InsuranceClaimsModule", (m) => {
    const insuranceClaims = m.contract("InsuranceClaims", [m.getParameter("owner")]);
    return { insuranceClaims };
});