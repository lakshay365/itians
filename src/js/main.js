// remove preloader when page is loaded
$(window).on('load', function() {
  $('#preloader')
    .delay(500)
    .fadeOut('slow');
  $('body').css('overflow', 'visible');
});

// sideNav options
$('.button-collapse').sideNav({
  menuWidth: 300,
  edge: 'left',
  closeOnClick: true,
  draggable: true
});

function timeParser(timeStrIn) {
  var hourStart = timeStrIn.substring(0, 2);
  var hourEnd = timeStrIn.substring(6, 8);

  if (Number(hourStart) > 12) hourStart = '0' + (Number(hourStart) - 12);
  if (Number(hourEnd) > 12) hourEnd = '0' + (Number(hourEnd) - 12);

  return (
    hourStart + timeStrIn.substring(2, 6) + hourEnd + timeStrIn.substring(8, 11)
  );
}

// timetable generator function
// By Lakshay Mehra
function generateTimetable(section) {
  var url = './src/timetable/it/' + section + '.json';
  var str = '';

  $.getJSON(url, function(data) {
    str += '<ul class="collapsible popout" data-collapsible="accordion">';

    for (var day in data) {
      str +=
        '<li><div class="day-tab collapsible-header"><span class="day-tab-center">';
      str += day.toUpperCase();
      str += '</div></div><div class="collapsible-body">';

      for (var i = 0; i < data[day].length; i++) {
        str +=
          '<div class="row timetable-row"><div class="col s3">' +
          timeParser(data[day][i].time) +
          '</div>';
        str += '<div class="col s6">' + data[day][i].subject + '</div>';
        str += '<div class="col s3">' + data[day][i].place + '</div></div>';
      }

      str += '</div></li>';
    }

    str += '</ul>';

    $('.timetable-container').html(str);
    $('.collapsible').collapsible();
  });
}

$('.tt-btn').on('click', function() {
  var classSec = $(this).data('section');
  $('#cur-class').html('Information Technology ' + classSec);
  generateTimetable(classSec);
});

function fetchComingUp(section) {
  var url = './src/timetable/it/' + section + '.json';
  var str = '';

  $.getJSON(url, function(obj) {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    var timeStr = hours + ':' + minutes;

    var weekday = new Array(7);
    weekday[0] = 'monday';
    weekday[1] = 'monday';
    weekday[2] = 'tuesday';
    weekday[3] = 'wednesday';
    weekday[4] = 'thursday';
    weekday[5] = 'friday';
    weekday[6] = 'monday';

    var comingUp = [];
    var day = date.getDay();

    if (day != 0 && day != 6) {
      for (var i = 0; i < obj[weekday[day]].length; i++) {
        if (obj[weekday[day]][i].subject === 'Break') continue;
        if (obj[weekday[day]][i].time.substring(0, 5) > timeStr) break;
      }

      for (; i < obj[weekday[day]].length; i++) {
        if (obj[weekday[day]][i].subject === 'Break') continue;
        comingUp.push(obj[weekday[day]][i]);
      }
    } else {
      day = 1;
      for (var i = 0; i < obj[weekday[day]].length; i++) {
        if (obj[weekday[day]][i].subject === 'Break') continue;
        comingUp.push(obj[weekday[day]][i]);
      }
    }

    if (comingUp.length == 0) {
      day = (day + 1) % 7;
      for (var i = 0; i < obj[weekday[day]].length; i++) {
        if (obj[weekday[day]][i].subject === 'Break') continue;
        comingUp.push(obj[weekday[day]][i]);
      }
    }

    str +=
      '<div class="row timetable-row"><div class="col s12">' +
      weekday[day].toUpperCase() +
      '</div></div>';

    day = date.getDay();

    if (day != 0 && day != 6) {
      for (i = 0; i < obj[weekday[day]].length; i++) {
        if (obj[weekday[day]][i].subject === 'Break') continue;
        if (
          obj[weekday[day]][i].time.substring(0, 5) <= timeStr &&
          obj[weekday[day]][i].time.substring(6, 11) > timeStr
        ) {
          str +=
            '<div class="row timetable-row"><div class="col s3">' +
            '<div class="live">NOW</div>' +
            '</div>';
          str +=
            '<div class="col s6">' + obj[weekday[day]][i].subject + '</div>';
          str +=
            '<div class="col s3">' +
            obj[weekday[day]][i].place +
            '</div></div>';
          break;
        }
      }
    }

    for (var i = 0; i < comingUp.length; i++) {
      str +=
        '<div class="row timetable-row"><div class="col s3">' +
        timeParser(comingUp[i].time) +
        '</div>';
      str += '<div class="col s6">' + comingUp[i].subject + '</div>';
      str += '<div class="col s3">' + comingUp[i].place + '</div></div>';
    }

    $('#it' + section + '-coming-up').html(str);
  });
}

function gradColor(i) {
  var colors = ['EF6C00', '2E7D32', 'e01563', '1565C0', '6A1B9A', 'e9a820'];
  return 'background: #' + colors[i % colors.length] + ';';
}

function fetchNotes() {
  var url = './src/docs/notes.json';
  var str = '';

  $.getJSON(url, function(data) {
    for (var i = 0; i < data.length; i++) {
      str +=
        '<div class="col m4 s12"> <div class="card"> <div class="notes card-image" style="' +
        gradColor(i) +
        '"> <h3 class="white-text center">' +
        data[i].subject +
        '</h3> </div> <div class="card-content"> <span class="card-title activator grey-text text-darken-4">' +
        data[i].title +
        '<i class="material-icons right">more_vert</i></span> <p><a href="' +
        data[i].download_link +
        '" target="_blank">Direct Download</a></p> </div> <div class="card-reveal"> <span class="card-title grey-text text-darken-4">' +
        data[i].title +
        '<i class="material-icons right">close</i></span> <p> <strong>Credits&nbsp;:</strong>&nbsp;' +
        data[i].credits +
        ' <br> <strong>File Size&nbsp;:</strong>&nbsp;' +
        data[i].size;
      str +=
        '<br> <strong>No of pages &nbsp;:</strong>&nbsp;' +
        data[i].pages +
        '</p> <div class="notes-btn center-align btn-container"> <a class="btn green" href="' +
        data[i].drive_link +
        '" target="_blank"><i class="material-icons left">cloud_download</i>Google Drive</a> <a class="btn blue" href="' +
        encodeURI(data[i].download_link) +
        '" target="_blank"><i class="material-icons left">file_download</i>Download</a> </div> </div> </div> </div>';
    }
    $('.notes-container').html(str);
    $('.reference-container').removeClass('hide');
  });
}
