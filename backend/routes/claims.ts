import { Router } from 'express';
import { submitClaim, getClaim, updateClaimStatus } from '../controllers/claims';

const router = Router();

router.post('/', submitClaim);
router.get('/:claimId', getClaim);
router.put('/:claimId/status', updateClaimStatus);

export const claimsRouter = router;