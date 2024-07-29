const express = require('express');
const router = express.Router();
const service = require('../services/statisticsSummary.js');


// // 统计年份数据信息
// router.get('/queryYearInfo', service.queryYearInfo);
// router.post('/updateYearInfo', service.updateYearInfo);

// 添加任务接口
// 该查询接口可以查询所有数据
// 对于更新接口，需要根据不同的修改参数来更新
router.get('/queryStatisticsSummary', service.queryStatisticsSummary);
router.post('/updateStatisticsSummary', service.updateStatisticsSummary);

// 直投--材料
router.post('/updateDirectInputMaterial', service.updateDirectInputMaterial);

// 直投--燃料费
router.post('/updateDirectInputFuel', service.updateDirectInputFuel);

// 直投--经营租赁
router.post('/updateDirectInputlease', service.updateDirectInputlease);

// 直投--维检费
router.post('/updateDirectInputOtherRate', service.updateDirectInputOtherRate);

// 折旧
router.post('/updateDepreciation', service.updateDepreciation);

// 摊销
router.post('/updateAmortization', service.updateAmortization);

// 其他相关费用
router.post('/updateOtherRelatedExpenses', service.updateOtherRelatedExpenses);

// 研发支出和扣减
router.post('/updateExpendDetail', service.updateExpendDetail);


module.exports = router;
