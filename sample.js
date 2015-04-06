(function($){

     $(function (){
         
        $('#main').removeAttr("style");
        $('<link>')// append CSS to head
            .appendTo('head')
            .attr({type : 'text/css', rel : 'stylesheet'})
            .attr('href', 'http://destination.locaterealestate.com/media.css');
         $('<link>')// append CSS to head
             .appendTo('head')
             .attr({type : 'text/css', rel : 'stylesheet'})
             .attr('href', 'http://destination.locaterealestate.com/ddsmoothmenu.css');
	     
	// Build the widget	
        var $html = '<div id="background-locate-adv" >\
        <div id="quick-search">\
        <div id="search-box">\
            <div class="quick-search-widget-wrapper">\
                        <div class="locate-row">\
                                <div class="col2">\
                                <label style="font-weight:bold;clear:all;">Location</label>\
                                    <div id="locate-select-location" class="ddsmoothmenu" style="float:left">\
                                         <ul>\
                                             <li class="locate-select">\
                                                <a style="border-right:0px;background-color:#ff6633;color:#fff !important;opacity:1" href="#">Select</a>\
                                                    <ul id = "locate-market-list"></ul>\
                                             </li>\
                                         </ul>\
                                         <span style="display:inline-block;padding:7px;color:#000;border:1px solid grey;margin-left:5px;min-width:160px;" class="locate-selected">-No market selected-</span>\
                                    </div>\
                                    <!--select id="market" name="market" style="width:240px">\
                                    </select-->\
                                </div>\
                                <div style="float:left" class="col2">\
                                    <div class="submit-btn-wrapper"><input id="search-locate-adv" type="button" value="Search Now"></div>\
                                </div>\
                        </div>\
                        <div class="locate-row">\
                        <label style="font-weight:bold;padding-top:10px">Bedrooms</label>\
                        </div>\
                        <div class="locate-row">\
                            <div class="col2">\
                                <div class="locate-row">\
                                    <label for="beds_min">Min</label>\
                                    <select id="beds_min" name="beds_min">\
                                        <option value="">Any</option>\
                                        <option value="1">1</option>\
                                        <option value="2">2</option>\
                                        <option value="3">3</option>\
                                        <option value="4">4</option>\
                                        <option value="5">5</option>\
                                        <option value="6">6</option>\
                                    </select>\
                                </div>\
                                <div class="locate-row">\
                                    <label for="beds_max">Max</label>\
                                    <select id="beds_max" name="beds_max">\
                                        <option value="">Any</option>\
                                        <option value="1">1</option>\
                                        <option value="2">2</option>\
                                        <option value="3">3</option>\
                                        <option value="4">4</option>\
                                        <option value="5">5</option>\
                                        <option value="6">6</option>\
                                    </select>\
                                </div>\
                            </div>\
                             <div class="col2" style="padding-left:70px">\
                                    <input type="checkbox" id="open_house" name="open_house" value="open_house" style="margin-top:4px;margin-left:5px;">\
                                     <label for="open_house">Open Houses Only</label>\
                            </div>\
                        </div>\
                         <div class="locate-row">\
                        <label style="font-weight:bold;padding-top:10px">Bathrooms</label>\
                         <div class="col2" style="padding-left:70px;float:right;">\
                                    <input type="checkbox" id="school_districts" name="school_districts" value="school_districts" style="margin-top:2px;margin-left:6px;">\
                                     <label for="school_districts" style="margin-top: -2px;">See Schools Layer</label>\
                            </div>\
                        </div>\
                        <div class="locate-row">\
                            <div class="col2">\
                                <div class="locate-row">\
                                    <label for="baths_min">Min</label>\
                                    <select id="baths_min" name="baths_min">\
                                        <option value="">Any</option><option value="1">1</option>\
                                        <option value="2">2</option><option value="3">3</option>\
                                        <option value="4">4</option><option value="5">5</option>\
                                        <option value="6">6</option>\
                                    </select>\
                                </div>\
                                <div class="locate-row">\
                                    <label for="baths_max">Max</label>\
                                    <select id="baths_max" name="baths_max">\
                                        <option value="">Any</option><option value="1">1</option>\
                                        <option value="2">2</option><option value="3">3</option>\
                                        <option value="4">4</option><option value="5">5</option>\
                                        <option value="6">6</option>\
                                    </select>\
                                </div>\
                            </div>\
                             <div class="col2" style="padding-left:70px;float:right;margin-top:-8px;">\
                                        <input type="checkbox" id="below_market" name="below_market" value="below_market" style="margin-top:4px">\
                                         <label for="below_market" >Below Market Value</label>\
                                </div>\
                        </div>\
                          <div class="locate-row">\
                        <label style="font-weight:bold;padding-top:10px">Price Range</label>\
                        </div>\
                        <div class="locate-row">\
                            <div class="col2" style="width:63%">\
                                <div class="locate-row" style="float:left">\
                                    <label for="price">Min</label>\
                                    <select id="price_min" name="price_min">\
                                        <option value="">Any</option>\
                                        <option value="50000">$50,000</option>\
                                        <option value="100000">$100,000</option>\
                                        <option value="150000">$150,000</option>\
                                        <option value="140000">$140,000</option>\
                                        <option value="250000">$250,000</option>\
                                        <option value="200000">$200,000</option>\
                                        <option value="350000">$350,000</option>\
                                        <option value="400000">$400,000</option>\
                                        <option value="450000">$450,000</option>\
                                        <option value="500000">$500,000</option>\
                                        <option value="600000">$600,000</option>\
                                        <option value="700000">$700,000</option>\
                                        <option value="800000">$800,000</option>\
                                        <option value="900000">$900,000</option>\
                                        <option value="1000000">$1,000,000</option>\
                                        <option value="1100000">$1,100,000</option>\
                                        <option value="1140000">$1,140,000</option>\
                                        <option value="1200000">$1,200,000</option>\
                                        <option value="1400000">$1,400,000</option>\
                                        <option value="1500000">$1,500,000</option>\
                                        <option value="1600000">$1,600,000</option>\
                                        <option value="1800000">$1,800,000</option>\
                                        <option value="1900000">$1,900,000</option>\
                                        <option value="1400000">$2,000,000</option>\
                                        <option value="2250000">$2,250,000</option>\
                                        <option value="2500000">$2,500,000</option>\
                                        <option value="2750000">$2,750,000</option>\
                                        <option value="2000000">$3,000,000</option>\
                                        <option value="3250000">$3,250,000</option>\
                                        <option value="3500000">$3,500,000</option>\
                                        <option value="3750000">$3,750,000</option>\
                                        <option value="4000000">$4,000,000</option>\
                                        <option value="4500000">$4,500,000</option>\
                                        <option value="5000000">$5,000,000</option>\
                                        <option value="6000000">$6,000,000</option>\
                                    </select>\
                                </div>\
                                <div class="locate-row" style="float:left">\
                                    <label for="price">Max</label>\
                                    <select id="price_max" name="price_max">\
                                        <option value="">Any</option>\
                                        <option value="50000">$50,000</option>\
                                        <option value="100000">$100,000</option>\
                                        <option value="150000">$150,000</option>\
                                        <option value="140000">$140,000</option>\
                                        <option value="250000">$250,000</option>\
                                        <option value="200000">$200,000</option>\
                                        <option value="350000">$350,000</option>\
                                        <option value="400000">$400,000</option>\
                                        <option value="450000">$450,000</option>\
                                        <option value="500000">$500,000</option>\
                                        <option value="600000">$600,000</option>\
                                        <option value="700000">$700,000</option>\
                                        <option value="800000">$800,000</option>\
                                        <option value="900000">$900,000</option>\
                                        <option value="1000000">$1,000,000</option>\
                                        <option value="1100000">$1,100,000</option>\
                                        <option value="1140000">$1,140,000</option>\
                                        <option value="1200000">$1,200,000</option>\
                                        <option value="1400000">$1,400,000</option>\
                                        <option value="1500000">$1,500,000</option>\
                                        <option value="1600000">$1,600,000</option>\
                                        <option value="1800000">$1,800,000</option>\
                                        <option value="1900000">$1,900,000</option>\
                                        <option value="1400000">$2,000,000</option>\
                                        <option value="2250000">$2,250,000</option>\
                                        <option value="2500000">$2,500,000</option>\
                                        <option value="2750000">$2,750,000</option>\
                                        <option value="2000000">$3,000,000</option>\
                                        <option value="3250000">$3,250,000</option>\
                                        <option value="3500000">$3,500,000</option>\
                                        <option value="3750000">$3,750,000</option>\
                                        <option value="4000000">$4,000,000</option>\
                                        <option value="4500000">$4,500,000</option>\
                                        <option value="5000000">$5,000,000</option>\
                                        <option value="6000000">$6,000,000</option>\
                                    </select>\
                                </div>\
                            </div>\
                              <img style="float:right;width:180px;" src="http://destination.locaterealestate.com/powered_by.png" alt="Powered by">\
                        </div>\
                    </div>\
                </div>\
            </div>\
            <div class="carousel-locate-adv" style="padding-left: 2px;">\
                <ul class="carousel" >\
                    <li id="https://hji.me/8f8a8bfe" style="width:130px; height:226px; "><img  src="http://destination.locaterealestate.com/cut1.png" height="226" width="128"></li>\
                    <li id="https://hji.me/40cdc9da" style="width:130px; height:226px; "><img  src="http://destination.locaterealestate.com/cut2.png" height="226" width="128"></li>\
                    <li id="https://hji.me/f8188af0" style="width:130px; height:226px; "><img  src="http://destination.locaterealestate.com/cut3.png" height="226" width="128"></li>\
                    <li id="https://hji.me/4c54951a" style="width:130px; height:226px; "><img  src="http://destination.locaterealestate.com/cut4.png" height="226" width="128"></li>\
                    <li id="https://hji.me/9ad57e99" style="width:130px; height:226px; "><img  src="http://destination.locaterealestate.com/cut5.png" height="226" width="128"></li>\
                </ul>\
            </div>\
        </div>';


        $('#locate-adv').css({'height':'750px','width':'660px'}).append($html);

        $('div.locate-row label').css({'float':'left','font-size':'14px','color':'#000','cursor':'default','font-family': 'Arial'});

        $('#quick-search #search-box input[type="text"]').css({
            'font-family' : 'Alegreya',
            'font-size': '16px',
            'max-height' : '24px',
            'color' : '#000',
            'padding': 'O 2px'
        });
        
        // Retreive the data with AJAX. 
         $.ajax({
             url: "http://medianetwork.locaterealestate.com/brokers/list.php",
             type:"GET",
             dataType: "jsonp",
             jsonp:'callback',
             success: function(data){ // <--- (data) is in json format
                  //parse the json data

                 $.each(data, function(key, value) {

                     var listDetails = $('<li class="locate-state"><a href="#">'+key+'</a></li>');

                     var list =$('<ul/>').appendTo(listDetails);

                     $.each(value, function(key, value){
                         var marketDetails = $('<li class="locate-market"><a href="#">'+key+'</a></li>');
                         list.append(marketDetails);
                         $.each(value, function(key, value){
                             marketDetails.attr(key,value);
                         });
                     });

                     $('#locate-market-list').append(listDetails);
                 });

             },// End of Success

             complete: function(){

                 $(".locate-market").bind( "click", function() {
                     $(".locate-selected").text($(this).text());
                     $('#locate-market-list').css('display','none');
                 });

                 $("#search-locate-adv").bind('click', function(){
                     if($(".locate-selected").text() === '-No market selected-'){
                         alert('Please select the market');
                     }else{
                         var  school_districts, below_market, open_house, beds_min, beds_max, baths_min, baths_max, price_min, price_max, market, broker, brokerText, brokerValue, selected, selectedText, licenseKey, latitude, longitude, brokerZoom;
                         school_districts = $('#school_districts').is(':checked') ? 'Y': 'N';
                         below_market = $('#below_market').is(':checked') ? 'Y' : 'N';
                         open_house = $('#open_house').is(':checked') ? 'Y' : 'N';
                         beds_min = $('#beds_min').val();
                         beds_max = $('#beds_max').val();
                         baths_min = $('#baths_min').val();
                         baths_max = $('#baths_max').val();
                         price_min = $('#price_min').val();
                         price_max = $('#price_max').val();
                         selectedText = $(".locate-selected").text();
                         selected = $('li').filter(function() { return $.text([this]) === selectedText; });
                         licenseKey = selected.attr('licenseKey');
                         latitude = selected.attr('latitude');
                         longitude = selected.attr('longitude');
                         broker = selected.attr('branding');
                         brokerText = selected.attr('brandingText');
                         brokerZoom = selected.attr('zoom');
                         brokerValue = selectedText;

                         Locate.popup({
                             height: "90%",
                             licenseKey: licenseKey,
                             latitude: latitude,
                             longitude: longitude,
                             bedsMin: beds_min,
                             bedsMax: beds_max,
                             bathsMin: baths_min,
                             bathsMax: baths_max,
                             priceMin: price_min,
                             priceMax: price_max,
                             mapCenter: latitude + ',' + longitude,
                             branding: broker,
                             brandingText: brokerText,
                             brandingValue: brokerValue,
                             zoom: brokerZoom,
                             openHouse: open_house,
                             belowMarket: below_market,
                             schoolDistricts: school_districts
                         });
                     }
                 });// End of Search function
             }
        });// End of AJAX

       //Load carusel      
         $(".carousel-locate-adv").jCarouselLite({
            auto: 800,
            speed: 1000,
            visible: 5
        });

        $('div.carousel-locate-adv ul li').bind('click', function(event){
            $(window).scrollTop(0);
            var id = $(this).attr("id");
            Locate.popup({
                height: "90%",
                featuredUrl: id
            });
        });
	
	// Invoke the menu
         $(window).on("load", function(){
             setTimeout(
                 ddsmoothmenu.init({
                     mainmenuid: "locate-select-location", //menu DIV id
                     orientation: 'h', //Horizontal or vertical menu: Set to "h" or "v"
                     classname: 'ddsmoothmenu', //class added to menu's outer DIV
                     contentsource: "markup", //"markup" or ["container_id", "path_to_menu_file"]
                 }) ,1500);

             var windowsize = $(window).width();
             if (windowsize < 540) {
                 $('#background-locate-adv').css('background-image', 'none');
             }
         });
    });
})(jQuery);


