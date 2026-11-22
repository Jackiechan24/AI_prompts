/** Search vocabulary is maintained per task, independently of display labels. */
export const taskVocabulary:Record<string,{aliases:string[];questions:string[]}>={
 'business-report-ppt-outline':{aliases:['做PPT','制作PPT','做演示','PPT大纲','幻灯片','做课件'],questions:['老板让我做PPT','不知道做PPT要提供什么','让AI帮我做PPT']},
 'report-content-organization':{aliases:['做汇报','工作汇报','写汇报','整理汇报','汇报材料','总结工作'],questions:['老板让我做汇报','材料太多不知道怎么汇报','汇报重点怎么提炼']},
 'speech-writing':{aliases:['写演讲稿','发言稿','写发言','讲话稿','准备发言'],questions:['开会要发言不知道怎么写','帮我准备讲话']},
 'excel-multi-sheet-merge':{aliases:['合并Excel','合并表格','汇总多表','多个表合并','拼表','表格合并','合并工作表'],questions:['把几个Excel合成一个','不同表头怎么合并','把多张表汇总到一起']},
 'excel-sales-analysis':{aliases:['分析销售','销售报表','销售额分析','经营分析','销售数据','业绩分析'],questions:['销售下降是什么原因','帮我看销售数据','哪个渠道卖得好']},
 'meeting-notes-action-items':{aliases:['整理会议','会议记录','整理纪要','提取待办','会议待办','会议转写','行动清单'],questions:['开完会整理待办','录音转文字整理成纪要','谁负责什么什么时候完成']},
 'customer-review-analysis':{aliases:['分析评价','用户反馈','差评分析','客户反馈','评论分类','评论分析','投诉整理'],questions:['从差评里找问题','客户都在抱怨什么','评价太多看不过来']},
 'xiaohongshu-topic-planning':{aliases:['小红书选题','账号选题','找选题','内容方向','选题规划','笔记选题'],questions:['小红书不知道发什么','账号接下来写什么','帮我规划内容选题']}
};

// Additional scene aliases are kept with the scenario content registry.
taskVocabulary["excel-data-cleaning"]={aliases:["清洗表格", "整理脏数据", "查重复值"],questions:[]};
taskVocabulary["data-chart-design"]={aliases:["画图表", "数据可视化", "做统计图"],questions:[]};
taskVocabulary["document-drafting"]={aliases:["写通知", "起草文档"],questions:[]};
taskVocabulary["text-rewriting"]={aliases:["润色文字", "改写文章"],questions:[]};
taskVocabulary["document-summary"]={aliases:["提取摘要", "总结长文"],questions:[]};
taskVocabulary["format-conversion"]={aliases:["转JSON", "转格式"],questions:[]};
taskVocabulary["action-item-extraction"]={aliases:["整理行动事项", "提取行动承诺"],questions:[]};
taskVocabulary["email-reply"]={aliases:["回邮件", "写邮件回复"],questions:[]};
taskVocabulary["communication-preparation"]={aliases:["准备沟通", "协商优先级"],questions:[]};
taskVocabulary["content-writing"]={aliases:["写文章", "创作正文"],questions:[]};
taskVocabulary["marketing-copy"]={aliases:["写广告", "产品文案"],questions:[]};
taskVocabulary["event-planning"]={aliases:["办活动", "策划分享会"],questions:[]};
taskVocabulary["customer-issue-triage"]={aliases:["整理客户问题", "咨询分类"],questions:[]};
taskVocabulary["sales-follow-up"]={aliases:["跟进客户", "客户试用跟进"],questions:[]};
taskVocabulary["proposal-quotation"]={aliases:["做报价", "报价明细"],questions:[]};
taskVocabulary["information-retrieval"]={aliases:["查资料", "找资料来源"],questions:[]};
taskVocabulary["industry-research"]={aliases:["做行业研究", "行业调研"],questions:[]};
taskVocabulary["competitor-analysis"]={aliases:["竞品对比", "产品选型比较"],questions:[]};
taskVocabulary["project-planning"]={aliases:["做项目计划", "规划项目"],questions:[]};
taskVocabulary["file-archiving"]={aliases:["归档文件", "文件分类"],questions:[]};
taskVocabulary["batch-organization"]={aliases:["批量改名", "批量重命名"],questions:[]};
taskVocabulary["operation-guide"]={aliases:["写操作手册", "制作操作说明"],questions:[]};
taskVocabulary["process-mapping"]={aliases:["画流程", "整理业务流程"],questions:[]};
