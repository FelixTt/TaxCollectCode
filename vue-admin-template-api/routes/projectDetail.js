const express = require('express');
const router = express.Router();
const LaborDetailService = require('../services/LaborDetail');
const DirectInputMaterialService = require('../services/DirectInputMaterial');
const DirectInputleaseService = require('../services/DirectInputlease');
const DirectInputFuelService = require('../services/DirectInputFuel');
const DirectInputOtherRateService = require('../services/DirectInputOtherRate');
const DepreciationService = require('../services/Depreciation');
const AmortizationService = require('../services/Amortization');
const OtherRelatedExpensesService = require('../services/OtherRelatedExpenses');
const ExpendDetailService = require('../services/ExpendDetail');

// *************************人工明细表**********************************
router.get('/queryLaborDetailList', LaborDetailService.queryLaborDetailList);
router.post('/addProjectLaborDetail', LaborDetailService.addProjectLaborDetail);
// 编辑任务接口
// router.put('/editProject', LaborDetailService.editProject);
router.delete('/deleteProjectLaborDetail', LaborDetailService.deleteProjectLaborDetail);

// *************************直投--材料**********************************
router.get('/queryDirectInputMaterialList', DirectInputMaterialService.queryDirectInputMaterialList);
router.post('/addDirectInputMaterialDetail', DirectInputMaterialService.addDirectInputMaterialDetail);
router.delete('/deleteDirectInputMaterialDetail', DirectInputMaterialService.deleteDirectInputMaterialDetail);

// *************************直投--燃料费用**********************************
router.get('/queryDirectInputFuelList', DirectInputFuelService.queryDirectInputFuelList);
router.post('/addDirectInputFuelDetail', DirectInputFuelService.addDirectInputFuelDetail);
router.delete('/deleteDirectInputFuelDetail', DirectInputFuelService.deleteDirectInputFuelDetail);

// *************************直投--经营租赁**********************************
router.get('/queryDirectInputleaseList', DirectInputleaseService.queryDirectInputleaseList);
router.post('/addDirectInputleaseDetail', DirectInputleaseService.addDirectInputleaseDetail);
router.delete('/deleteDirectInputleaseDetail', DirectInputleaseService.deleteDirectInputleaseDetail);

// *************************直投--其他费用**********************************
router.get('/queryDirectInputOtherRateList', DirectInputOtherRateService.queryDirectInputOtherRateList);
router.post('/addDirectInputOtherRateDetail', DirectInputOtherRateService.addDirectInputOtherRateDetail);
router.delete('/deleteDirectInputOtherRateDetail', DirectInputOtherRateService.deleteDirectInputOtherRateDetail);

// *************************折旧表**********************************
router.get('/queryDepreciationList', DepreciationService.queryDepreciationList);
router.post('/addDepreciationDetail', DepreciationService.addDepreciationDetail);
router.delete('/deleteDepreciationDetail', DepreciationService.deleteDepreciationDetail);

// *************************摊销表**********************************
router.get('/queryAmortizationList', AmortizationService.queryAmortizationList);
router.post('/addAmortizationDetail', AmortizationService.addAmortizationDetail);
router.delete('/deleteAmortizationDetail', AmortizationService.deleteAmortizationDetail);

// *************************其他相关费用表**********************************
router.get('/queryOtherRelatedExpensesList', OtherRelatedExpensesService.queryOtherRelatedExpensesList);
router.post('/addOtherRelatedExpensesDetail', OtherRelatedExpensesService.addOtherRelatedExpensesDetail);
router.delete('/deleteOtherRelatedExpensesDetail', OtherRelatedExpensesService.deleteOtherRelatedExpensesDetail);


// *************************研发支出扣减金额明细表**********************************
router.get('/queryExpendDetailList', ExpendDetailService.queryExpendDetailList);
router.post('/addExpendDetailDetail', ExpendDetailService.addExpendDetailDetail);
router.delete('/deleteExpendDetailDetail', ExpendDetailService.deleteExpendDetailDetail);




module.exports = router;

