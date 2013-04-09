var process = function (json) {
    var x = 0,
        r = Raphael("chart", 3650,309),
        labels = {},
        textattr = {"font": '9px "Arial"', stroke: "none", fill: "#fff"},
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
        r.rect(-100, 0, 4000, chartTop).attr({fill: "#F4F6F1", stroke: "none"}).toFront();
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
        var yearAttr = {font: "45px 'Arial'", fill: "#D5DCCB", stroke: "none"};
        r.text(52,   44, "2009").attr(yearAttr).toFront();
        r.text(546,  44, "2010").attr(yearAttr).toFront();
        r.text(1246, 44, "2011").attr(yearAttr).toFront();
        r.text(2246, 44, "2012").attr(yearAttr).toFront();
        r.text(3446, 44, "2013").attr(yearAttr).toFront();
        var c = 0;
        for (var i in pathes) {
            labels[i] = r.set();
            var th = Math.round(pathes[i].f[0][1] + (pathes[i].b[pathes[i].b.length - 1][1] - pathes[i].f[0][1]) / 2 + 3);
            var X = pathes[i].f[0][0] + 50,
                Y = pathes[i].f[0][1];
            var clr = getColour(json.cameras[i].brand);


            if (X == 50) {X = 65}
            drawLabel(r,X - 44,Y + 19,json.cameras[i]);


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
// end drawing lines
            pathes[i].p.attr({path: path + "z"});
            labels[i].hide();
            var current = null;
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
var reds = [
            "#c00000", "#a43833","#bf4842","#ea443c","#6e0000","#a10000",
            "#c00000","#a43833","#bf4842","#ea443c","#6e0000","#a10000",
            "#c00000","#a43833","#bf4842","#ea443c","#6e0000","#a10000",
            "#c00000","#a43833","#bf4842","#ea443c","#6e0000","#a10000",
            "#c00000","#a43833","#bf4842","#ea443c","#6e0000","#a10000"];
function getRed() { return reds.pop(); }
var yellows = [
            "#ffd802","#fff000","#ffc000",
            "#ffd802","#fff000","#ffc000",
            "#ffd802","#fff000","#ffc000",
            "#ffd802","#fff000","#ffc000",
            "#ffd802","#fff000","#ffc000",
          ];
function getYellow() { return yellows.pop(); }

var grays= [
            "#4f4f4f","#6b6b6b","#989898","#c0c0c0",
            "#4f4f4f","#6b6b6b","#989898","#c0c0c0",
            "#4f4f4f","#6b6b6b","#989898","#c0c0c0",
            "#4f4f4f","#6b6b6b","#989898","#c0c0c0"
            ];
function getGray() { return grays.pop(); }

function getColour(brand) {
  if (brand == "Apple") return getGray();
  if (brand == "Nikon") return getYellow();
  if (brand == "Canon") return getRed();
}
