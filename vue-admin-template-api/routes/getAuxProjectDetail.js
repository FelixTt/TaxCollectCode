const express = require('express');
const router = express.Router();
const service = require('../services/getAuxProjectDetail.js');

router.get('/queryAuxLabSalary', service.queryAuxLabSalary);
// router.get('/queryAuxDirectInput', service.queryAuxDirectInput);
router.get('/queryAuxDirectInputMaterial', service.queryAuxDirectInputMaterial);
router.get('/queryAuxDirectInputFuel', service.queryAuxDirectInputFuel);
router.get('/queryAuxDirectInputlease', service.queryAuxDirectInputlease);
router.get('/queryAuxDirectInputOtherRate', service.queryAuxDirectInputOtherRate);
router.get('/queryAuxDepreciation', service.queryAuxDepreciation);
router.get('/queryAuxIntangibleAssets', service.queryAuxIntangibleAssets);
router.get('/queryAuxProjectDesign', service.queryAuxProjectDesign);
router.get('/queryAuxOtherRelatedExpenses', service.queryAuxOtherRelatedExpenses);
router.get('/queryOtherThreeCostSum', service.queryOtherThreeCostSum);
router.get('/queryAuxEntrustDevelop', service.queryAuxEntrustDevelop);
module.exports = router;
