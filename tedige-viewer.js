$(document).ready(function(){
		
		var defaultwidth = 10;
		var defaultheight = 20;
		var defaultsystem = "ARS";
		var defaultborder = "Gray";		
		var globalcounter = 0; // I know, it's ewwww
		var larger_mode;
		
		if($('body').hasClass('large'))
		{
			larger_mode = true;
		}
		else
		{
			larger_mode = false;			
		}
	
		
		function Diagram(){
			this.Playfields = new Array(); //an array filled with Playfield objects
			this.current_playfield; //an index storing which playfield we're working on
			this.init = function()
			{
				this.Playfields.push(new Playfield());
				this.current_playfield= this.Playfields.length-1; // the array is numbered 0,1,2,... whereas the .length method returns 1,2,3,... Hence playfields.length-1
				this.Playfields[0].init();
				
				var drawnTetrion = "";
				drawnTetrion += '<div id="top-box">';
				drawnTetrion += '<div id="holdbox"></div>';
				drawnTetrion += '<div id="next1box"></div>';
				drawnTetrion += '<div id="next2box"></div>';
				drawnTetrion += '<div id="next3box"></div>';
				drawnTetrion += '</div>';
				$("#seed").prepend(drawnTetrion);
			}
			
			this.new_playfield = function(){
				/**                                      
				* Inject a new playfield in the Playfields array just after the current playfield.
				*/                                     
				
				this.Playfields.splice(this.current_playfield+1,0,new Playfield()); // splice prepends the new array instead of appending it (1,2,3 => 1,insert,2,3 instead of 1,2,insert,3)
				this.current_playfield += 1;
				this.Playfields[this.current_playfield].init();
				this.update_framecount();
			}       	
			
			this.update_framecount = function(){
				/**
				* Updates the frame counter
				*/

				$('#current-frame').html(this.current_playfield+1);
				$('#total-frame').html(this.Playfields.length);
			}	
			this.update_topbox = function(){
				/**
				* Updates the frame counter
				*/
                                                            
				$('#holdbox').fadeOut(200).attr('class', 'holdbox').addClass('hold-'+this.Playfields[this.current_playfield].hold).fadeIn(200);
				$('#next1box').fadeOut(200).attr('class', 'next1box').addClass('next1-'+this.Playfields[this.current_playfield].next1).fadeIn(200);
				$('#next2box').fadeOut(200).attr('class', 'next2box').addClass('next2-'+this.Playfields[this.current_playfield].next2).fadeIn(200);
				$('#next3box').fadeOut(200).attr('class', 'next3box').addClass('next3-'+this.Playfields[this.current_playfield].next3).fadeIn(200);               
			}	

			
			this.update_system = function(){
				
				if(larger_mode)
				{
					if(this.Playfields[this.current_playfield].system)
					{
						$("#style-blocks").attr("href","ressources/"+this.Playfields[this.current_playfield].system+".css");				
					}
					else
					{
						$("#style-blocks").attr("href","ressources/ARS.css");
					}							
				}
				else{
					if(this.Playfields[this.current_playfield].system)
					{
						$("#style-blocks").attr("href","ressources/mini-"+this.Playfields[this.current_playfield].system+".css");				
					}
					else
					{
						$("#style-blocks").attr("href","ressources/mini-ARS.css");
					}
				}
				
			}
			
			this.next_playfield = function(){
				/**
				* Displays the next playfield
				*/
				if(this.current_playfield+1 < this.Playfields.length)
				{
					$('#d'+this.current_playfield).fadeOut(200);
					this.current_playfield += 1;
					$('#d'+this.current_playfield).delay(200).fadeIn(200);
					this.update_framecount();      
					this.update_topbox();  
					this.update_system();  					
					$('#com').fadeOut(200).html(this.Playfields[this.current_playfield].comment).fadeIn(200);
				}

			}
			this.previous_playfield = function(){
				/**
				* Displays the previous playfield
				*/

				if(this.current_playfield-1 >= 0)
				{
					$('#d'+this.current_playfield).fadeOut(200);
					this.current_playfield -= 1;
					this.update_framecount();
					this.update_topbox();
					this.update_system();  					
					$('#d'+this.current_playfield).delay(200).fadeIn(200);     
					$('#com').fadeOut(200).html(this.Playfields[this.current_playfield].comment).fadeIn(200);
				}

			}
			this.first_playfield = function(){
				/**
				* Displays the first playfield
				*/
				if(this.current_playfield != 0)
				{
					$('#d'+this.current_playfield).fadeOut(200);
					this.current_playfield = 0;          
					$('#d'+this.current_playfield).delay(200).fadeIn(200);
					this.update_framecount();       
					this.update_topbox(); 
					this.update_system();
					$('#com').fadeOut(200).html(this.Playfields[this.current_playfield].comment).fadeIn(200);
				}

			}
			this.last_playfield = function(){
				/**
				* Displays the last playfields
				*/
				if(this.current_playfield != this.Playfields.length-1)
				{
					$('#d'+this.current_playfield).fadeOut(200);
					this.current_playfield = this.Playfields.length-1;
					$('#d'+this.current_playfield).delay(200).fadeIn(200);
					this.update_framecount();               
					this.update_topbox();   
					this.update_system();
					$('#com').fadeOut(200).delay(200).html(this.Playfields[this.current_playfield].comment).fadeIn(200);
				}

			}			
			
			this.print = function(){
				var drawnTetrionSet = "";
				for(var i=0;i<this.Playfields.length;i++)
				{
					drawnTetrionSet += this.Playfields[i].print();
				}
				
				return drawnTetrionSet;
			}
			this.load = function(bigstr){
				/**
				* Reboot the diagram, parses the string in parameter and
				* fills the Playfields array accordingly.
				*/
				if(!bigstr){return;}
				var BigSplit = bigstr.split("+");
				for(var i=0;i<BigSplit.length-1;i++) // there's a trailing + that we should'nt care about
				{
					this.Playfields[this.current_playfield].load_pf(BigSplit[i]);
					if(i<BigSplit.length-2) // while processing the penultimate element, we should'nt push back the array
					{
						this.new_playfield();
					}
				}
				
			}			
		}
		
		function Playfield(){
			
			this.pf_width = defaultwidth;
			this.pf_height = defaultheight;
			this.comment = "";
			this.Tetrion = new Array(); 
			this.system = defaultsystem;
			this.stackborder_status;
			
			this.border_color = defaultborder;
			this.hold = "";
			this.next1 = "";
			this.next2 = "";
			this.next3 = "";
			
			this.the_active_center = new Array();
			this.the_active_center['coord']='';
			this.the_active_center['piece']='';
			this.Tetrion_History = new Array();			
			
			this.init=function(){
				/**
				* Initializes the playfield and fills it with "_" (empty space).
				* Also initializes others variable
				*/
				// this.pf_width = parseInt($('#width').val());
				// this.pf_height = parseInt($('#height').val());
				//this.system = defaultsystem; 
				//$('#system').val(defaultsystem); // this is for loading purpose
				
				for(var i=0;i<this.pf_width;i++)
				{
					this.Tetrion.push(new Array(26))
					for(var j=0;j<this.pf_height;j++)
					{                            
						/* Tetrion store all the necessary information: content stores what type of piece is at (i,j)
						content_active stores the same but for the activer layer*/
						this.Tetrion[i][j] = new Array();
						this.Tetrion[i][j]['content']="_";
						this.Tetrion[i][j]['content_active']="";
						this.Tetrion[i][j]['decoration']="";
					}
				}                 
				
			}
			this.modify=function(x,y,value){
				this.Tetrion[x][y]["content"]=value;
			}		
			
			this.modify_active=function(x,y,value){
				this.Tetrion[x][y]['content_active']=value;   
			}
			
			this.modify_active_center = function(x,y,value){
				this.the_active_center['coord']= x+"x"+y;
				this.the_active_center['piece']= value;
			}			
			this.modify_decoration=function(x,y,value){
				this.Tetrion[x][y]["decoration"]=value;  
			}			
			this.modify_system = function(new_system){
				this.system = new_system;
			}
			this.modify_border = function(newborder){
				this.border_color = newborder;
			}
			this.modify_hold = function(newhold) {
				this.hold = newhold ;  
			}
			this.modify_next1 = function(newnext1) {
				this.next1 = newnext1        
			}
			this.modify_next2 = function(newnext2) {
				this.next2 = newnext2
			}
			this.modify_next3 = function(newnext3) {
				this.next3 = newnext3         
			}			
			this.change_size = function(newwidth,newheight){
				if(this.pf_height != newheight || this.pf_width != newwidth)
				{
					this.pf_height = newheight;
					this.pf_width = newwidth;
					defaultwidth  = newwidth;
					defaultheight = newheight;					
				}
			}
			
			this.load_pf = function(str){
				if(!str){return;}
				var Split = str.split("_"); // let's decompose our string into individual element...
				for(var i=0;i<Split.length;i++) // for each of its constituent, analyse what it is
				{
					if(Split[i].charAt(0) == "*") // the first character must be the identifier '*'
					{
						switch(Split[i].charAt(1)) // let's see what is second character...
						{
						case "s":
							var newsize = Split[i].slice(2).split("x")
							var newwidth = parseFloat(newsize[0]);
							var newheight = parseFloat(newsize[1]);
							this.change_size(newwidth,newheight);
							break;
						case "r" :
							this.modify_system(Split[i].slice(2)); // slicing out the id characters       
							break;
						case "b" :
							this.modify_border(Split[i].slice(2));
							break;
						case "h" :
							this.modify_hold(Split[i].slice(2));
							break;
						case "n" :
							this.modify_next1(Split[i].slice(2)); // slicing out the id characters
							break;
						case "m" :
							this.modify_next2(Split[i].slice(2)); // slicing out the id characters
							break;
						case "o" :
							this.modify_next3(Split[i].slice(2)); // slicing out the id characters
							break;
						case "g" :
							var inactiveSplit = Split[i].slice(2).split("-")
							var coord_x;
							var coord_y;
							for(var j=0 ; j<inactiveSplit.length-1 ; j++)
							{
								coord_x = alphanumconvert(inactiveSplit[j].charAt(0));
								coord_y = alphanumconvert(inactiveSplit[j].charAt(1));
								this.modify(coord_x,coord_y,inactiveSplit[j].slice(2));
							}
							break;
						case "d" :
							var inactiveSplit = Split[i].slice(2).split("-")
							var coord_x;
							var coord_y;
							for(var j=0 ; j<inactiveSplit.length-1 ; j++)
							{
								coord_x = alphanumconvert(inactiveSplit[j].charAt(0));
								coord_y = alphanumconvert(inactiveSplit[j].charAt(1));
								this.modify_decoration(coord_x,coord_y,inactiveSplit[j].slice(2));
							}
							break;
						case "a" :
							var activeSplit = Split[i].slice(2).split("-");
							var center = new Array;
							
							center['x'] = alphanumconvert(activeSplit[0].charAt(0));
							center['y'] = alphanumconvert(activeSplit[0].charAt(1));
							
							var piece_nature = activeSplit[1].slice(0,1);
							var piece_orientation = activeSplit[1];
							var orientation = get_orientation(piece_orientation,center,this.system);
							
							var t2 = new Array();
							var t3 = new Array();
							var t4 = new Array();
							
							t2.x = orientation[0].x;                // put the orientation we got in the new arrays
							t2.y = orientation[0].y;
							t3.x = orientation[1].x;
							t3.y = orientation[1].y;
							t4.x = orientation[2].x;
							t4.y = orientation[2].y;
							
							if(piece_orientation == "T"
								|| piece_orientation == "L"
							|| piece_orientation == "J"
							|| piece_orientation == "S"
							|| piece_orientation == "Z"
							|| piece_orientation == "I"
							|| piece_orientation == "G"
							|| piece_orientation == "single")
							{
								t2.x = center.x;
								t2.y = center.y;
								t3.x = center.x;
								t3.y = center.y;
								t4.x = center.x;
								t4.y = center.y;
							}
							this.modify_active(center.x,center.y,piece_nature);
							this.modify_active_center(center.x,center.y,piece_orientation);
							this.modify_active(t2.x,t2.y,piece_nature);
							this.modify_active(t3.x,t3.y,piece_nature);
							this.modify_active(t4.x,t4.y,piece_nature);
							break;
						case "c":
							this.comment = Base64.decode(decodeURIComponent(Split[i].slice(2)));
							//replace the authorized html tags
							//second pass so it shouldn't be possible to do xss attack
							this.comment = this.comment.replace('<strong>','html-strong-begin');
							this.comment = this.comment.replace('</strong>','html-strong-end');					
							this.comment = this.comment.replace('<em>','html-em-begin');
							this.comment = this.comment.replace('</em>','html-em-end');
							this.comment = this.comment.replace('<a','html-a-begin'); // the rest of the a tag is left untouched intentionnally
							this.comment = this.comment.replace('</a>','html-a-end');
							this.comment = this.comment.replace(/<(.|\n)*?>/,''); // <- destroy any html tag left
							this.comment//replace everything
							this.comment=this.comment.replace('html-strong-begin','<strong>');
							this.comment=this.comment.replace('html-strong-end','</strong>');					
							this.comment=this.comment.replace('html-em-begin','<em>');
							this.comment=this.comment.replace('html-em-end','</em>');
							this.comment=this.comment.replace('html-a-begin','<a'); 
							this.comment=this.comment.replace('html-a-end','</a>');
							break;
						case "w" :
							this.stackborder_status = 1;
							break;
							
						}
					}
					
				}
			}	
			
			this.print = function(){
				
				var inactive ='';
				var active ='';
				var decoration ='';
				var hasinactive ='';
				var hasactive ='';
				var stackborder='';
				var foregroundinactive = 'foreground-inactive';


				var drawnTetrion = '<table id="d'+globalcounter+'" class="diagram border-'+this.border_color+'"> \n';
				globalcounter++;

				
				for(var j=0; j<this.pf_height;j++)
				{
					drawnTetrion += '<tr class="row'+j+'">';
					for(var i=0; i<this.pf_width;i++)
					{          
						if(this.Tetrion[i][j]['decoration'])
						{
							foregroundinactive = '';
							decoration =this.Tetrion[i][j]['decoration'];
						}
						if(this.Tetrion[i][j]['content_active'])
						{
							foregroundinactive = 'foreground-inactive';
							active = 'piece-'+this.Tetrion[i][j]['content_active'];
							hasactive ="hasactive";
							if(this.Tetrion[i][j]['content'])
							{
								foregroundinactive ="";
							}
						}
						if(this.Tetrion[i][j]['content'] != "_")
						{
							foregroundinactive = 'foreground-inactive';
							hasinactive ="hasinactive";
							inactive ='piece-'+this.Tetrion[i][j]['content'];
						}

						if(this.stackborder_status)
						{
							
							if(this.Tetrion[i][j]['content'] == "_")
							{
								stackborder +="border-";
								if(j-1>=0 && this.Tetrion[i][j-1]['content'] != "_")
								{
									stackborder += "top";
								}					
								
								if(i+1<this.pf_width && this.Tetrion[i+1][j]['content'] != "_")
								{
									stackborder += "right";
								}					
								
								if(j+1<this.pf_height && this.Tetrion[i][j+1]['content'] != "_")
								{
									stackborder += "bottom";
								}										
								
								if(i-1>=0 && this.Tetrion[i-1][j]['content'] != "_")
								{
									stackborder += "left";
								}
								
							}	
							
						}
						
						
						drawnTetrion += '<td class="col'+i+' '+foregroundinactive+' '+hasinactive+' '+hasactive+'">';    
						drawnTetrion +='<div class="inactivelayer '+inactive+'">';
						drawnTetrion +='<div class="pixelborder '+stackborder+'">';
						drawnTetrion +='<div class="activelayer '+active+'">';
						drawnTetrion +='<div class="decorationlayer '+decoration+'">';
						drawnTetrion +='</div></div></div></div></td>';
						inactive ='';
						active ='';
						decoration ='';
						hasinactive ='';
						hasactive ='';
						stackborder='';
						foregroundinactive = 'foreground-inactive';
					}
					drawnTetrion += '</tr> \n';
				}
				return drawnTetrion;
			}
			
			
		}  

		var D = new Diagram();
		D.init();
		var URLHash = window.location.search;
		if(URLHash) // load if there's something in the url
		{
			var toLoad = URLHash.split('?');
			D.load(toLoad[1]);
			$(D.print()).appendTo("#seed");
			$('#com').html(D.Playfields[D.current_playfield].comment);
			if(D.Playfields.length > 1)
			{
			for(var i=0;i<D.Playfields.length;i++)
			{
				$('#d'+i).hide();
			}
			D.first_playfield();
			}
				$('#holdbox').attr('class', 'holdbox').addClass('hold-'+D.Playfields[D.current_playfield].hold);
				$('#next1box').attr('class', 'next1box').addClass('next1-'+D.Playfields[D.current_playfield].next1);
				$('#next2box').attr('class', 'next2box').addClass('next2-'+D.Playfields[D.current_playfield].next2);
				$('#next3box').attr('class', 'next3box').addClass('next3-'+D.Playfields[D.current_playfield].next3);               

			D.update_system();
			
			
		}   
		
					$("#cmd_next").click(function(){
							D.next_playfield();
					})
					$("#cmd_prev").click(function(){
							D.previous_playfield();
					})
					$("#cmd_last").click(function(){
							D.last_playfield();
					})
					$("#cmd_first").click(function(){
							D.first_playfield();
					})		
		
		
});

		function alphanumconvert(input){
			/**
			* Convert a letter to his corresponding number and vice-versa.
			* Possible expansion: add [A-Z] to avec 46 more possibilites
			*/
			var output;
			switch(input)
			{
			case "a" :
				output = 0;
				break;
			case "b" :
				output = 1;
				break;
			case "c" :
				output = 2;
				break;
			case "d" :
				output = 3;
				break;
			case "e" :
				output = 4;
				break;
			case "f" :
				output = 5;
				break;
			case "g" :
				output = 6;
				break;
			case "h" :
				output = 7;
				break;
			case "i" :
				output = 8;
				break;
			case "j" :
				output = 9;
				break;
			case "k" :
				output = 10;
				break;
			case "l" :
				output = 11;
				break;
			case "m" :
				output = 12;
				break;
			case "n" :
				output = 13;
				break;
			case "o" :
				output = 14;
				break;
			case "p" :
				output = 15;
				break;
			case "q" :
				output = 16;
				break;
			case "r" :
				output = 17;
				break;
			case "s" :
				output = 18;
				break;
			case "t" :
				output = 19;
				break;
			case 0 :
				output = "a";
				break;
			case 1 :
				output = "b";
				break;
			case 2 :
				output = "c";
				break;
			case 3 :
				output = "d";
				break;
			case 4 :
				output = "e";
				break;
			case 5 :
				output = "f";
				break;
			case 6 :
				output = "g";
				break;
			case 7 :
				output = "h";
				break;
			case 8 :
				output = "i";
				break;
			case 9 :
				output = "j";
				break;
			case 10 :
				output = "k";
				break;
			case 11 :
				output = "l";
				break;
			case 12 :
				output = "m";
				break;
			case 13 :
				output = "n";
				break;
			case 14 :
				output = "o";
				break;
			case 15 :
				output = "p";
				break;
			case 16 :
				output = "q";
				break;
			case 17 :
				output = "r";
				break;
			case 18 :
				output = "s";
				break;
			case 19 :
				output = "t";
				break;
			}
			return output;
		}
		function get_orientation(piece_orientation,center,system){
			/**
			* returns an two dimensionnals array that stores the position of the blocks
			* relative to a center given in parameter and to a set orientation also given in parameter
			*/
			var t2 = new Array();
			var t3 = new Array();
			var t4 = new Array();   
			switch(system)
			{
				case "ARS":
					switch(piece_orientation)
					{
							/*
							This switch choose the cases to be modified
							g: locked / garbage
							i: initial orientation
							ccw: CCW-rotation
							cw: CW-rotation
							u: reverse or double-rotated orientation
							*/
						/* T tetramino */
						case "Ti" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])-1;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])+1;
							break;
						case "Tccw" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])+1;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						case "Tcw" :
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])+1;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						case "Tu" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])-1;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						/* I tetramino */
						case "Ii" :                         
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])-1;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])-2;
							t4['y'] = parseFloat(center['y'])+0;
							break;    
						case "Iccw" :                         
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])+1;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])-2;
							break;    
						case "Iu" :                         
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])-1;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])-2;
							t4['y'] = parseFloat(center['y'])+0;
							break;    
						case "Icw" :
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])+1;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])-2;
							break;
						/* O tetramino */
						case "Oi" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])-1;       
							break;
						case "Ocw" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						case "Ou" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						case "Occw" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						/* Z tetramino */
						case "Zi" :
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])+1;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])+1;
							break;
						case "Zcw" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+1;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+0;      
							t4['y'] = parseFloat(center['y'])+1;
							break;
						case "Zu" :
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])+1;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])+1;
							break;
						case "Zccw" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+1;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])+1;
							break;
						/* S tetramino */
						case "Si" :                              
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])+1;      
							t4['x'] = parseFloat(center['x'])-1;        
							t4['y'] = parseFloat(center['y'])+1;
							break;                                      
						case "Scw" :
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])-1;      
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])+1;          
							break;                                       
						case "Su" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])+1;
							t4['x'] = parseFloat(center['x'])-1;
							t4['y'] = parseFloat(center['y'])+1;
							break;
						case "Sccw" :
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])-1;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])+1;
							break;       			 			
						/* L tetramino */
						case "Li" :
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])+1;
							t3['x'] = parseFloat(center['x'])-1;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])+0;
							break;
						case "Lccw" :
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])+1;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+1
							t4['y'] = parseFloat(center['y'])+1;
							break;
						case "Lcw" :
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])+1;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])-1;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						case "Lu" :
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+1;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						/* J tetramino */
						case "Ji" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])-1;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])+1;
							break;
						case "Jccw" :
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])+1;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						case "Jcw" :
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])-1;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])+1;
							t4['x'] = parseFloat(center['x'])-1;
							t4['y'] = parseFloat(center['y'])+1;
							break;
						case "Ju" :
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+1;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])-1;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						default:
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;      
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])+0;          
							break;								
					}					
					break;  
				case "SRS":
					switch(piece_orientation)
					{
							/*
							This switch choose the cases to be modified
							g: locked / garbage
							i: initial orientation
							ccw: CCW-rotation
							cw: CW-rotation
							u: reverse or double-rotated orientation
							*/
						/* T tetramino */
						case "Ti" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])-1;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						case "Tcw" :
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])+1;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])+0;
							break;
						case "Tu" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])-1;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])+1;
							break;
						case "Tccw" :
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])+1;
							break;
						/* I tetramino */
						case "Ii" :                         
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])-2;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])+0;
							break;    
						case "Icw" :                         
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])+1;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])+2;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])-1;
							break;                   
						case "Iu" :                         
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])-2;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])+0;
							break;    
						case "Iccw" :
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])+1;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])+2;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])-1;
							break;                                           
						/* O tetramino */
						case "Oi" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])-1;       
							break;
						case "Ocw" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						case "Ou" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						case "Occw" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						/* S tetramino */
						case "Si" :
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])-1;
							t3['x'] = parseFloat(center['x'])+1;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])-1;
							t4['y'] = parseFloat(center['y'])+0;
							break;
						case "Scw" :
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])-1;
							t3['x'] = parseFloat(center['x'])+1;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])+1;      
							t4['y'] = parseFloat(center['y'])+1;
							break;
						case "Su" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])-1;
							t3['y'] = parseFloat(center['y'])+1;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])+1;
							break;
						case "Sccw" :
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])-1;
							t3['x'] = parseFloat(center['x'])-1;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])+1;
							break;
						/* Z tetramino */
						case "Zi" :                              
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])-1;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;      
							t4['x'] = parseFloat(center['x'])+1;        
							t4['y'] = parseFloat(center['y'])+0;
							break;                                      
						case "Zcw" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])-1;
							t3['x'] = parseFloat(center['x'])+1;      
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])+1;          
							break;                                       
						case "Zu" :     
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;      
							t3['y'] = parseFloat(center['y'])+1;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])+1;          
							break;
						case "Zccw" :
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])-1;
							t3['x'] = parseFloat(center['x'])-1;      
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])-1;
							t4['y'] = parseFloat(center['y'])+1;          
							break;       			 			
						/* L tetramino */
						case "Li" :                         
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+1;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])-1;
							break;    
						case "Lcw" :                         
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])-1;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])+1;
							break;    
						case "Lu" :                         
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+1;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])-1;
							t4['y'] = parseFloat(center['y'])+1;
							break;    
						case "Lccw" :
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])+1;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])+1;
							break;   
						/* J tetramino */
						case "Ji" :
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])-1;
							t3['x'] = parseFloat(center['x'])-1;      
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])+0;          
							break;
						case "Jcw" :
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])-1;
							t3['x'] = parseFloat(center['x'])+1;      
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])+1;          
							break;
						case "Ju" :
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+1;      
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])+1;          
							break;
						case "Jccw" :
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])-1;
							t3['x'] = parseFloat(center['x'])+0;      
							t3['y'] = parseFloat(center['y'])+1;
							t4['x'] = parseFloat(center['x'])-1;
							t4['y'] = parseFloat(center['y'])+1;          
							break;
						default:
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;      
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])+0;          
							break;								
					}					
					break;  
				default:
					switch(piece_orientation)
					{
							/*
							This switch choose the cases to be modified
							g: locked / garbage
							i: initial orientation
							ccw: CCW-rotation
							cw: CW-rotation
							u: reverse or double-rotated orientation
							*/
						/* T tetramino */
						case "Ti" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])-1;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])+1;
							break;
						case "Tccw" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])+1;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						case "Tcw" :
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])+1;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						case "Tu" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])-1;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						/* I tetramino */
						case "Ii" :                         
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])-1;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])-2;
							t4['y'] = parseFloat(center['y'])+0;
							break;    
						case "Iccw" :                         
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])+1;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])-2;
							break;    
						case "Iu" :                         
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])-1;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])-2;
							t4['y'] = parseFloat(center['y'])+0;
							break;    
						case "Icw" :
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])+1;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])-2;
							break;
						/* O tetramino */
						case "Oi" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])-1;       
							break;
						case "Ocw" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						case "Ou" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						case "Occw" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						/* Z tetramino */
						case "Zi" :
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])+1;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])+1;
							break;
						case "Zcw" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+1;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+0;      
							t4['y'] = parseFloat(center['y'])+1;
							break;
						case "Zu" :
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])+1;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])+1;
							break;
						case "Zccw" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+1;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])+1;
							break;
						/* S tetramino */
						case "Si" :                              
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])+1;      
							t4['x'] = parseFloat(center['x'])-1;        
							t4['y'] = parseFloat(center['y'])+1;
							break;                                      
						case "Scw" :
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])-1;      
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])+1;          
							break;                                       
						case "Su" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])+1;
							t4['x'] = parseFloat(center['x'])-1;
							t4['y'] = parseFloat(center['y'])+1;
							break;
						case "Sccw" :
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])-1;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])+1;
							break;       			 			
						/* L tetramino */
						case "Li" :
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])+1;
							t3['x'] = parseFloat(center['x'])-1;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])+0;
							break;
						case "Lccw" :
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])+1;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+1
							t4['y'] = parseFloat(center['y'])+1;
							break;
						case "Lcw" :
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])+1;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])-1;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						case "Lu" :
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+1;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						/* J tetramino */
						case "Ji" :
							t2['x'] = parseFloat(center['x'])+1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])-1;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])+1;
							break;
						case "Jccw" :
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])+1;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])-1;
							t4['x'] = parseFloat(center['x'])+1;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						case "Jcw" :
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])-1;
							t3['x'] = parseFloat(center['x'])+0;
							t3['y'] = parseFloat(center['y'])+1;
							t4['x'] = parseFloat(center['x'])-1;
							t4['y'] = parseFloat(center['y'])+1;
							break;
						case "Ju" :
							t2['x'] = parseFloat(center['x'])-1;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+1;
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])-1;
							t4['y'] = parseFloat(center['y'])-1;
							break;
						default:
							t2['x'] = parseFloat(center['x'])+0;
							t2['y'] = parseFloat(center['y'])+0;
							t3['x'] = parseFloat(center['x'])+0;      
							t3['y'] = parseFloat(center['y'])+0;
							t4['x'] = parseFloat(center['x'])+0;
							t4['y'] = parseFloat(center['y'])+0;          
							break;								
					}					
					break;
			}

                      
			var orientation = [t2,t3,t4]
			return orientation;
		}

		/**
		*
		*  Base64 encode / decode courtesy of
		*  http://www.webtoolkit.info/
		*                                                 
		**/

		var Base64 = {

			// private property
			_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

			// public method for encoding
			encode : function (input) {
				var output = "";
				var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
				var i = 0;

				input = Base64._utf8_encode(input);

				while (i < input.length) {

					chr1 = input.charCodeAt(i++);
					chr2 = input.charCodeAt(i++);
					chr3 = input.charCodeAt(i++);

					enc1 = chr1 >> 2;
					enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
					enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
					enc4 = chr3 & 63;

					if (isNaN(chr2)) {
						enc3 = enc4 = 64;
					} else if (isNaN(chr3)) {
						enc4 = 64;
					}

					output = output +
					this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
					this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

				}

				return output;
			},

			// public method for decoding
			decode : function (input) {
				var output = "";
				var chr1, chr2, chr3;
				var enc1, enc2, enc3, enc4;
				var i = 0;

				input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

				while (i < input.length) {

					enc1 = this._keyStr.indexOf(input.charAt(i++));
					enc2 = this._keyStr.indexOf(input.charAt(i++));
					enc3 = this._keyStr.indexOf(input.charAt(i++));
					enc4 = this._keyStr.indexOf(input.charAt(i++));

					chr1 = (enc1 << 2) | (enc2 >> 4);
					chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
					chr3 = ((enc3 & 3) << 6) | enc4;

					output = output + String.fromCharCode(chr1);

					if (enc3 != 64) {
						output = output + String.fromCharCode(chr2);
					}
					if (enc4 != 64) {
						output = output + String.fromCharCode(chr3);
					}

				}

				output = Base64._utf8_decode(output);

				return output;

			},

			// private method for UTF-8 encoding
			_utf8_encode : function (string) {
				string = string.replace(/\r\n/g,"\n");
				var utftext = "";

				for (var n = 0; n < string.length; n++) {

					var c = string.charCodeAt(n);

					if (c < 128) {
						utftext += String.fromCharCode(c);
					}
					else if((c > 127) && (c < 2048)) {
						utftext += String.fromCharCode((c >> 6) | 192);
						utftext += String.fromCharCode((c & 63) | 128);
					}
					else {
						utftext += String.fromCharCode((c >> 12) | 224);
						utftext += String.fromCharCode(((c >> 6) & 63) | 128);
						utftext += String.fromCharCode((c & 63) | 128);
					}

				}
                                                 
				return utftext;
			},

			// private method for UTF-8 decoding
			_utf8_decode : function (utftext) {
				var string = "";
				var i = 0;
				var c = c1 = c2 = 0;

				while ( i < utftext.length ) {

					c = utftext.charCodeAt(i);

					if (c < 128) {
						string += String.fromCharCode(c);
						i++;
					}
					else if((c > 191) && (c < 224)) {
						c2 = utftext.charCodeAt(i+1);
						string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
						i += 2;
					}
					else {
						c2 = utftext.charCodeAt(i+1);
						c3 = utftext.charCodeAt(i+2);
						string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
						i += 3;
					}

				}

				return string;
			}

		}

