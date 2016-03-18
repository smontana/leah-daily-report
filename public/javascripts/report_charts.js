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
      bindto: "#DLR_prelease_report_chart",
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




$(document).ready(function(event){
  success_callback = function(data, status, xhr){
    var path_arr = window.location.pathname.split('/');

    var id = path_arr[path_arr.length-1];

    if (id == 'prelease-report') {
      build_prelease_report(data.data);

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
