var express = require('express');
var Sequelize = require('sequelize');
var _ = require('lodash');
var moment = require('moment');

module.exports = function(connection, models) {
  var router = express.Router();

  router.get('/:id/timeseries_chart', function(req, res, next){
    var id = req.params.id;

    if (id == 'prelease-report') {
      var query = "SELECT \
        DATE_FORMAT(`d`.`report_date`, '%Y-%m-%d') AS `report_date`, \
        SUM(`d`.`prelease_percentage_prv_year`) AS `prv_prelease_pct`, \
        SUM(`d`.`new_lease_count_YTD` + `d`.`renewal_count_YTD`) AS `total_lease_count`, \
        SUM(`d`.`leased_floorplan_1x1` + `d`.`leased_floorplan_2x2a` + `d`.`leased_floorplan_2x2b` + `d`.`leased_floorplan_4x2` + `d`.`NOT_leased_floorplan_1x1` + `d`.`NOT_leased_floorplan_2x2a` + `d`.`NOT_leased_floorplan_2x2b` + `d`.`NOT_leased_floorplan_4x2`) AS `total_bed_count` \
        FROM `DailyReports` AS `d` \
        GROUP BY `d`.`report_date` \
        ORDER BY `d`.`report_date`";

    } else if (id == 'unit-lease-report') {
      var query = "SELECT \
        DATE_FORMAT(`d`.`report_date`, '%Y-%m-%d') AS `report_date`, \
        SUM(`d`.`leased_floorplan_1x1`) AS `leased_floorplan_1x1`, \
        SUM(`d`.`leased_floorplan_2x2a`) AS `leased_floorplan_2x2a`, \
        SUM(`d`.`leased_floorplan_2x2b`) AS `leased_floorplan_2x2b`, \
        SUM(`d`.`leased_floorplan_4x2`) AS `leased_floorplan_4x2`, \
        SUM(`d`.`leased_floorplan_1x1` + `d`.`NOT_leased_floorplan_1x1`) AS `floorplan_1x1_total`, \
        SUM(`d`.`leased_floorplan_2x2a` + `d`.`NOT_leased_floorplan_2x2a`) AS `floorplan_2x2a_total`, \
        SUM(`d`.`leased_floorplan_2x2b` + `d`.`NOT_leased_floorplan_2x2b`) AS `floorplan_2x2b_total`, \
        SUM(`d`.`leased_floorplan_4x2` + `d`.`NOT_leased_floorplan_4x2`) AS `floorplan_4x2_total` \
        FROM `DailyReports` AS `d` \
        GROUP BY `d`.`report_date` \
        ORDER BY `d`.`report_date`";

    // }else if (id == 'qpa-avg-weekly-report') {
    //   var query = "SELECT \
    //     DATE_FORMAT(`qpa_overall`.`week_ending`, '%Y-%m-%d') AS `week_ending`, \
    //     (`qpa_overall`.`overall_qpa_score` * 100) AS `overall_qpa_score` \
    //     FROM `qpa_overall_report` AS `qpa_overall` \
    //     GROUP BY DATE_FORMAT(`qpa_overall`.`week_ending`, '%Y-%m-%d'), (`qpa_overall`.`overall_qpa_score` * 100)";

    // }else if (id == 'chat-conversion-report-rates' || id == 'chat-conversion-report-totals') {
    //   var query = "SELECT \
    //     DATE_FORMAT(`chat_conversion_overall`.`week_ending`, '%Y-%m-%d') AS `week_ending`, \
    //     `chat_conversion_overall`.`bounce_count` AS `bounce_count`, \
    //     `chat_conversion_overall`.`modified_chat_count` AS `modified_chat_count`, \
    //     `chat_conversion_overall`.`raw_chat_count` AS `raw_chat_count`, \
    //     (`chat_conversion_overall`.`modified_conversion_rate` * 100) AS `modified_conversion_rate`, \
    //     (`chat_conversion_overall`.`raw_conversion_rate` * 100) AS `raw_conversion_rate`, \
    //     (`chat_conversion_overall`.`delta` * 100) AS `delta` \
    //     FROM `chat_conversion_overall_report` AS `chat_conversion_overall` \
    //     GROUP BY `chat_conversion_overall`.`week_ending`";

    // }else if (id == 'agent-chat-conversion-report-rates' || id == 'agent-chat-conversion-report-totals') {
    //   var query = "SELECT \
    //     DATE_FORMAT(`agent_chat_conversion`.`week_ending`, '%Y-%m-%d') AS `week_ending`, \
    //     `agent_chat_conversion`.`agent` AS `agent`, \
    //     `agent_chat_conversion`.`bounce_count` AS `bounce_count`, \
    //     `agent_chat_conversion`.`modified_chat_count` AS `modified_chat_count`, \
    //     `agent_chat_conversion`.`raw_chat_count` AS `raw_chat_count`, \
    //     `agent_chat_conversion`.`modified_conversion_rate` AS `modified_conversion_rate`, \
    //     `agent_chat_conversion`.`raw_conversion_rate` AS `raw_conversion_rate`, \
    //     `agent_chat_conversion`.`delta` AS `delta` \
    //     FROM `chat_agent_conversion_report` AS `agent_chat_conversion` \
    //     ORDER BY `agent_chat_conversion`.`week_ending` DESC, agent";

    }

    connection.query(query, { type: connection.QueryTypes.SELECT }).then(function(results) {
      var data = results;

      console.log(data);

      res.json({status: 'ok', data: data});
    });
  });

  router.get('/:id', function(req, res, next){
    var id = req.params.id;

    models.Report.find({
      where: {report_id: id}
    }).then(function(report) {
      var id = report.report_id;
      var report_name = report.name;

    res.render('../views/reports/show', {
      title: report_name,
      report: report,
      report_id: id
      });
    });
  });

  router.get('/', function(req, res, next){
    models.Report.findAll({
      order: [['id', 'ASC']]
    }).then(function(reports) {
    res.render('reports/index', {
        title: 'Reports',
        reports: reports
      });
    });
  });

  return(router);
}