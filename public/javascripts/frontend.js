var path_arr = window.location.pathname.split('/');
var route = path_arr[path_arr.length-1];

$(document).ready(function(event){
  $('.datepicker').pickadate();

  // -------------------------------------------------

  // $('#confirm_modal').click(function() {
  //   // get all the inputs into an array.
  //   var $inputs = $('#myForm :input');

  //   // get an associative array of just the values.
  //   var form_values = {};

  //   $inputs.each(function() {
  //       form_values[this.name] = $(this).val();
  //   });

  // });

  // -------------------------------------------------

  $('#confirm_modal').click(function() {
    var show_prv_prelease_pct = ($('#prelease_percentage_prv_year').val() * 100).toFixed(2) + ' %'; 

    $('#report_date_show').text($('#report_date').val());
    $('#prelease_percentage_prv_year_show').text(show_prv_prelease_pct);
    $('#traffic_today_show').text($('#traffic_today').val());
    $('#traffic_week_show').text($('#traffic_week').val());
    $('#guarantor_received_count_show').text($('#guarantor_received_count').val());
    $('#new_lease_count_today_show').text($('#new_lease_count_today').val());
    $('#new_lease_count_week_show').text($('#new_lease_count_week').val());
    $('#new_lease_count_YTD_show').text($('#new_lease_count_YTD').val());
    $('#renewal_count_today_show').text($('#renewal_count_today').val());
    $('#renewal_count_week_show').text($('#renewal_count_week').val());
    $('#renewal_count_YTD_show').text($('#renewal_count_YTD').val());
    $('#leased_floorplan_1x1_show').text($('#leased_floorplan_1x1').val());
    $('#leased_floorplan_2x2a_show').text($('#leased_floorplan_2x2a').val());
    $('#leased_floorplan_2x2b_show').text($('#leased_floorplan_2x2b').val());
    $('#leased_floorplan_4x2_show').text($('#leased_floorplan_4x2').val());
    $('#leased_furnished_count_2x2_show').text($('#leased_furnished_count_2x2').val());
    $('#total_furnished_count_2x2_show').text($('#total_furnished_count_2x2').val());
    $('#leased_furnished_count_4x2_show').text($('#leased_furnished_count_4x2').val());
    $('#total_furnished_count_4x2_show').text($('#total_furnished_count_4x2').val());

  });

  // $('#form_submit').click(function(){
  //   alert('submitting');
  //   $('#formfield').submit();
  // });

  // -------------------------------------------------

  if (route == 'emp_login') {
    initLocalClocks();
    moveSecondHands();
    setUpMinuteHands();
    initDigitalClock();
  }

  /*
   * Starts any clocks using the user's local time
   */
  function initLocalClocks() {
    // Get the local time using JS
    var date = new Date;
    var seconds = date.getSeconds();
    var minutes = date.getMinutes();
    var hours = date.getHours();

    // Create an object with each hand and it's angle in degrees
    var hands = [
      {
        hand: 'hours',
        angle: (hours * 30) + (minutes / 2)
      },
      {
        hand: 'minutes',
        angle: (minutes * 6)
      },
      {
        hand: 'seconds',
        angle: (seconds * 6)
      }
    ];
    // Loop through each of these hands to set their angle
    for (var j = 0; j < hands.length; j++) {
      var elements = document.querySelectorAll('.' + hands[j].hand);
      for (var k = 0; k < elements.length; k++) {
        elements[k].style.webkitTransform = 'rotateZ('+ hands[j].angle +'deg)';
        elements[k].style.transform = 'rotateZ('+ hands[j].angle +'deg)';
        // If this is a minute hand, note the seconds position (to calculate minute position later)
        if (hands[j].hand === 'minutes') {
          elements[k].parentNode.setAttribute('data-second-angle', hands[j + 1].angle);
        }
      }
    }
  }

  /*
   * Move the second containers
   */
  function moveSecondHands() {
    var containers = document.querySelectorAll('.seconds-container');
    setInterval(function() {
      for (var i = 0; i < containers.length; i++) {
        if (containers[i].angle === undefined) {
          containers[i].angle = 6;
        } else {
          containers[i].angle += 6;
        }
        containers[i].style.webkitTransform = 'rotateZ('+ containers[i].angle +'deg)';
        containers[i].style.transform = 'rotateZ('+ containers[i].angle +'deg)';
      }
    }, 1000);
  }

  /*
   * Set a timeout for the first minute hand movement (less than 1 minute), then rotate it every minute after that
   */
  function setUpMinuteHands() {
    // Find out how far into the minute we are
    var containers = document.querySelectorAll('.minutes-container');
    var secondAngle = containers[0].getAttribute("data-second-angle");
    if (secondAngle > 0) {
      // Set a timeout until the end of the current minute, to move the hand
      var delay = (((360 - secondAngle) / 6) + 0.1) * 1000;
      setTimeout(function() {
        moveMinuteHands(containers);
      }, delay);
    }
  }

  /*
   * Do the first minute's rotation
   */
  function moveMinuteHands(containers) {
    for (var i = 0; i < containers.length; i++) {
      containers[i].style.webkitTransform = 'rotateZ(6deg)';
      containers[i].style.transform = 'rotateZ(6deg)';
    }
    // Then continue with a 60 second interval
    setInterval(function() {
      for (var i = 0; i < containers.length; i++) {
        if (containers[i].angle === undefined) {
          containers[i].angle = 12;
        } else {
          containers[i].angle += 6;
        }
        containers[i].style.webkitTransform = 'rotateZ('+ containers[i].angle +'deg)';
        containers[i].style.transform = 'rotateZ('+ containers[i].angle +'deg)';
      }
    }, 60000);
  }

  /*
   * Big Digital Clock setup
   */
  function initDigitalClock() {

    function showTime() {
      var a_p = "";
      var today = new Date();
      var curr_hour = today.getHours();
      var curr_minute = today.getMinutes();
      var curr_second = today.getSeconds();

      if (curr_hour < 12) {
        a_p = "<span>AM</span>";
      } else {
        a_p = "<span>PM</span>";
      }
      if (curr_hour == 0) {
        curr_hour = 12;
      }
      if (curr_hour > 12) {
        curr_hour = curr_hour - 12;
      }

      curr_hour = checkTime(curr_hour);
      curr_minute = checkTime(curr_minute);
      curr_second = checkTime(curr_second);

      document.getElementById('clock-large').innerHTML=curr_hour + ":" + curr_minute + ":" + curr_second + " " + a_p;
    }

    function checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    }

    setInterval(showTime, 500);
    
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var myDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var thisDay = date.getDay(),
        thisDay = myDays[thisDay];
    var yy = date.getYear();
    var year = (yy < 1000) ? yy + 1900 : yy;

    document.getElementById('date-large').innerHTML="<b>" + thisDay + "</b>, " + day + " " + months[month] + " " + year;
  }

});