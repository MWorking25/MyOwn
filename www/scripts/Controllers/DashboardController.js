angular.module('MyApp')
  .controller('DashboardController', function ($scope, $http, $route) {

    M.AutoInit();

    $scope.SignOut = function () {
      $http({
        method: 'GET',
        url: '/api/SignOut/',
        dataType: 'jsonp'
      }).then(function (response) {
        alert(response.data.message)
        location.href = "index.html";
      });
    };

    $scope.openNav = function () {
      document.getElementById("mySidenav").style.width = "250px";
    }

    $scope.closeNav = function () {
      document.getElementById("mySidenav").style.width = "0";
    }

    $scope.HitNav = function () {
      if (document.getElementById("mySidenav").style.width == '' || document.getElementById("mySidenav").style.width == '0px') {
        $scope.openNav()
      } else {
        $scope.closeNav();
      }

    }

    $(document).click(function (e) {
      if ($(e.target).is('.container,.container *')) {
        $scope.closeNav();
      } else {

      }
    });


    $scope.NotificationsList = []
    for (var i = 0; i < 15; i++) {
      $scope.NotificationsList.push({
        message: "message text" + i
      })
    }

    $scope.getMonthlyStockStatement = function () {

      am4core.useTheme(am4themes_animated);
      // Themes end

      // Create chart instance
      var chart = am4core.create("monthlyprdsheet", am4charts.XYChart);

      // Add percent sign to all numbers
      chart.numberFormatter.numberFormat = "#.3'%'";

      // Add data
      chart.data = [{
        "country": "USA",
        "year2004": 3.5,
        "year2005": 4.2
      }, {
        "country": "UK",
        "year2004": 1.7,
        "year2005": 3.1
      }, {
        "country": "Canada",
        "year2004": 2.8,
        "year2005": 2.9
      }, {
        "country": "Japan",
        "year2004": 2.6,
        "year2005": 2.3
      }, {
        "country": "France",
        "year2004": 1.4,
        "year2005": 2.1
      }, {
        "country": "Brazil",
        "year2004": 2.6,
        "year2005": 4.9
      }];

      // Create axes
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "country";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 30;

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = "GDP growth rate";
      valueAxis.title.fontWeight = 800;

      // Create series
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "year2004";
      series.dataFields.categoryX = "country";
      series.clustered = false;
      series.tooltipText = "GDP grow in {categoryX} (2004): [bold]{valueY}[/]";

      var series2 = chart.series.push(new am4charts.ColumnSeries());
      series2.dataFields.valueY = "year2005";
      series2.dataFields.categoryX = "country";
      series2.clustered = false;
      series2.columns.template.width = am4core.percent(50);
      series2.tooltipText = "GDP grow in {categoryX} (2005): [bold]{valueY}[/]";

      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineX.disabled = true;
      chart.cursor.lineY.disabled = true;
    };


    $scope.TopTenSaledProducts = function () {
      am4core.useTheme(am4themes_animated);
      // Create chart instance
      var chart = am4core.create("toptensaledprd", am4charts.RadarChart);

      // Add data
      chart.data = [{
        "category": "Research",
        "value": 80,
        "full": 100
      }, {
        "category": "Marketing",
        "value": 35,
        "full": 100
      }, {
        "category": "Distribution",
        "value": 92,
        "full": 100
      }, {
        "category": "Human Resources",
        "value": 68,
        "full": 100
      }, {
        "category": "Human Resources1",
        "value": 68,
        "full": 100
      }, {
        "category": "Human Resources2",
        "value": 68,
        "full": 100
      }, {
        "category": "Human Resources 3",
        "value": 68,
        "full": 100
      }, {
        "category": "Human Resources 4",
        "value": 68,
        "full": 100
      }, {
        "category": "Human Resources 5",
        "value": 68,
        "full": 100
      }, {
        "category": "Human Resources 6",
        "value": 68,
        "full": 100
      }];

      // Make chart not full circle
      chart.startAngle = -90;
      chart.endAngle = 180;
      chart.innerRadius = am4core.percent(20);

      // Set number format
      chart.numberFormatter.numberFormat = "#.#'%'";

      // Create axes
      var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "category";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.grid.template.strokeOpacity = 0;
      categoryAxis.renderer.labels.template.horizontalCenter = "right";
      categoryAxis.renderer.labels.template.fontWeight = 500;
      categoryAxis.renderer.labels.template.adapter.add("fill", function (fill, target) {
        return (target.dataItem.index >= 0) ? chart.colors.getIndex(target.dataItem.index) : fill;
      });
      categoryAxis.renderer.minGridDistance = 10;

      var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.grid.template.strokeOpacity = 0;
      valueAxis.min = 0;
      valueAxis.max = 100;
      valueAxis.strictMinMax = true;

      // Create series
      var series1 = chart.series.push(new am4charts.RadarColumnSeries());
      series1.dataFields.valueX = "full";
      series1.dataFields.categoryY = "category";
      series1.clustered = false;
      series1.columns.template.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
      series1.columns.template.fillOpacity = 0.08;
      series1.columns.template.cornerRadiusTopLeft = 20;
      series1.columns.template.strokeWidth = 0;
      series1.columns.template.radarColumn.cornerRadius = 20;

      var series2 = chart.series.push(new am4charts.RadarColumnSeries());
      series2.dataFields.valueX = "value";
      series2.dataFields.categoryY = "category";
      series2.clustered = false;
      series2.columns.template.strokeWidth = 0;
      series2.columns.template.tooltipText = "{category}: [bold]{value}[/]";
      series2.columns.template.radarColumn.cornerRadius = 20;

      series2.columns.template.adapter.add("fill", function (fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
      });

      // Add cursor
      chart.cursor = new am4charts.RadarCursor();
    };



    $scope.BrandWiseSale = function () {
      am4core.useTheme(am4themes_animated);
      var data = {
        "Acura": {
          "ILX": 11757,
          "MDX": 54886,
          "NSX": 581,
          "RDX": 51295,
          "RLX": 1237,
          "TLX": 34846
        },
        "Alfa Romeo": {
          "4C": 407,
          "Giulia": 8903,
          "Stelvio": 2721
        },
        "Audi": {
          "A3": 20733,
          "A3 e-tron": 2877,
          "A4": 37674,
          "A5": 21301,
          "A6": 16304,
          "A7": 4810,
          "A8": 3127,
          "Q3": 20633,
          "Q5": 57640,
          "Q7": 38346,
          "R8": 772,
          "TT": 2294
        },
        "Bentley": {
          "Bentayga": 1152,
          "Continental GT": 898,
          "Flying Spur": 257,
          "Mulsanne": 98
        },
        "BMW": {
          "2-Series": 11737,
          "3-Series": 59449,
          "4-Series": 39634,
          "5-Series": 40658,
          "6-Series": 3355,
          "7-Series": 9276,
          "i3": 6276,
          "i8": 488,
          "X1": 30826,
          "X3": 40691,
          "X4": 5198,
          "X5": 50815,
          "X6": 6780,
          "Z4": 502
        },
        "Buick": {
          "Cascada": 5595,
          "Enclave": 48564,
          "Encore": 88035,
          "Envision": 41040,
          "LaCrosse": 20161,
          "Regal": 11559,
          "Verano": 4277
        },
        "Cadillac": {
          "ATS": 13100,
          "CT6": 10542,
          "CTS": 10344,
          "ELR": 17,
          "Escalade": 37694,
          "SRX": 156,
          "XT5": 68312,
          "XTS": 16275
        },
        "Chevrolet": {
          "Bolt": 23297,
          "Camaro": 67940,
          "Caprice PPV": 693,
          "City Express": 8348,
          "Colorado": 112996,
          "Corvette": 25079,
          "Cruze": 184751,
          "Equinox": 290458,
          "Express": 69164,
          "Impala": 75877,
          "Malibu": 185857,
          "Silverado": 585864,
          "Sonic": 30290,
          "Spark": 22589,
          "SS": 4055,
          "Suburban": 56516,
          "Tahoe": 98961,
          "Traverse": 123506,
          "Trax": 79289,
          "Volt": 20349
        },
        "Chrysler": {
          "200": 18457,
          "300": 51237,
          "Pacifica": 118274,
          "Town & Country": 577
        },
        "Dodge": {
          "Avenger": 14,
          "Challenger": 64537,
          "Charger": 88351,
          "Dart": 10082,
          "Durango": 68761,
          "Grand Caravan": 125196,
          "Journey": 89470,
          "Viper": 585,
          "RAM P/U": 500723,
          "RAM ProMaster": 40483,
          "RAM ProMaster City": 15584
        },
        "Fiat": {
          "124 Spider": 4478,
          "500": 12685,
          "500L": 1664,
          "500X": 7665
        },
        "Ford": {
          "C-Max": 18390,
          "Edge": 142603,
          "Escape": 308296,
          "E-Series": 53304,
          "Expedition": 51883,
          "Explorer": 271131,
          "Fiesta": 46249,
          "Flex": 22389,
          "Focus": 158385,
          "F-Series": 896764,
          "Fusion": 209623,
          "GT": 89,
          "Mustang": 81866,
          "Taurus": 41236,
          "Transit": 127360,
          "Transit Connect": 34473
        },
        "Genesis": {
          "G80": 16196,
          "G90": 4398
        },
        "GMC": {
          "Acadia": 111276,
          "Canyon": 32106,
          "Savana": 29679,
          "Sierra": 217943,
          "Terrain": 85441,
          "Yukon": 49183,
          "Yukon XL": 35059
        },
        "Honda": {
          "Accord": 322655,
          "Civic": 377286,
          "Clarity FCV": 2455,
          "Crosstour": 5,
          "CR-V": 377895,
          "CR-Z": 705,
          "Fit": 49454,
          "HR-V": 94034,
          "Insight": 3,
          "Odyssey": 100307,
          "Pilot": 127279,
          "Ridgeline": 34749
        },
        "Hyundai": {
          "Accent": 58955,
          "Azera": 3060,
          "Elantra": 198210,
          "Equus": 20,
          "Genesis": 1152,
          "Ioniq": 11197,
          "Santa Fe": 133171,
          "Sonata": 131803,
          "Tucson": 114735,
          "Veloster": 12658
        },
        "Infiniti": {
          "Q50": 40739,
          "Q60": 10751,
          "Q70": 5772,
          "QX30": 14093,
          "QX50": 16857,
          "QX60": 40444,
          "QX70": 6878,
          "QX80": 17881
        },
        "Jaguar": {
          "F-Pace": 18946,
          "F-Type": 4108,
          "XE": 9278,
          "XF": 4541,
          "XJ": 2721
        },
        "Jeep": {
          "Cherokee": 169882,
          "Compass": 83253,
          "Grand Cherokee": 240696,
          "Patriot": 10735,
          "Renegade": 103434,
          "Wrangler": 190522
        },
        "Kia": {
          "Cadenza": 7249,
          "Forte": 117596,
          "K900": 455,
          "Niro": 27237,
          "Optima": 107493,
          "Rio": 16760,
          "Sedona": 23815,
          "Sorento": 99684,
          "Soul": 115712,
          "Sportage": 72824,
          "Stinger": 843
        },
        "Land Rover": {
          "Discovery / LR4": 6398,
          "Discovery Sport": 14187,
          "Range Rover": 16869,
          "Range Rover Evoque": 11979,
          "Range Rover Sport": 19153,
          "Range Rover Velar": 6153
        },
        "Lexus": {
          "CT": 4690,
          "ES": 51398,
          "GS": 7773,
          "GX": 27190,
          "IS": 26482,
          "LC": 2487,
          "LFA": 3,
          "LS": 4094,
          "LX": 6004,
          "NX": 59341,
          "RC": 7363,
          "RX": 108307
        },
        "Lincoln": {
          "Continental": 12012,
          "MKC": 27048,
          "MKS": 153,
          "MKT": 3005,
          "MKX": 31031,
          "MKZ": 27387,
          "Navigator": 10523
        },
        "Maserati": {
          "Ghibli": 5531,
          "GranTurismo": 1018,
          "Levante": 5448,
          "Quattroporte": 1700
        },
        "Mazda": {
          "3": 75018,
          "5": 10,
          "6": 33402,
          "CX-3": 16355,
          "CX-5": 127563,
          "CX-9": 25828,
          "MX-5 Miata": 11294
        },
        "Mercedes-Benz": {
          "B-Class": 744,
          "C-Class": 77447,
          "CLA-Class": 20669,
          "E / CLS-Class": 51312,
          "G-Class": 4188,
          "GLA-Class": 24104,
          "GLC-Class": 48643,
          "GLE-Class": 54595,
          "GLS-Class": 32248,
          "Metris": 7579,
          "S-Class": 15888,
          "SLC-Class": 2860,
          "SL-Class": 2940,
          "Sprinter": 27415
        },
        "Mini": {
          "Cooper": 32232,
          "Countryman": 14864,
          "Paceman": 9
        },
        "Mitsubishi": {
          "i MiEV": 6,
          "Lancer": 12725,
          "Mirage": 22386,
          "Outlander": 35310,
          "Outlander PHEV": 99,
          "Outlander Sport": 33160
        },
        "Nissan": {
          "370Z": 4614,
          "Altima": 254996,
          "Armada": 35667,
          "Frontier": 74360,
          "GT-R": 578,
          "Juke": 10157,
          "Leaf": 11230,
          "Maxima": 67627,
          "Murano": 76732,
          "NV": 17858,
          "NV200": 18602,
          "Pathfinder": 81065,
          "Quest": 4950,
          "Rogue": 403465,
          "Sentra": 218451,
          "Titan": 52924,
          "Versa": 106772,
          "Xterra": 1
        },
        "Porsche": {
          "911": 8970,
          "Boxster": 2287,
          "Cayenne": 13203,
          "Cayman": 2800,
          "Macan": 21429,
          "Panamera": 6431
        },
        "Smart": {
          "Fortwo": 3071
        },
        "Subaru": {
          "BRZ": 4131,
          "Crosstrek": 110138,
          "Forester": 177563,
          "Impreza": 117401,
          "Legacy": 49837,
          "Outback": 188886
        },
        "Tesla": {
          "Model 3": 2320,
          "Model S †": 28800,
          "Model X †": 24000
        },
        "Toyota": {
          "4Runner": 128296,
          "86/Scion FR-S": 6846,
          "Avalon": 32583,
          "Camry": 387081,
          "C-HR": 25755,
          "Corolla": 329196,
          "FJ Cruiser": 4,
          "Highlander": 215775,
          "Land Cruiser": 3100,
          "Mirai": 1838,
          "Prius": 108662,
          "RAV4": 407594,
          "Sequoia": 12156,
          "Sienna": 111489,
          "Tacoma": 198124,
          "Tundra": 116285,
          "Venza": 14,
          "Yaris": 44380
        },
        "Volkswagen": {
          "Atlas": 27119,
          "Beetle": 15166,
          "CC": 1355,
          "Eos": 1,
          "Golf": 68978,
          "Jetta": 115807,
          "Passat": 60722,
          "Tiguan": 46983,
          "Touareg": 3545
        },
        "Volvo": {
          "S60": 16825,
          "S80": 7,
          "S90": 11090,
          "XC60": 22516,
          "XC90": 30996
        }
      }

      function processData(data) {
        var treeData = [];

        var smallBrands = {
          name: "Other",
          children: []
        };

        for (var brand in data) {
          var brandData = {
            name: brand,
            children: []
          }
          var brandTotal = 0;
          for (var model in data[brand]) {
            brandTotal += data[brand][model];
          }

          for (var model in data[brand]) {
            // do not add very small
            if (data[brand][model] > 100) {
              brandData.children.push({
                name: model,
                count: data[brand][model]
              });
            }
          }

          // add to small brands if total number less than
          if (brandTotal > 100000) {
            treeData.push(brandData);
          } else {
            smallBrands.children.push(brandData)
          }

        }
        treeData.push(smallBrands);
        return treeData;
      }

      // create chart
      var chart = am4core.create("brandwisesale", am4charts.TreeMap);
      chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

      // only one level visible initially
      chart.maxLevels = 1;
      // define data fields
      chart.dataFields.value = "count";
      chart.dataFields.name = "name";
      chart.dataFields.children = "children";
      chart.homeText = "US Car Sales 2017";

      // enable navigation
      chart.navigationBar = new am4charts.NavigationBar();

      // level 0 series template
      var level0SeriesTemplate = chart.seriesTemplates.create("0");
      level0SeriesTemplate.strokeWidth = 2;

      // by default only current level series bullets are visible, but as we need brand bullets to be visible all the time, we modify it's hidden state
      level0SeriesTemplate.bulletsContainer.hiddenState.properties.opacity = 1;
      level0SeriesTemplate.bulletsContainer.hiddenState.properties.visible = true;
      // create hover state
      var columnTemplate = level0SeriesTemplate.columns.template;
      var hoverState = columnTemplate.states.create("hover");

      // darken
      hoverState.adapter.add("fill", function (fill, target) {
        if (fill instanceof am4core.Color) {
          return am4core.color(am4core.colors.brighten(fill.rgb, -0.2));
        }
        return fill;
      })

      // add logo
      var image = columnTemplate.createChild(am4core.Image);
      image.opacity = 0.15;
      image.align = "center";
      image.valign = "middle";
      image.width = am4core.percent(80);
      image.height = am4core.percent(80);

      // add adapter for href to load correct image
      image.adapter.add("href", function (href, target) {
        var dataItem = target.parent.dataItem;

        if (dataItem) {
          return "https://www.amcharts.com/lib/images/logos/" + dataItem.treeMapDataItem.name.toLowerCase() + ".png";
        }
      });

      // level1 series template
      var level1SeriesTemplate = chart.seriesTemplates.create("1");
      level1SeriesTemplate.columns.template.fillOpacity = 0;

      var bullet1 = level1SeriesTemplate.bullets.push(new am4charts.LabelBullet());
      bullet1.locationX = 0.5;
      bullet1.locationY = 0.5;
      bullet1.label.text = "{name}";
      bullet1.label.fill = am4core.color("#ffffff");

      // level2 series template
      var level2SeriesTemplate = chart.seriesTemplates.create("2");
      level2SeriesTemplate.columns.template.fillOpacity = 0;

      var bullet2 = level2SeriesTemplate.bullets.push(new am4charts.LabelBullet());
      bullet2.locationX = 0.5;
      bullet2.locationY = 0.5;
      bullet2.label.text = "{name}";
      bullet2.label.fill = am4core.color("#ffffff");

      chart.data = processData(data);
    };


    $scope.MostSalingTime = function () {

      // Create chart instance
      var chart = am4core.create("mostsalingtime", am4charts.RadarChart);
      chart.scrollbarX = new am4core.Scrollbar();

      var data = [];

      for (var i = 1; i < 13; i++) {
        data.push({
          category: i,
          value: Math.round(Math.random() * 100)
        });
      }

      chart.data = data;
      chart.radius = am4core.percent(100);
      chart.innerRadius = am4core.percent(50);

      // Create axes
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "category";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 30;
      categoryAxis.tooltip.disabled = true;
      categoryAxis.renderer.minHeight = 110;
      categoryAxis.renderer.grid.template.disabled = true;
      //categoryAxis.renderer.labels.template.disabled = true;
      let labelTemplate = categoryAxis.renderer.labels.template;
      labelTemplate.radius = am4core.percent(-60);
      labelTemplate.location = 0.5;
      labelTemplate.relativeRotation = 90;

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.grid.template.disabled = true;
      valueAxis.renderer.labels.template.disabled = true;
      valueAxis.tooltip.disabled = true;

      // Create series
      var series = chart.series.push(new am4charts.RadarColumnSeries());
      series.sequencedInterpolation = true;
      series.dataFields.valueY = "value";
      series.dataFields.categoryX = "category";
      series.columns.template.strokeWidth = 0;
      series.tooltipText = "{valueY}";
      series.columns.template.radarColumn.cornerRadius = 10;
      series.columns.template.radarColumn.innerCornerRadius = 0;

      series.tooltip.pointerOrientation = "vertical";

      // on hover, make corner radiuses bigger
      let hoverState = series.columns.template.radarColumn.states.create("hover");
      hoverState.properties.cornerRadius = 0;
      hoverState.properties.fillOpacity = 1;


      series.columns.template.adapter.add("fill", function (fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
      })

      // Cursor
      chart.cursor = new am4charts.RadarCursor();
      chart.cursor.innerRadius = am4core.percent(50);
      chart.cursor.lineY.disabled = true;
    };



    function getCoockies() {
      $http({
        method: 'GET',
        url: '/api/getCoockies/',
        dataType: 'jsonp'
      }).then(function (response) {
        $scope.credentials = response.data;
      });
    };

    getCoockies();


  });