var process = function (json) {
    var x = 0,
        r = Raphael("chart", 3650,350),
        labels = {},
        textattr = {"font": '9px "Arial"', stroke: "none", fill: "#fff"},
        pathes = {},
        nmhldr = $("#name")[0],
        lgnd = $("#legend")[0],
        label = $("#label")[0],
        plchldr = $("#placeholder")[0];
    var chartTop = 60;
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
    var lineBlocks = [];
    function block() {
        r.rect(0, 0, 4000, chartTop).attr({fill: "#F4F6F1", stroke: "none"}).toFront();
        var p, h;
        finishes();
        var line = r.path("M0 0L0 300").attr({"stroke": "#8a3aFF", "stroke-width":"55", "z-index":1000, opacity: 0});

        for (var j = 0, jj = json.buckets.length; j < jj; j++) {
            var cameras = json.buckets[j].i;
            h = 50 + chartTop;
            for (var i = 0, ii = cameras.length; i < ii; i++) {
                p = pathes[cameras[i][0]];
                if (!p) {
                    p = pathes[cameras[i][0]] = {f:[], b:[]};
                }
                p.f.push([x, h, cameras[i][1]]);
                p.b.unshift([x, h += Math.max(Math.round(Math.log(cameras[i][1]) * 5), 1)]);
                h += 2;
            }
            var dt = new Date(json.buckets[j].date);
            //var dtext = dt.getDate() + " " + ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][dt.getMonth()] + " " + dt.getFullYear();
            var dtext = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][dt.getMonth()] + " " + dt.getFullYear();
            r.rect(x - 4, 0 + chartTop, 98, 50).attr({fill: "#E4E7DC", stroke: "none"}).toFront();
            lineBlocks.push(r.rect(x - 4, 0 + chartTop, 99, 300).attr({fill: "none", stroke: "#F8F8F8", opacity: 0.5, "stroke-width":"1px" }));
            r.text(x + 44, 25 + chartTop, dtext).attr({"font": '11px "Arial"', stroke: "none", fill: "#C2C3BB"}).toFront();
            x += 100;
        }
        r.text(50, 43, "2009").attr({font: "45px 'Arial'", fill: "#D5DCCB", stroke: "none"}).toFront();
        r.text(544, 43, "2010").attr({font: "45px 'Arial'", fill: "#D5DCCB", stroke: "none"}).toFront();
        r.text(1244, 43, "2011").attr({font: "45px 'Arial'", fill: "#D5DCCB", stroke: "none"}).toFront();
        r.text(2244, 43, "2012").attr({font: "45px 'Arial'", fill: "#D5DCCB", stroke: "none"}).toFront();
        r.text(3444, 43, "2013").attr({font: "45px 'Arial'", fill: "#D5DCCB", stroke: "none"}).toFront();
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

            if (X == 50) {X = 65}
            drawLabel(r,X - 44,Y + 19,json.cameras[i]);
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
                _.each(lineBlocks,function(dl){ dl.toFront(); });
                _.each(discLabels,function(dl){ dl.toFront(); });
                label.innerHTML = json.cameras[i].name + " <em>(" + json.cameras[i].brand + ")</em>";
                lgnd.style.backgroundColor = pathes[i].p.attr("fill");
                nmhldr.className = "";
              });
            })(i);
          _.each(lineBlocks,function(dl){ dl.toFront(); });
          _.each(discLabels,function(dl){ dl.toFront(); });
        }
    }
    

    if (json.error) {
        alert("Project not found. Try again.");
    } else {
        block();
    }
};
var discLabels = [];
function drawLabel(r,x,y,cam) {
  c = getColour(cam.brand);
  discLabels.push(r.circle(x,y,19).attr({'stroke-width': 2, 'stroke': shadeColor(c,-10), fill: c }));
  txt = cam.name.split(' ');
  txt = txt.slice(1).join(' ');
  discLabels.push(r.text(x,y, txt.replace('EOS ','').replace('Digital ','').replace(/\ /g,'\n')).attr({font: "9px 'Arial' ", 
                                                      'font-weight': 'normal', 
                                                      fill: '#FFFFFF' }));
}
function getBrandGroups(bucket,cameras) {
  return _.groupBy(_.map(bucket.i, function(b) { return cameras[b[0]].brand }));
}

function getBrandLabels(bucket,cameras) {
  var groups = getBrandGroups(bucket,cameras);
  return _.map(groups,function(k,v) { return v; });
}
function shadeColor(color, percent) {   
  var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, B = (num >> 8 & 0x00FF) + amt, G = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
}
function getBrandValues(bucket,cameras) { 
  var groups = getBrandGroups(bucket,cameras);
  return _.map(groups,function(k,v) { return k.length * 20; });
}
var reds = ["#9A0000","#A50000","#B90000","#CE0000","#DA0000", "#EA0000","#FA0000", "#FF0000","#9A0000","#A50000","#B90000","#CE0000","#DA0000", "#EA0000","#FA0000", "#FF0000"];
function getRed() { return reds.pop(); }

var yellows = ["#F1C62D","#F1C62D","#F1C62D", "#F0C518", "#EDB200","#FFDD00","#F1D63D","#F1C62D", "#F1D63D", "#F1C62D","#F1C62D","#F1C62D","#F1C62D", "#F0C518", "#EDB200","#FFDD00","#F1D63D","#F1C62D", "#F1D63D", "#F1C62D"];
function getYellow() { return yellows.pop(); }

var grays = ["#B2B2B2","#A9A9A9","#B2B2B2","#A9A9A9","#909090", "#999999", "#B2B2B2","#C9C9C9", "#C2C2C2", "#B2B2B2","#B2B2B2","#A9A9A9","#B2B2B2","#A9A9A9","#909090", "#999999", "#B2B2B2","#C9C9C9", "#C2C2C2", "#B2B2B2"];
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
