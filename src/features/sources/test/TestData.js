// const crawlers = [
//     {
//         "sourceId": 1,
//         "organisationId": "7cc95aa3-e1e2-4596-9347-6bcd7b2234c2",
//         "kbId": "77e30769-012a-47a2-a819-480e40d55e8d",
//         "nodeId": 0,
//         "name": "jobs",
//         "crawlerType": "restfull",
//         "schedule": "mon-0,tue-0,wed-0,thu-0,fri-0,sat-0,sun-0,mon-2,tue-2,wed-2,thu-2,fri-2,sat-2,sun-2,mon-3,tue-3,wed-3,thu-3,fri-3,sat-3,sun-3,mon-5,tue-5,wed-5,thu-5,fri-5,sat-5,sun-5,mon-6,tue-6,wed-6,thu-6,fri-6,sat-6,sun-6,mon-8,tue-8,wed-8,thu-8,fri-8,sat-8,sun-8,mon-9,tue-9,wed-9,thu-9,fri-9,sat-9,sun-9,mon-11,tue-11,wed-11,thu-11,fri-11,sat-11,sun-11,mon-12,tue-12,wed-12,thu-12,fri-12,sat-12,sun-12,mon-14,tue-14,wed-14,thu-14,fri-14,sat-14,sun-14,mon-15,tue-15,wed-15,thu-15,fri-15,sat-15,sun-15,mon-17,tue-17,wed-17,thu-17,fri-17,sat-17,sun-17,mon-18,tue-18,wed-18,thu-18,fri-18,sat-18,sun-18,mon-21,tue-21,wed-21,thu-21,fri-21,sat-21,sun-21,mon-23,tue-23,wed-23,thu-23,fri-23,sat-23,sun-23,mon-19,tue-19,wed-19,thu-19,fri-19,sat-19,sun-19",
//         "deleteFiles": true,
//         "allowAnonymous": true,
//         "processingLevel": "SEARCH",
//         "enablePreview": true,
//         "filesPerSecond": 0,
//         "specificJson": "{\"template\":\"<article class=\\\"row section_margin animate-box-del other-item other-job-item fadeInUp-del animated-fast-del\\\" style=\\\"background: #f2f2f2; padding-top: 5px; padding-bottom: 5px;\\\">\\n    <div class=\\\"col-md-12 animate-box-del news-content fadeInUp-del animated-fast-del\\\">\\n        <div>\\n            <div class=\\\"post_meta\\\"><span class=\\\"meta_categories\\\"><a href=\\\"https://www.nicholas-scott.com\\\" target=\\\"_blank\\\">JOB FROM NICHOLAS SCOTT</a></span></div>\\n            <h3 class=\\\"alith_post_title\\\"><a href=\\\"https://www.nicholas-scott.com/job/[cached_slug]\\\">[job_title]</a></h3>\\n            <p>[job_location] | Posted {time} ago</p>\\n            <p>[clean_description]</p>\\n            <a rel=\\\"nofollow\\\" href=\\\"https://www.nicholas-scott.com/job/[cached_slug]/apply\\\">Apply Now</a> | <a rel=\\\"nofollow\\\" href=\\\"https://www.nicholas-scott.com/job/[cached_slug]\\\">Read More</a>\\n        </div>\\n    </div>\\n</article>\\n\",\"metadata_list\":[{\"key\":\"created\",\"display\":null,\"metadata\":\"{created}\",\"db1\":\"[start_date]\",\"db2\":\"\",\"sort\":\"\",\"sortDefault\":\"\",\"sortAscText\":\"\",\"sortDescText\":\"\",\"sourceId\":\"0\",\"fieldOrder\":\"0\"},{\"key\":\"last modified\",\"display\":null,\"metadata\":\"{lastmod}\",\"db1\":\"[start_date]\",\"db2\":\"\",\"sort\":\"\",\"sortDefault\":\"\",\"sortAscText\":\"\",\"sortDescText\":\"\",\"sourceId\":\"0\",\"fieldOrder\":\"1\"}],\"content_url\":\"\",\"text\":\"[job_title].\\n[clean_description].\\n[job_location].\\n\",\"pk\":\"[id]\",\"fieldOrder\":\"specificJson\",\"url\":\"https://www.nicholas-scott.com/api/v1/jobs.json?per_page=200\"}",
//         "sessionId": "",
//         "maxItems": 0,
//         "maxBotItems": 0,
//         "customRender": true,
//         "edgeDeviceId": "",
//         "qaMatchStrength": 0.8125,
//         "numResults": 2,
//         "numFragments": 1,
//         "numErrors": 0,
//         "errorThreshold": 10,
//         "startTime": 1660989602790,
//         "endTime": 1660989609105,
//         "acls": [],
//         "isCrawling": false,
//         "numCrawledDocuments": 151,
//         "numIndexedDocuments": 151,
//         "useDefaultRelationships": true
//     },
//     {
//         "sourceId": 2,
//         "organisationId": "7cc95aa3-e1e2-4596-9347-6bcd7b2234c2",
//         "kbId": "77e30769-012a-47a2-a819-480e40d55e8d",
//         "nodeId": 0,
//         "name": "news",
//         "crawlerType": "rss",
//         "schedule": "mon-0,tue-0,wed-0,thu-0,fri-0,sat-0,sun-0,mon-4,tue-4,wed-4,thu-4,fri-4,sat-4,sun-4,mon-6,tue-6,wed-6,thu-6,fri-6,sat-6,sun-6,mon-10,tue-10,wed-10,thu-10,fri-10,sat-10,sun-10,mon-12,tue-12,wed-12,thu-12,fri-12,sat-12,sun-12,mon-16,tue-16,wed-16,thu-16,fri-16,sat-16,sun-16,mon-18,tue-18,wed-18,thu-18,fri-18,sat-18,sun-18,mon-22,tue-22,wed-22,thu-22,fri-22,sat-22,sun-22,mon-20,tue-20,wed-20,thu-20,fri-20,sat-20,sun-20,mon-14,tue-14,wed-14,thu-14,fri-14,sat-14,sun-14,mon-8,tue-8,wed-8,thu-8,fri-8,sat-8,sun-8,mon-2,tue-2,wed-2,thu-2,fri-2,sat-2,sun-2,mon-15,tue-15,wed-15,thu-15,fri-15,sat-15,sun-15,mon-17,tue-17,wed-17,thu-17,fri-17,sat-17,sun-17",
//         "deleteFiles": false,
//         "allowAnonymous": true,
//         "processingLevel": "SEARCH",
//         "enablePreview": true,
//         "filesPerSecond": 0,
//         "specificJson": "{\"endpoint\":\"https://www.globallegalpost.com/rss\",\"initial_feed\":\"\"}",
//         "sessionId": "",
//         "maxItems": 0,
//         "maxBotItems": 0,
//         "customRender": false,
//         "edgeDeviceId": "",
//         "qaMatchStrength": 0.8125,
//         "numResults": 20,
//         "numFragments": 1,
//         "numErrors": 0,
//         "errorThreshold": 0,
//         "startTime": 1660986001977,
//         "endTime": 1660986037963,
//         "acls": [],
//         "isCrawling": false,
//         "numCrawledDocuments": 231,
//         "numIndexedDocuments": 231,
//         "useDefaultRelationships": true
//     }
// ]
//
// //https://cloud.simsage.ai/api/document/parquets/7cc95aa3-e1e2-4596-9347-6bcd7b2234c2/77e30769-012a-47a2-a819-480e40d55e8d/0/10
// export const parquets = {
//     "organisationId": "7cc95aa3-e1e2-4596-9347-6bcd7b2234c2",
//     "kbId": "77e30769-012a-47a2-a819-480e40d55e8d",
//     "timeList": [
//         {
//             "name": "content spreadsheet",
//             "time": 1658756689904
//         },
//         {
//             "name": "content parquet",
//             "time": 1658756573289
//         }
//     ]
// }

export const form_data = {
    "id": "",
        "sourceId": 1,
        "crawlerType": "rss",
        "name": "glp rss 2",
        "deleteFiles": false,
        "allowAnonymous": true,
        "enablePreview": true,
        "schedule": "mon-0,tue-0,wed-0,thu-0,fri-0,sat-0,sun-0,mon-1,tue-1,wed-1,thu-1,fri-1,sat-1,sun-1,mon-2,tue-2,wed-2,thu-2,fri-2,sat-2,sun-2,mon-3,tue-3,wed-3,thu-3,fri-3,sat-3,sun-3,mon-4,tue-4,wed-4,thu-4,fri-4,sat-4,sun-4,mon-5,tue-5,wed-5,thu-5,fri-5,sat-5,sun-5,mon-6,tue-6,wed-6,thu-6,fri-6,sat-6,sun-6,mon-8,tue-8,wed-8,thu-8,fri-8,sat-8,sun-8,mon-9,tue-9,wed-9,thu-9,fri-9,sat-9,sun-9,mon-10,tue-10,wed-10,thu-10,fri-10,sat-10,sun-10,mon-11,tue-11,wed-11,thu-11,fri-11,sat-11,sun-11,mon-12,tue-12,wed-12,thu-12,fri-12,sat-12,sun-12,mon-13,tue-13,wed-13,thu-13,fri-13,sat-13,sun-13,mon-14,tue-14,wed-14,thu-14,fri-14,sat-14,sun-14,mon-15,tue-15,wed-15,thu-15,fri-15,sat-15,sun-15,mon-16,tue-16,wed-16,thu-16,fri-16,sat-16,sun-16,mon-17,tue-17,wed-17,thu-17,fri-17,sat-17,sun-17,mon-18,tue-18,wed-18,thu-18,fri-18,sat-18,sun-18,mon-19,tue-19,wed-19,thu-19,fri-19,sat-19,sun-19,mon-20,tue-20,wed-20,thu-20,fri-20,sat-20,sun-20,mon-21,tue-21,wed-21,thu-21,fri-21,sat-21,sun-21,mon-22,tue-22,wed-22,thu-22,fri-22,sat-22,sun-22,mon-23,tue-23,wed-23,thu-23,fri-23,sat-23,sun-23",
        "filesPerSecond": 0.5,
        "specificJson": "{\"endpoint\":\"https://www.globallegalpost.com/rss\",\"metadata_list\":[{\"key\":\"created date range\",\"display\":\"created\",\"metadata\":\"created\",\"db1\":\"\",\"db2\":\"\",\"sort\":\"true\",\"sortDefault\":\"desc\",\"sortAscText\":\"oldest documents first\",\"sortDescText\":\"newest documents first\",\"fieldOrder\":\"0\"},{\"key\":\"last modified date ranges\",\"display\":\"last modified\",\"metadata\":\"last-modified\",\"db1\":\"\",\"db2\":\"\",\"sort\":\"true\",\"sortDefault\":\"\",\"sortAscText\":\"least recently modified\",\"sortDescText\":\"most recently modified\",\"fieldOrder\":\"1\"},{\"key\":\"document type\",\"display\":\"document type\",\"metadata\":\"document-type\",\"db1\":\"\",\"db2\":\"\",\"sort\":\"\",\"sortDefault\":\"\",\"sortAscText\":\"\",\"sortDescText\":\"\",\"fieldOrder\":\"2\"}],\"initial_feed\":\"\"}",
        "processingLevel": "NLU",
        "nodeId": 0,
        "maxItems": 0,
        "maxQNAItems": "0",
        "customRender": false,
        "acls": [],
        "useDefaultRelationships": true,
        "organisationId": "018336d1-f905-98c4-61c9-827978f333cb",
        "kbId": "01833a6a-47ef-422a-6376-32c3187ec488",
        "sessionId": "",
        "maxBotItems": 0,
        "edgeDeviceId": "",
        "qaMatchStrength": 0.8125,
        "numResults": 5,
        "numFragments": 3,
        "numErrors": 0,
        "errorThreshold": 10,
        "startTime": 0,
        "endTime": 0,
        "isCrawling": false,
        "numCrawledDocuments": 221,
        "numConvertedDocuments": 221,
        "numParsedDocuments": 221,
        "numIndexedDocuments": 221,
        "numFinishedDocuments": 216,
        "isBusy": false
}