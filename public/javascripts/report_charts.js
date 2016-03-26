function build_prelease_report(data) {
  prelease_percentage = _.map(data, function(stats) {
    var prelease_pct = ((stats.total_lease_count / stats.total_bed_count) * 100);
    return prelease_pct.toFixed(2);
  })
  prelease_percentage.unshift('prelease_percentage');

  prv_prelease_percentage = _.map(data, function(stats) {
    var prv_prelease_pct = (stats.prv_prelease_pct * 100);
    return prv_prelease_pct.toFixed(2);
  })
  prv_prelease_percentage.unshift('prv_prelease_percentage');

  dates = _.map(data, function(stats) {
    return stats.report_date
  })
  dates.unshift('x');

  var chart = c3.generate({
      bindto: "#report_chart",
      data: {
          x: 'x',
  //        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
          columns: [
              dates,
              prelease_percentage,
              prv_prelease_percentage
          ],
          names: {
            dates: 'Date',
            prelease_percentage: 'Prelease %',
            prv_prelease_percentage: 'Previous Year\'s Prelease %'
          },
          labels: true
      },
      axis: {
          x: {
              type: 'timeseries',
              tick: {
                  format: '%m-%d-%y',
                  fit: true
              }
          }
      },
      grid: {
        x: {
            show: true
        },
        y: {
            show: true
        }
    }
  });
}

function build_unit_lease_type_report(data) {
  floorplan_1x1_percentage = _.map(data, function(stats) {
    var floorplan_1x1_pct = ((stats.leased_floorplan_1x1 / stats.floorplan_1x1_total) * 100);
    return floorplan_1x1_pct.toFixed(2);
  })
  floorplan_1x1_percentage.unshift('floorplan_1x1_percentage');

  floorplan_2x2a_percentage = _.map(data, function(stats) {
    var floorplan_2x2a_pct = ((stats.leased_floorplan_2x2a / stats.floorplan_2x2a_total) * 100);
    return floorplan_2x2a_pct.toFixed(2);
  })
  floorplan_2x2a_percentage.unshift('floorplan_2x2a_percentage');

  floorplan_2x2b_percentage = _.map(data, function(stats) {
    var floorplan_2x2b_pct = ((stats.leased_floorplan_2x2b / stats.floorplan_2x2b_total) * 100);
    return floorplan_2x2b_pct.toFixed(2);
  })
  floorplan_2x2b_percentage.unshift('floorplan_2x2b_percentage');

  floorplan_4x2_percentage = _.map(data, function(stats) {
    var floorplan_4x2_pct = ((stats.leased_floorplan_4x2 / stats.floorplan_4x2_total) * 100);
    return floorplan_4x2_pct.toFixed(2);
  })
  floorplan_4x2_percentage.unshift('floorplan_4x2_percentage');

  dates = _.map(data, function(stats) {
    return stats.report_date
  })
  dates.unshift('x');

  var chart = c3.generate({
      bindto: "#report_chart",
      data: {
          x: 'x',
  //        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
          columns: [
              dates,
              floorplan_1x1_percentage,
              floorplan_2x2a_percentage,
              floorplan_2x2b_percentage,
              floorplan_4x2_percentage
          ],
          names: {
            dates: 'Date',
            floorplan_1x1_percentage: '1x1 Leased %',
            floorplan_2x2a_percentage: '2x2 A Leased %',
            floorplan_2x2b_percentage: '2x2 B Leased %',
            floorplan_4x2_percentage: '4x2 Leased %',
          },
          labels: false
      },
      axis: {
          x: {
              type: 'timeseries',
              tick: {
                  format: '%m-%d-%y',
                  fit: true
              },
          }
      },
      grid: {
        x: {
            show: true
        },
        y: {
            show: true
        }
    }
  });
}

$(document).ready(function(event){
  success_callback = function(data, status, xhr){
    var path_arr = window.location.pathname.split('/');

    var id = path_arr[path_arr.length-1];

    if (id == 'prelease-report') {
      build_prelease_report(data.data);

    }else if (id == 'unit-lease-report') {
      build_unit_lease_type_report(data.data);

    // }else if (id == 'qpa-avg-weekly-report') {
    //   build_timeseries_chart_qpa_weekly(data.data);
    
    // }else if (id == 'chat-conversion-report-rates') {
    //   build_timeseries_chart_chat_weekly_one(data.data);

    // }else if (id == 'chat-conversion-report-totals') {
    //   build_timeseries_chart_chat_weekly_two(data.data);

    }
  }

  $.ajax({
    url: window.location + '/timeseries_chart',
    method: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    success: success_callback,
    error: function(xhr, status, error) {
      console.log("ERROR")
      console.log(error);
    }
  })
})
