define([], function()
{
    return function(dependencies)
    {
        var definition =
        {
            resolver: ['$q','$rootScope', function($q, $rootScope)
            {
				var css = [];
				var scripts = [];
				for(var i = 0;i < dependencies.length;i++){
					if(typeof(dependencies[i])=="object"){
						css.push(dependencies[i]);
					} else {
						scripts.push(dependencies[i]);
					}
				}
				var links = $("link[active=yes]");
				$("link[active=yes]").attr('active','no');
				for(var i=0;i<css.length;i++){
					var j = 0;
					for(;j<links.length;j++){
						if(css[i].style==$(links[j]).attr('href')){
							$(links[j]).attr('active','yes')
							break;
						} 
					} 
					if(j==links.length){
						$("<link/>", {
							rel: "stylesheet/less",
							type: "text/css",
							href: css[i].style+'.less',
							active: "yes",
						}).appendTo("head"); 
					}
				}
				// console.debug(css);
				// console.debug(scripts);
                var deferred = $q.defer();
				require(scripts, function()
                {
                    $rootScope.$apply(function()
                    {
                    	var removeCss = $("link[active=no]");
        				for(var i=0; i<removeCss.length; i++){
        					$("style[id='less:"+$(removeCss[i]).attr('href').replace(/\//g,'-').replace('.less','')+"']").remove();
        					$(removeCss[i]).remove();
        				}
                        deferred.resolve();
                    });
                });

                return deferred.promise;
            }]
        }

        return definition;
    }
});