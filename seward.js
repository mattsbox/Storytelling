$(function()
{
  var showtime=new Array();
  var hidetime=new Array();
  var resizetime=new Array();
  var reposit=new Array();
  var show_id=function(id,fade,block)
  {
    var me=$("sew-obj[sew-id=\""+id+"\"]");
    if(!me.hasClass("hidden")){return false;}
    if(!block){showtime[pageindex][id]=fade;}
    if(fade){me.removeClass("hidden").hide().fadeIn(1*fade);return true;}
    else{me.removeClass("hidden").show();return true;}
    return false;
  };
  var hide_id=function(id,fade,block)
  {
    var me=$("sew-obj[sew-id=\""+id+"\"]");
    if(me.hasClass("hidden")){return;}
    if(!block){hidetime[pageindex][id]=fade;}
    if(fade){me.addClass("hidden").show().fadeOut(1*fade);}
    else{me.addClass("hidden").hide();}
  };
  var size_flags=new Array();
  var calc_size=function(id,attr,s)
  {
    if(s.endsWith("w"))
    {
      if(!size_flags[id]){size_flags[id]=new Array();}
      size_flags[id][attr]=s;
      return ($(window).width()*s.substring(0,s.length-1))+"px";
    }
    else if(s.endsWith("h"))
    {
      if(!size_flags[id]){size_flags[id]=new Array();}
      size_flags[id][attr]=s;
      return ($(window).height()*s.substring(0,s.length-1))+"px";
    }
    return s;
  }
	var gotopage=function(i)
	{
    if(!showtime[i]){showtime[i]=new Array();}
    if(!hidetime[i]){hidetime[i]=new Array();}
    if(!resizetime[i]){resizetime[i]=new Array();}
    if(!reposit[i]){reposit[i]=new Array();}
    var shows=pages[i].shows;
		for(id in shows){show_id(id,shows[id]);}
    var hides=pages[i].hides;
		for(id in hides){hide_id(id,hides[id]);}
    var draws=pages[i].draws;
		for(id in draws){show_id(id);Seward.drawsvg(id,draws[id]["frames"]);}
		var locs=pages[i].locs;
		for(id in locs)
		{
      var me=$("sew-obj[sew-id=\""+id+"\"]");
      reposit[pageindex][id]={"x":me.css("left"),"y":me.css("right")};
      if(show_id(id,locs[id].f)){reposit[pageindex][id].show=true;}
			  me.css("left",calc_size(id,"left",locs[id].x))
				.css("top",calc_size(id,"top",locs[id].y));

		}
		var slides=pages[i].slides;
		for(id in slides)
		{
      var me=$("sew-obj[sew-id=\""+id+"\"]");
      reposit[pageindex][id]={"x":me.css("left"),"y":me.css("right")};
      if(show_id(id)){reposit[pageindex][id].show=true;}
			var s=slides[id];
			me.css("transition",s.t+" "+s.f+" "+s.d)
				.css("left",calc_size(id,"left",s.x))
				.css("top",calc_size(id,"top",s.y))
				.on("transitionend",function()
				{
					$(this).css("transition","");
				});
		}
    var svgresizes=pages[i].svgresizes;
    for(id in svgresizes)
    {
      var r=svgresizes[id];
      var me=$("sew-obj[sew-id=\""+id+"\"]");
      resizetime[pageindex][id]={"w":me.attr("w"),"h":me.attr("h")};
      if(r.f)
      {
          $("sew-obj[sew-id=\""+id+"\"] svg")
            .css("transition",r.t+" "+r.f+" "+r.d)
            .on("transitionend",function()
				    {
				  	  $(this).css("transition","");
				    });
          me.attr("w",r.w).attr("h",r.h);
          resize(id);
      }
      else{me.attr("w",r.w).attr("h",r.h);resize(id);}
    }
	}
  pages=[];
	pageindex=0;
  Seward.svgpaths=new Array();
  Seward.svglengths=new Array();
  Seward.svgids=new Array();
  var nextpage=function(){if(pages[pageindex+1]){gotopage(pageindex+=1);}}
  var prevpage=function()
  {
    if(!pages[pageindex-1]){return;}
    var draws=pages[pageindex].draws;
		for(id in draws){hide_id(id);}
    for(id in showtime[pageindex]){hide_id(id,0,true);}
    for(id in hidetime[pageindex]){show_id(id,0,true);}
    for(id in resizetime[pageindex])
    {
      $("sew-obj[sew-id=\""+id+"\"]").attr("w",resizetime[pageindex][id].w).attr("h",resizetime[pageindex][id].h);
      resize(id);
    }
    for(id in reposit[pageindex])
    {
      var me=reposit[pageindex][id];
      if(me.show){hide_id(id,0,true);}
      $("sew-obj[sew-id=\""+id+"\"]").css("left",me.x).css("top",me.y);
    }
    gotopage(pageindex-=1);
  }
  $("html").click(nextpage);
  $("body").keyup(function(e)
  {
    switch(e.keyCode)
    {
      case 37: prevpage();break;//Left
      case 39: case 32: nextpage();break; //Right & Space
    }
  });
  var resize=function(i)
  {
    var me=$("sew-obj[sew-id=\""+i+"\"] svg");
    var w=($(window).width()/me.attr("width"))*me.parent().attr("w");
    if(me.parent().attr("r")){var h=(w*me.attr("width")*me.parent().attr("r"))/(me.attr("height"));}
    else{var h=($(window).height()/me.attr("height"))*me.parent().attr("h");}
    me.css("transform","scaleX("+w+") scaleY("+h+")");
    me.css("margin-left",(me.attr("width")*(w-1))/2);
    me.css("margin-top",(me.attr("height")*(h-1))/2);
  }
  var resize_all=function()
  {
    for(id in Seward.svgids){resize(id);}
    for(id in size_flags)
    {
      for(attr in size_flags[id])
      {
        $("sew-obj[sew-id=\""+id+"\"]").attr(attr,calc_size(id,attr,size_flags[id][attr]));
      }
    }
  };
  $(window).resize(resize_all);
  $(window).scroll(function(){window.scrollTo(0,0);});
  $("sew-obj").each(function()
  {
    var me=$(this);
    var i=me.attr("sew-id");
    if(me.attr("src"))
    {
      $.ajax({url:me.attr("src"),success:((function(id){return function(l,t,r)
      {
        $("sew-obj[sew-id=\""+id+"\"]").html(r.responseText);
      };})(i)),async:false});
    }
  });
  $("sew-page").each(function(i)
  {
    pages[i]={"shows":[],"hides":[],"svgadds":{},"draws":{},"locs":{},"slides":[],"svgresizes":[]}
    $(this).children("show").each(function(){pages[i].shows[$(this).attr("sew-id")]=$(this).attr("fade");});
    $(this).children("hide").each(function(){pages[i].hides[$(this).attr("sew-id")]=$(this).attr("fade");});
    $(this).children("svgadd").each(function()
    {
      var me=$(this);
      var ids=me.attr("sew-id").split(" ");
      for(ci in ids)
      {
        var id=ids[ci];
        Seward.svgids[id]=1;
        resize(id);
      }
    });
    $(this).children("draw").each(function()
    {
      var me=$(this);
      var ids=me.attr("sew-id").split(" ");
      for(ci in ids)
      {
        var id=ids[ci];
        Seward.svgids[id]=1;
        resize(id);
        pages[i].draws[id]=new Array();
        pages[i].draws[id]["frames"]=me.attr("frames");
        Seward.svgpaths[id]=new Array();
        Seward.svglengths[id]=new Array();
	  	  [].slice.call($("sew-obj[sew-id=\""+id+"\"] path")).forEach( function( el, j ) {
			    Seward.svgpaths[id][j] = el;
			    var l = Seward.svgpaths[id][j].getTotalLength();
			    Seward.svglengths[id][j] = l;
			    Seward.svgpaths[id][j].style.strokeDasharray = l + ' ' + l; 
			    Seward.svgpaths[id][j].style.strokeDashoffset = l;
          pages[i].draws[id][j]=1;
		    });
      }
    });
    $(this).children("loc").each(function()
    {
      var me=$(this);
      pages[i].locs[me.attr("sew-id")]={"x":me.attr("x"),"y":me.attr("y"),"f":me.attr("fade")};
    });
    $(this).children("slide").each(function()
    {
      var me=$(this);
      pages[i].slides[me.attr("sew-id")]={"x":me.attr("x"),
        "y":me.attr("y"),
        "t":me.attr("t"),
        "f":me.attr("f"),
        "d":me.attr("d")};
    });
    $(this).children("svgresize").each(function()
    {
      var me=$(this);
      pages[i].svgresizes[me.attr("sew-id")]={"w":me.attr("w"),
        "h":me.attr("h"),
        "f":me.attr("f"),
        "t":me.attr("t"),
        "d":me.attr("d")}
    });
  });
  $("sew-obj").each(function(){hide_id($(this).attr("sew-id"),0,true);});
  gotopage(pageindex);
});
