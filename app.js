const NodeID3 = require('node-id3');
const fs = require('fs');
const async = require("async");

const reaper_file = "C:/Users/Filipe Cruz/Documents/_audiowork/enrshow/enrshow030/enrshow030.rpp";

let obj = [];

fs.readFile(reaper_file, 'utf8', function(err, data) {
  if (err) throw err;
  var lines = data.split(/\r?\n/);
  let counter = 0;
  async.eachSeries(lines, function iteratee(val, callback) {
		if (val == '    <ITEM') {
			//console.log(val);
			var position = lines[counter+1].substr(15);
			//console.log(position);
			let thisvalue = position;
			var filename = lines[counter+19].substr(14);
			var file = filename.substr(0,filename.length-3);
			//console.log(file);
			counter++;
			NodeID3.read(file, function(err, tags) { 
				if (tags != undefined) obj.push({"position": thisvalue.toHHMMSS(), "artist": tags.artist, "track": tags.title, "album": tags.album});
				//console.log(tags.artist + ' - ' + tags.title + ' [' + thisvalue.toHHMMSS() + ']');
				callback();
			})
		} else {
			if (val == ">") {
				obj.sort(function(a,b){ return a["position"].localeCompare(b["position"]); });
				for (var i=0; i<obj.length; i++){
					var fnumber = ("0" + (i+1)).slice(-2);
					//console.log(fnumber + ') ' + obj[i].artist + ' - ' + obj[i].track + ' ['+obj[i].position+'] (' + obj[i].album + ')');
					console.log(fnumber + ') ' + obj[i].artist + ' - ' + obj[i].track + ' ['+obj[i].position+']');
				}
				callback();
			} else {
				counter++;
				callback();
			}
		}
  });
});

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}
