(function($) { 
   $.ajax({
        type     : "GET",
        url      : 'http://huangjunhui.sinaapp.com/',
        success  : function(data) {
                    $("#counterValue").text(data);
                   },
        error    : function() { 
					
                    $("#counter").html(""); 
                   }
    });
	
})(jQuery);