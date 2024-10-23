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

// 研发支出和扣减金额
router.get('/getDevelopCost', service.getDevelopCost);
router.get('/getDeductMoney', service.getDeductMoney);
// router.get('/getDevelopCostAndDeductMoney', service.getDevelopCostAndDeductMoney);

// 获取7012表文件
router.get('/get7012File', service.get7012File);

module.exports = router;
