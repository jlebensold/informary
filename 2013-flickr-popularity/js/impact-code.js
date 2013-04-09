var process = function (json) {
    var x = 0,
        r = Raphael("chart", 3650,350),
        labels = {},
        textattr = {"font": '9px Quattrocento Sans', stroke: "none", fill: "#fff"},
        pathes = {},
        lgnd = $("#legend")[0],
        label = $("#label")[0],
        plchldr = $("#placeholder")[0];
    var chartTop = 59;
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
        r.rect(-400, 0, 5000, chartTop).attr({fill: "#F4F6F1", stroke: "none"}).toFront();
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
            var dtext = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][dt.getMonth()] + " " + dt.getFullYear();
            r.rect(x - 4, 0 + chartTop, 98, 50).attr({fill: "#E4E7DC", stroke: "none"}).toFront();
            lineBlocks.push(r.rect(x - 4, 0 + chartTop, 99, 300).attr({fill: "none", stroke: "#F8F8F8", opacity: 0.5, "stroke-width":"1px" }));
            r.text(x + 44, 25 + chartTop, dtext).attr({"font": '11px "Arial"', stroke: "none", fill: "#C2C3BB"}).toFront();
            x += 100;
        }
        var yearAttr = {font: "45px 'Quattrocento Sans'", fill: "#D5DCCB", stroke: "none", 'font-weight': 'bold'};
        r.text(52,   45, "2009").attr(yearAttr).toFront();
        r.text(546,  45, "2010").attr(yearAttr).toFront();
        r.text(1246, 45, "2011").attr(yearAttr).toFront();
        r.text(2246, 45, "2012").attr(yearAttr).toFront();
        r.text(3446, 45, "2013").attr(yearAttr).toFront();
        var c = 0;
        for (var i in pathes) {
            labels[i] = r.set();
            var th = Math.round(pathes[i].f[0][1] + (pathes[i].b[pathes[i].b.length - 1][1] - pathes[i].f[0][1]) / 2 + 3);
            var X = pathes[i].f[0][0] + 50,
                Y = pathes[i].f[0][1];


            if (X == 50) {X = 72; }
            drawLabel(r,X - 48,Y + 22.5,json.cameras[i]);

            var clr = getColour(json.cameras[i].brand);

// begin drawing lines
            var offset = 20;
            var xAdder = 50;
            pathes[i].p = r.path().attr({fill: clr, stroke: clr});
            var path = "M".concat(pathes[i].f[0][0], ",", pathes[i].f[0][1], "L", pathes[i].f[0][0] + xAdder, ",", pathes[i].f[0][1]);

            for (var j = 1, jj = pathes[i].f.length; j < jj; j++) {
                path = path.concat("C", X + offset, ",", Y, ",");
                X = pathes[i].f[j][0];
                Y = pathes[i].f[j][1];
                path = path.concat(X - offset, ",", Y, ",", X, ",", Y, "L", X += xAdder, ",", Y);
                th = Math.round(Y + (pathes[i].b[pathes[i].b.length - 1 - j][1] - Y) / 2 + 3);
            }
            path = path.concat("L", pathes[i].b[0][0] + xAdder, ",", pathes[i].b[0][1], ",", pathes[i].b[0][0], ",", pathes[i].b[0][1]);
            for (var j = 1, jj = pathes[i].b.length; j < jj; j++) {
                path = path.concat("C", pathes[i].b[j][0] + 70, ",", pathes[i].b[j - 1][1], ",", pathes[i].b[j][0] + 70, ",", pathes[i].b[j][1], ",", pathes[i].b[j][0] + xAdder, ",", pathes[i].b[j][1], "L", pathes[i].b[j][0], ",", pathes[i].b[j][1]);
            }
            drawFinish(r,X - 5,Y + 22.5,clr);
// end drawing lines
            pathes[i].p.attr({path: path + "z"});
            labels[i].hide();
            var current = null;
            (function (i) {
              pathes[i].p.mouseover(function (e) {
                if (current != null) {
                    labels[current].hide();
                }
                current = i;
                $(".legend").html(json.cameras[i].name);
              });
            })(i);
          $("svg").mouseout(function(e) { $(".legend").html('<small><em>Hover over the track to view the camera model</em></small>'); });

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
function drawFinish(r,x,y,color) {
  discLabels.push(r.circle(x,y,21).attr({'stroke-width': 4, 'stroke': color, fill: color }));
}
function drawLabel(r,x,y,cam) {
  c = getColour(cam.brand);
  discLabels.push(r.circle(x,y,21).attr({'stroke-width': 4, 'stroke': shadeColor(c,10), fill: c }));
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
var reds = [
    
            "#9D000E","#9D000E",
            "#BC0013", "#BC0013",
            "#A23433","#A23433",
            "#C70000","#C70000",
            "#E93A3D","#E93A3D",
            "#BD4342","#BD4342",
            "#9D000E","#9D000E",
            "#BC0013", "#BC0013"
            ];
function getRed() { return reds.pop(); }
var yellows = [
            "#FEC108","#FEC108",
            "#FEDA0A","#FEDA0A"
          ];
function getYellow() { return yellows.pop(); }

var grays= [
            "#6f6f6f","#6f6f6f",
            "#A0A0A0","#A0A0A0",
            "#989898","#989898",
            "#c0c0c0","#c0c0c0",
            "#6f6f6f","#6f6f6f",
            "#A0A0A0","#A0A0A0",
            "#989898","#989898",
            "#c0c0c0","#c0c0c0"
            ];
function getGray() { return grays.pop(); }

function getColour(brand) {
  if (brand == "Apple") return getGray();
  if (brand == "Nikon") return getYellow();
  if (brand == "Canon") return getRed();
}
