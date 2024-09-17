const express = require('express');
const router = express.Router();
const service = require('../services/projectService');


// 任务清单接口
router.get('/queryProjectList', service.queryProjectList);

// 
router.get('/queryAssginProjectList', service.queryAssginProjectList);

// 添加任务接口
router.post('/addProject', service.addProject);

// 编辑任务接口
router.put('/editProject', service.editProject);

// 删除任务接口
router.delete('/deleteProject', service.deleteProject);

// 对用户进行分配项目
// router.put('/updateAssginProject', service.updateAssginProject);

module.exports = router;

