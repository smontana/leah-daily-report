var express = require('express');

var Hashids = require("hashids");
var hashids = new Hashids("LeAh Is GoInG pLaCeS rtbbly", 12);

module.exports = function(connection, models) {
  var router = express.Router();

  router.get('/:uid', function(req, res, next){
    var uid = req.params.uid;
    var id = hashids.decode(uid);

    models.DailyReport.findAll({
      where: { id: id }
    }).then(function(report) { 
      var report = report[0];
      var report_date = report.report_date_beautify();
      var prelease_percentage_prv_year = parseFloat(report.prelease_percentage_prv_year);
      var title = 'Daily Leasing Report';

      console.log(JSON.stringify(report, null, 3));

      res.render('../views/dashboards/show', {
        title: title,
        report_date: report_date,
        report: report,
        prelease_percentage_prv_year: prelease_percentage_prv_year
      });
    });
  });




  var page;
  var per_page;

  router.get('/', function(req, res, next){
    page = parseInt(req.query.page) || 1;
    per_page = parseInt(req.query.per_page) || 20;
    var page_offset = (page - 1) * per_page;

    if (page == 1) {

      models.DailyReport.findAndCountAll({
        order: [['report_date', 'DESC']],
        limit: per_page
      }).then(function(result) {
        var results = result.rows;
        var total = result.count;
        var total_pages = Math.ceil(total/per_page);

        res.render('../views/dashboards/index', {
         title: 'Dashboards',
         results: results,
         page: page,
         per_page: per_page,
         total_pages: total_pages,
         total: total
        });
      });

    } else {

      models.DailyReport.findAndCountAll({
        order: [['report_date', 'DESC']],
        offset: page_offset,
        limit: per_page
      }).then(function(result) {
        var results = result.rows;
        var total = result.count;
        var total_pages = Math.ceil(total/per_page);

        res.render('../views/dashboards/index', {
         title: 'Dashboards',
         results: results,
         page: page,
         per_page: per_page,
         total_pages: total_pages,
         total: total
        });
      });
    }
  });

  return(router);
}
