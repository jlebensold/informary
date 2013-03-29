var process = function (json) {
    var x = 0,
        r = Raphael("chart", 3650,250),
        labels = {},
        textattr = {"font": '9px "Arial"', stroke: "none", fill: "#fff"},
        pathes = {},
        nmhldr = $("#name")[0],
        lgnd = $("#legend")[0],
        label = $("#label")[0],
        plchldr = $("#placeholder")[0];
    function finishes() {
        for (var i in json.cameras) {
            var start, end;
            for (var j = json.buckets.length - 1; j >= 0; j--) {
                var isin = false;
                for (var k = 0, kk = json.buckets[j].i.length; k < kk; k++) {
                    isin = isin || (json.buckets[j].i[k][0] == i);
                }
                if (isin) {
                    end = j;
                    break;
                }
            }
            for (var j = 0, jj = json.buckets.length; j < jj; j++) {
                var isin = false;
                for (var k = 0, kk = json.buckets[j].i.length; k < kk; k++) {
                    isin = isin || (json.buckets[j].i[k][0] == i);
                };
                if (isin) {
                    start = j;
                    break;
                }
            }
            for (var j = start, jj = end; j < jj; j++) {
                var isin = false;
                for (var k = 0, kk = json.buckets[j].i.length; k < kk; k++) {
                    isin = isin || (json.buckets[j].i[k][0] == i);
                }
                if (!isin) {
                    json.buckets[j].i.push([i, 0]);
                }
            }
        }
    }
    function block() {
        var p, h;
        finishes();
        var line = r.path("M0 0L0 300").attr({"stroke": "#8a3aFF", "stroke-width":"55", "z-index":1000, opacity: 0});

        for (var j = 0, jj = json.buckets.length; j < jj; j++) {
            var users = json.buckets[j].i;
            h = 0;
            for (var i = 0, ii = users.length; i < ii; i++) {
                p = pathes[users[i][0]];
                if (!p) {
                    p = pathes[users[i][0]] = {f:[], b:[]};
                }
                p.f.push([x, h, users[i][1]]);
                p.b.unshift([x, h += Math.max(Math.round(Math.log(users[i][1]) * 5), 1)]);
                h += 2;
            }
            var dt = new Date(json.buckets[j].date);
            var dtext = dt.getDate() + " " + ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][dt.getMonth()] + " " + dt.getFullYear();
                
            r.rect(x - 4, 0, 60, 300).attr({fill: "#DDDDDD", stroke: "none"}).toFront();
            r.text(x + 25, h + 10, dtext).attr({"font": '9px "Arial"', stroke: "none", fill: "#3333FB"}).toFront();
            x += 100;
        }
        var c = 0;
        for (var i in pathes) {
            labels[i] = r.set();
            var clr = Raphael.getColor();
            var clr = getColour(json.cameras[i].brand);
            pathes[i].p = r.path().attr({fill: clr, stroke: clr});
            var path = "M".concat(pathes[i].f[0][0], ",", pathes[i].f[0][1], "L", pathes[i].f[0][0] + 50, ",", pathes[i].f[0][1]);
            var th = Math.round(pathes[i].f[0][1] + (pathes[i].b[pathes[i].b.length - 1][1] - pathes[i].f[0][1]) / 2 + 3);
            var X = pathes[i].f[0][0] + 50,
                Y = pathes[i].f[0][1];
            for (var j = 1, jj = pathes[i].f.length; j < jj; j++) {
                path = path.concat("C", X + 20, ",", Y, ",");
                X = pathes[i].f[j][0];
                Y = pathes[i].f[j][1];
                path = path.concat(X - 20, ",", Y, ",", X, ",", Y, "L", X += 50, ",", Y);
                th = Math.round(Y + (pathes[i].b[pathes[i].b.length - 1 - j][1] - Y) / 2 + 3);
            }
            path = path.concat("L", pathes[i].b[0][0] + 50, ",", pathes[i].b[0][1], ",", pathes[i].b[0][0], ",", pathes[i].b[0][1]);
            for (var j = 1, jj = pathes[i].b.length; j < jj; j++) {
                path = path.concat("C", pathes[i].b[j][0] + 70, ",", pathes[i].b[j - 1][1], ",", pathes[i].b[j][0] + 70, ",", pathes[i].b[j][1], ",", pathes[i].b[j][0] + 50, ",", pathes[i].b[j][1], "L", pathes[i].b[j][0], ",", pathes[i].b[j][1]);
            }
            pathes[i].p.attr({path: path + "z"});
            labels[i].hide();
            var current = null;
            (function (i) {
              pathes[i].p.mouseover(function (e) {
                if (current != null) {
                    labels[current].hide();
                }
                current = i;
                labels[i].show();
                pathes[i].p.toFront();
                labels[i].toFront();
                label.innerHTML = json.cameras[i].name + " <em>(" + json.cameras[i].brand + ")</em>";
                lgnd.style.backgroundColor = pathes[i].p.attr("fill");
                nmhldr.className = "";
              });
            })(i);
        }
        $("#chart").mousemove(function (e) {
          updatePie(e,json,line, this);
        });
    }
    

    if (json.error) {
        alert("Project not found. Try again.");
    } else {
        block();
    }
};
function updatePie(e,json,line, self) {
  var xcoord = e.pageX - $(self).find('svg').offset().left + $("#chart svg").scrollLeft();
  var xcoord = Math.floor(xcoord / 100)*100 + 25 + 1;
  line.animate({ path: "M"+xcoord+" 0L"+xcoord+" 300" , opacity: "0.3"}, 0).toFront();
  $("#pie").empty();
  var bucket = json.buckets[Math.floor(xcoord / 100)];
    pie = Raphael("pie", 700, 700);
    piechart = pie.pieChart(350, 350, 200, 
      getBrandValues(bucket,json.cameras),
      getBrandLabels(bucket,json.cameras), "#fff");
}
function getBrandGroups(bucket,cameras) {
  return _.groupBy(_.map(bucket.i, function(b) { return cameras[b[0]].brand }));
}

function getBrandLabels(bucket,cameras) {
  var groups = getBrandGroups(bucket,cameras);
  return _.map(groups,function(k,v) { return v; });
}

function getBrandValues(bucket,cameras) { 
  var groups = getBrandGroups(bucket,cameras);
  return _.map(groups,function(k,v) { return k.length * 20; });
}
var reds = ["#9A0000","#A50000","#B90000","#CE0000","#DA0000", "#EA0000","#FA0000", "#FF0000"];
function getRed() { return reds.pop(); }

var yellows = ["#FFDD00","#EDBE00","#F0E118", "#F0C518", "#EDB200"];
function getYellow() { return yellows.pop(); }

var grays = ["#AAAAAA","#A9A9A9","#B2B2B2","#C9C9C9","#D5D5D5", "#D9D9D9", "#AAAAAA"];
function getGray() { return grays.pop(); }

function getColour(brand) {
  if (brand == "Apple") return getGray();
  if (brand == "Nikon") return getYellow();
  if (brand == "Canon") return getRed();
}
Raphael.fn.pieChart = function (cx, cy, r, values, labels, stroke) {
    var paper = this,
        rad = Math.PI / 180,
        chart = this.set();
    function sector(cx, cy, r, startAngle, endAngle, params) {
        var x1 = cx + r * Math.cos(-startAngle * rad),
            x2 = cx + r * Math.cos(-endAngle * rad),
            y1 = cy + r * Math.sin(-startAngle * rad),
            y2 = cy + r * Math.sin(-endAngle * rad);
        return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
    }
    var angle = 0,
        total = 0,
        start = 0,
        process = function (j) {
          var bcolor = Raphael.hsb(start, 1, 1);
          var color = Raphael.hsb(start, .75, 1);
          if (labels[j] == "Apple"){
            color = "#CCC";
            bcolor = "#909090";
          }
          if (labels[j] == "Canon"){
            color = "#FF0000";
            bcolor = "#900000";
          }
          if (labels[j] == "Nikon"){
            color = "yellow";
            bcolor = "orange";
          }
          var value = values[j],
          angleplus = 360 * value / total,
          popangle = angle + (angleplus / 2),
          ms = 500,
          delta = 30;
          
          
          p = sector(cx, cy, r, angle, angle + angleplus, {fill: "90-" + bcolor + "-" + color, stroke: stroke, "stroke-width": 3}),
          txt = paper.text(cx + (r + delta + 55) * Math.cos(-popangle * rad), cy + (r + delta + 25) * Math.sin(-popangle * rad), labels[j]).attr({fill: bcolor, stroke: "none", opacity: 1, "font-size": 20});
          angle += angleplus;
          chart.push(p);
          chart.push(txt);
          start += .1;
        };
    for (var i = 0, ii = values.length; i < ii; i++) {
        total += values[i];
    }
    for (i = 0; i < ii; i++) {
        process(i);
    }
    return chart;
};
