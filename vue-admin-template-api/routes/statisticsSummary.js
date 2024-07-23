const express = require('express');
const router = express.Router();
const service = require('../services/statisticsSummary.js');


// 统计年份数据信息
router.get('/queryYearInfo', service.queryYearInfo);
router.post('/updateYearInfo', service.updateYearInfo);

// 添加任务接口
// 该查询接口可以查询所有数据
// 对于更新接口，需要根据不同的修改参数来更新
router.get('/queryStatisticsSummary', service.queryStatisticsSummary);
router.post('/updateStatisticsSummary', service.updateStatisticsSummary);

// 五险一金
router.post('/updateInsurancesAndFundSum', service.updateInsurancesAndFundSum);
// 其他相关费用
router.post('/updateOtherRelatedExpenses', service.updateOtherRelatedExpenses);
// 研发工时
router.post('/updatePropOfReachHours', service.updatePropOfReachHours);

// 直投--材料
router.post('/updateDirectInputMaterial', service.updateDirectInputMaterial);


module.exports = router;
