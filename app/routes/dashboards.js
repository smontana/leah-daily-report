var express = require('express');
var moment = require('moment');
require('locus');


var Hashids = require("hashids");
var hashids = new Hashids("LeAh Is GoInG pLaCeS rtbbly", 12);

module.exports = function (connection, models) {
  var router = express.Router();

  router.get('/new', function(req, res, next){
    var title = 'New Daily Leasing Report';

    res.render('../views/dashboards/new', {
      title: title
    });
  });

  router.post('/', function (req, res, next){
    var form_params = req.body;
    var report_date = form_params.report_date;
    var report_date_formatted = moment(report_date).format("YYYY-MM-DD");

    // console.log(JSON.stringify(req.body, null, 3));

    var submission = {
      report_date: report_date_formatted,
      prelease_percentage_prv_year: form_params.prelease_percentage_prv_year,
      traffic_count_today: form_params.traffic_today,
      traffic_count_week: form_params.traffic_week,
      guarantor_received_count: form_params.guarantor_received_count,
      new_lease_count_today: form_params.new_lease_count_today,
      new_lease_count_week: form_params.new_lease_count_week,
      new_lease_count_YTD: form_params.new_lease_count_YTD,
      renewal_count_today: form_params.renewal_count_today,
      renewal_count_week: form_params.renewal_count_week,
      renewal_count_YTD: form_params.renewal_count_YTD,
      leased_floorplan_1x1: form_params.leased_floorplan_1x1,
      leased_floorplan_2x2a: form_params.leased_floorplan_2x2a,
      leased_floorplan_2x2b: form_params.leased_floorplan_2x2b,
      leased_floorplan_4x2: form_params.leased_floorplan_4x2,
      NOT_leased_floorplan_1x1: form_params.NOT_leased_floorplan_1x1,
      NOT_leased_floorplan_2x2a: form_params.NOT_leased_floorplan_2x2a,
      NOT_leased_floorplan_2x2b: form_params.NOT_leased_floorplan_2x2b,
      NOT_leased_floorplan_4x2: form_params.NOT_leased_floorplan_4x2
    };

    var new_record = models.DailyReport.build(submission);

    new_record.save().then(function(new_record) {

      var redirect_path = '/dashboards/' + new_record.uid;
      res.redirect(redirect_path);
    });
  });

  router.get('/:uid', function (req, res, next){
    var uid = req.params.uid;
    var id = hashids.decode(uid);

    models.DailyReport.findAll({
      where: { id: id }
    }).then(function(report) { 
      console.log(JSON.stringify(report, null, 3));
      var title = 'Daily Leasing Report';
      var report = report[0];
      var report_date = report.report_date_beautify();
      var total_bed_count = parseInt(report.total_bed_count());
      var guarantor_percentage = parseFloat(report.guarantor_percentage());
      var total_lease_count = parseInt(report.total_lease_count());
      var new_lease_percentage = parseFloat(report.new_lease_percentage());
      var renewal_percentage = parseFloat(report.renewal_percentage());
      var prelease_percentage = parseFloat(report.prelease_percentage());
      var prelease_percentage_prv_year = parseFloat(report.prelease_percentage_prv_year);

      guarantor_percentage = (guarantor_percentage * 100).toFixed(2);
      new_lease_percentage = (new_lease_percentage * 100).toFixed(2);
      renewal_percentage = (renewal_percentage * 100).toFixed(2);
      prelease_percentage = prelease_percentage.toFixed(2);
      prelease_percentage_prv_year = (prelease_percentage_prv_year * 100).toFixed(2);

      var console_check = {
        total_bed_count: total_bed_count,
        guarantor_percentage: guarantor_percentage,
        total_lease_count: total_lease_count,
        new_lease_percentage: new_lease_percentage,
        renewal_percentage: renewal_percentage,
        prelease_percentage: prelease_percentage,
        prelease_percentage_prv_year: prelease_percentage_prv_year
      };

      console.log(JSON.stringify(console_check, null, 3));

      res.render('../views/dashboards/show', {
        title: title,
        report: report,
        report_date: report_date,
        total_bed_count: total_bed_count,
        guarantor_percentage: guarantor_percentage,
        total_lease_count: total_lease_count,
        new_lease_percentage: new_lease_percentage,
        renewal_percentage: renewal_percentage,
        prelease_percentage: prelease_percentage,
        prelease_percentage_prv_year: prelease_percentage_prv_year
      });
    });
  });

  var page;
  var per_page;

  router.get('/', function (req, res, next){
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
