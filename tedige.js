
$(document).ready(function(){
		/* Interface global variable */
		var is_clicking = 0;
		var right_clicking = 0;
		var left_remove = 0;
		
		/* Global variable */
		var defaultsystem = "ARS";
		var defaultborder = "Gray";
		var defaultwidth = 10;
		var defaultheight = 20;
		
		function Diagram(){
			/**
			* Diagram: an object that stores a collection of Playfields (= state of the game)
			*/

			this.Playfields = new Array(); //an array filled with Playfield objects
			this.current_playfield; //an index storing which playfield we're working on
			this.init = function(){
				/**
				* Initialises the diagram, draw the html table.
				*/
				this.Playfields.push(new Playfield());
				this.current_playfield= this.Playfields.length-1; // the array is numbered 0,1,2,... whereas the .length method returns 1,2,3,... Hence playfields.length-1
				this.Playfields[0].init();

				var drawnTetrion = "";
				

				// these are the hold and next pieces
				drawnTetrion += '<div id="top-box">';
				drawnTetrion += '<div id="holdbox"></div>';
				drawnTetrion += '<div id="next1box"></div>';
				drawnTetrion += '<div id="next2box"></div>';
				drawnTetrion += '<div id="next3box"></div>';
				drawnTetrion += '</div>';
				drawnTetrion += '<table id="diagram"> \n';
				
				for(var j=0; j<26;j++)
				{
					drawnTetrion += '<tr class="row'+j+'">';
					for(var i=0; i<26;i++)
					{
						
							drawnTetrion += '<td id="p' + i + 'x' + j + '" class="col'+i+'"><div class="inactivelayer"><div class="pixelborder"><div class="activelayer"><div class="decorationlayer"><div class="previewlayer"></div></div></div></div></div></td>';
						
						// classes are p<value> and not just <value> because CSS doesn't support
						// classes that begins with a number (theorically yes, but then you'll
						// have to convert the first number into a utf-8 number)...
					}
					drawnTetrion += '</tr> \n';
				}
				drawnTetrion += '</table> \n';
				$("#seed").prepend(drawnTetrion);
					for(var i=0;i<26;i++)
					{
						if(i<20)
						{
							for(var j=10;j<26;j++)
							{
								$('.col'+j,'#diagram').addClass('hidden');
							}
						}
						else
						{
							$('.row'+i,'#diagram').addClass('hidden');					
						}
					}
			}
			/* Add/remove playfields */
			this.new_playfield = function(){
				/**
				* Inject a new playfield in the Playfields array just after the current playfield.
				*/

				this.Playfields.splice(this.current_playfield+1,0,new Playfield()); // splice prepends the new array instead of appending it (1,2,3 => 1,insert,2,3 instead of 1,2,insert,3)
				this.current_playfield += 1;
				this.Playfields[this.current_playfield].init();
				this.Playfields[this.current_playfield].draw();
				this.update_framecount();
			}                                                             

			this.new_copy_playfield = function(){
				/**
				* Same thing as new_playfield, only it copies the current playfield into the new one
				*/
				var saved_pf = this.Playfields[this.current_playfield].print();
				this.new_playfield();
				this.Playfields[this.current_playfield].load_pf(saved_pf);
			}

			this.remove_current_playfield = function(){
				/**
				* Exactly what it says on the box.
				*/

				if(this.Playfields.length > 1 )
				{
					if(this.current_playfield-1 >= 0) // if the current playfield is not the first one
					{
						this.current_playfield -= 1;  // redirect the current pf to the preceding one. Note that is delete backwards (like the backspace key)... some may prefer a forward delete (like the del key)
						this.Playfields.splice(this.current_playfield+1,1);
					}
					else
					{
						this.Playfields.splice(this.current_playfield,1);
						this.current_playfield = 0;
					}

					this.Playfields[this.current_playfield].draw();
					this.update_framecount();
				}
			}
			this.remove_following_playfields = function(){
				/**
				* Kinda analogous with fumen's delete following
				*/

				this.Playfields.splice(this.current_playfield+1);
				this.update_framecount();
			}

			this.remove_all_playfields = function(){
				/**
				* Nukes everything !
				*/
				
				this.Playfields.splice(1);
				this.Playfields[0].init();
				this.current_playfield = 0;
				this.Playfields[this.current_playfield].draw();
				this.update_framecount();
				this.Playfields[this.current_playfield].change_size(10,20);				
			}

			/* Playfields navigation*/
			
			this.next_playfield = function(){
				/**
				* Displays the next playfield
				*/
				
				if(this.current_playfield+1 < this.Playfields.length)
				{
					this.current_playfield += 1;
					$("#border_color").val(D.Playfields[D.current_playfield].border_color); // sets selected border color to current
				}
				this.Playfields[this.current_playfield].draw();
				this.update_framecount();
			}
			this.previous_playfield = function(){
				/**
				* Displays the previous playfield
				*/

				if(this.current_playfield-1 >= 0)
				{
					this.current_playfield -= 1;
					this.Playfields[this.current_playfield].draw();
					this.update_framecount();
				}
			}
			this.first_playfield = function(){
				/**
				* Displays the first playfield
				*/

				this.current_playfield = 0;
				this.Playfields[this.current_playfield].draw();
				this.update_framecount();
			}
			this.last_playfield = function(){
				/**
				* Displays the last playfields
				*/

				this.current_playfield = this.Playfields.length-1;
				this.Playfields[this.current_playfield].draw();
				this.update_framecount();
			}

			this.update_framecount = function(){
				/**
				* Updates the frame counter
				*/

				$('#current-frame').html(this.current_playfield+1);
				$('#total-frame').html(this.Playfields.length);
			}
			
			/* Playfields manipulation*/			

			this.set_system_to_all = function(newsystem){
				/*
				* Applies the modify_system method to all playfields
				*/
			
				for(var i=0;i<this.Playfields.length;i++)
				{
					this.Playfields[i].system = newsystem;				
				}
				this.Playfields[this.current_playfield].modify_system(newsystem);
			}

			this.set_default_system = function(newsystem){
				/*
				* Set the default system to a new one
				*/
			
				defaultsystem = newsystem;
			}

			this.set_border_to_all = function(newborder){
				/*
				* Sets all the border to a new one
				*/
			
				for(var i=0;i<this.Playfields.length;i++)
				{
					this.Playfields[i].border_color = newborder;				
				}
				this.Playfields[this.current_playfield].modify_border(newborder);
			}
           
			this.set_default_border = function(newborder){
				/*
				* Set the default border to a new one
				*/
			
				defaultborder = newborder;
			}
			        
			this.change_size_to_all = function(){
			
			}
			/* Import/export*/			
			
			this.print = function(){
				/**
				* Generates an encoded string that describes the playfield.
				* Use playfield.print().
				* Each playfield are separated by a "+".
				*/

				var DiagramState = "";
				for(var i=0 ; i < this.Playfields.length;i++)
				{
					DiagramState += this.Playfields[i].print()+"+";
				}
				return DiagramState;
			}

			this.save = function(){
				/**
				* Displays what return print in the #export textarea.
				*/
				
				$("#export").html(this.print());
			}
			
			this.export_all_to_forum = function(){
				/**
				* Displays what return print in the #export textarea.
				*/
				
				$("#export").html('[tedige]'+this.print()+'[/tedige]');
			}	
			
			this.load = function(bigstr){
				/**
				* Reboot the diagram, parses the string in parameter and
				* fills the Playfields array accordingly.
				*/
				
				this.remove_all_playfields();

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

			this.export_all_to_url = function(){
				/**
				* Generates an URL with the current playfields
				*/
				
				var output = window.location.protocol+window.location.hostname;
				var tmp = window.location.pathname.split("/");

				for(var i = 0; i<tmp.length-1;i++)
				{
					output += tmp[i]+"/";
				}
				output+="view.html";
				$("#export").html(output+"?"+this.print());
			}

			this.export_all_to_edit_url = function(){
				/**
				* Generates an URL with the current playfields
				*/
				
				var output = window.location.protocol+window.location.hostname;
				var tmp = window.location.pathname.split("/");

				for(var i = 0; i<tmp.length-1;i++)
				{
					output += tmp[i]+"/";
				}
				output+="tedige.html";
				$("#export").html(output+"?"+this.print());
			}			
		}

		/* ------------------------------------------------------------- */

		function Playfield(){
			/**
			* Playfield: an object that stores a single state of the game
			* Tetrion is the main multi-dimensionnal array that contains all the necessary informations. Yes I know, Tetrion is the wrong term.
			* Tetrion[i][j]['content']			: inactive layer (unmovable blocks). Data is stored as a simple character. Displayed as the main cell background
			* Tetrion[i][j]['content_active']	: active layer (blocks that players can move). Data is stored as a simple character. Displayed as a background of a .active div inside the main cell.
			* Tetrion[i][j]['center_active']		: active center layer  (used to rotate the piece). Data is stored as 1 character for the piece nature and 1-3 character for the orientation
			* Tetrion[i][j]['decoration']		: decoration layer (i.e. arrows, highlight etc.) Displayed as a background of a .decoration div inside the main cell.
			*/

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

				for(var i=0;i<26;i++)
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
			/* Direct playfield manipulation */
			this.modify=function(x,y,value){
				/**
				*	Modifies the type of a single inactive cell in the array at the selected point.
				*	Also calls an update of the display.
				*/

				this.Tetrion[x][y]["content"]=value;
				var $workingcell = $('#p'+x+'x'+y);
				var $inactivelayer = $workingcell.find('.inactivelayer');   
				$workingcell.removeClass('haspreview hasinactive foreground-inactive');
				
				if(value == "_") //if we add something empty...                                                     
				{
					$inactivelayer.attr('class', 'inactivelayer'); //removes everything except inactivelayer 
				}
				else // ...else it's not void
				{
					if(this.Tetrion[x][y]['content_active'])  //if there's something on the active layer, do nothing
						{
						}
					else
					{
						$inactivelayer.attr('class', 'inactivelayer') //removes everything except inactivelayer 
									.addClass('piece-'+value);  // and add the correct classes                      
						$workingcell.addClass('hasinactive foreground-inactive');
					}
				}				
				
				
				if(this.stackborder_status) // draw the surrounding white pixel border; fake border method: checks if the surrounding cell is empty, then paint it with the apropriate the surrounding blocks with border images
				{
					if(y>=0 && this.Tetrion[x][y]['content'] == "_")
					{
						this.stackborder(x,y);
					}	
					
					if(y-1>=0 && this.Tetrion[x][y-1]['content'] == "_")
					{
						this.stackborder(x,y-1);
					}					
					
					if(x+1<this.pf_width && this.Tetrion[x+1][y]['content'] == "_")
					{
						this.stackborder(x+1,y);
					}					
					
					if(y+1<this.pf_height && this.Tetrion[x][y+1]['content'] == "_")
					{
						this.stackborder(x,y+1);
					}										
					
					if(x-1>=0 && this.Tetrion[x-1][y]['content'] == "_")
					{
						this.stackborder(x-1,y);
					}				
				}
				
			}
			this.modify_active=function(x,y,value){
				/**
				*	Modifies the type of a single active cell in the array at the selected point.
				*	Also calls an update of the display.
				*/

				this.Tetrion[x][y]['content_active']=value;       
				var $workingcell = $('#p'+x+'x'+y);
				var $activelayer = $workingcell.find('.activelayer');   
				
				$workingcell.removeClass('inactive haspreview foreground-inactive');
				if(value)
				{
					$activelayer.attr('class', 'activelayer') //removes everything except activelayer 
							    .addClass('piece-'+value);
					
					$workingcell.addClass("hasactive");
				}
				else 
				{
					$activelayer.attr('class', 'activelayer'); //removes everything except activelayer 
					$workingcell.removeClass("hasactive");
					if(this.Tetrion[x][y]['content'] != "_")
					{
						$workingcell.addClass('foreground-inactive');
					}
				}
			}
			this.modify_active_center = function(x,y,value){
				/**
				*	Modifies the type of a single active center in the array at the selected point.
				*/                
				this.the_active_center['coord']= x+"x"+y;
				this.the_active_center['piece']= value;
			}
			this.modify_preview=function(x,y,value){
				/**
				*	Calls for an update of the display at the selected point
				*/                     
				var $workingcell =$('#p'+x+'x'+y);
				var $previewlayer = $workingcell.find(".previewlayer");          
				
				$workingcell.removeClass("haspreview");
				$previewlayer.removeClass("transparent-preview");
				if(value)
				{
					$workingcell.addClass("haspreview");
					$previewlayer.addClass("transparent-preview");

				}
			}			
			this.modify_decoration=function(x,y,value){
				/**
				*	Modifies the type of decoration of a single inactive cell in the array at the selected point.
				*	Also calls an update of the display.
				*/

				this.Tetrion[x][y]["decoration"]=value;  
				var $decorationlayer = $('#p'+x+'x'+y).find(".decorationlayer")
				$decorationlayer.attr('class', 'decorationlayer') //removes everything except inactivelayer 
							    .addClass(value);
								
			}	
			this.modify_set_piece = function(current,modification_type,piece_nature,piece_orientation){
				/**
				* Another method that modifies the playfield, but in some more complicated ways (it *uses* the other modify methods).
				*
				* Takes as parameter:
				*		- current: array of the coordinate of the current case.
				*		- modification_type: add, remove preview, modify the active or inactive layer ?
				*		- piece_nature: the nature of the piece, e.g. L, S, T, garbage, item...
				*		- piece_orientation: the orientation of the piece: flat, upside down, ...
				*/
				
				var center = new Array();
				center.x = parseFloat(current.slice(1,current.indexOf("x"))); // X position
				center.y = parseFloat(current.slice(current.indexOf("x")+1)); // Y position

				var orientation = get_orientation(piece_orientation,center,this.system); // the orientation is set via an exterior function

				var t2 = new Array();
				var t3 = new Array();
				var t4 = new Array();

				// by default, all the coordinate are at the same point
				
				t2.x = parseFloat(center.x);
				t2.y = parseFloat(center.y);
				t3.x = parseFloat(center.x);
				t3.y = parseFloat(center.y);                                       
				t4.x = parseFloat(center.x);
				t4.y = parseFloat(center.y);
				// put the orientation we got in the new arrays				
				if(orientation[0].x>=0) 		{
					t2.x = parseFloat(orientation[0].x); 
					t2.y = parseFloat(orientation[0].y);
					t3.x = parseFloat(orientation[1].x);
					t3.y = parseFloat(orientation[1].y);
					t4.x = parseFloat(orientation[2].x);
					t4.y = parseFloat(orientation[2].y);
				}
				
			
				// process what we have	

				//20G or not ?
				if($('#drop:checked').val())
				{
					while(this.is_in(center.x,center.y) &&  this.is_in(t2.x,t2.y) && this.is_in(t3.x,t3.y) && this.is_in(t4.x,t4.y)
								&&	this.Tetrion[center.x][center.y]['content'] == "_"
								&&	this.Tetrion[t2.x][t2.y]['content'] == "_"
								&&	this.Tetrion[t3.x][t3.y]['content'] == "_"
								&&	this.Tetrion[t4.x][t4.y]['content'] == "_")
							{
								center.y = parseFloat(center.y)+1;	
								orientation = get_orientation(piece_orientation,center,this.system);
								t2.x = orientation[0].x;
								t2.y = orientation[0].y;
								t3.x = orientation[1].x;
								t3.y = orientation[1].y;
								t4.x = orientation[2].x;
								t4.y = orientation[2].y;
							}		
							center.y = parseFloat(center.y)-1;	
							orientation = get_orientation(piece_orientation,center,this.system);
							t2.x = orientation[0].x;
							t2.y = orientation[0].y;
							t3.x = orientation[1].x;
							t3.y = orientation[1].y;
							t4.x = orientation[2].x;
							t4.y = orientation[2].y;						

				}
				

				if(this.is_in(t2.x,t2.y) && this.is_in(t3.x,t3.y) && this.is_in(t4.x,t4.y)) // we don't want any out of bounds pieces
				{
					switch (modification_type) // let us modify our 4 cases
					{
					case "active":
							this.rebootActive();
							this.modify_active(center.x,center.y,piece_nature);
							this.modify_active_center(center.x,center.y,piece_orientation);
							this.modify_active(t2.x,t2.y,piece_nature);
							this.modify_active(t3.x,t3.y,piece_nature);
							this.modify_active(t4.x,t4.y,piece_nature);
							break;
					case "inactive": 					
							this.Tetrion_History_Save(); //history
							this.modify(center.x,center.y,piece_nature);
							this.modify(t2.x,t2.y,piece_nature);
							this.modify(t3.x,t3.y,piece_nature);
							this.modify(t4.x,t4.y,piece_nature);
							
							this.modify_preview(center.x,center.y,false);
							this.modify_preview(t2.x,t2.y,false);
							this.modify_preview(t3.x,t3.y,false);
							this.modify_preview(t4.x,t4.y,false);							
							break;
					case "addpreview":
						this.modify_preview(center.x,center.y,true);
						this.modify_preview(t2.x,t2.y,true);
						this.modify_preview(t3.x,t3.y,true);
						this.modify_preview(t4.x,t4.y,true);
						break;
					case "removepreview":
						this.modify_preview(center.x,center.y,false);
						this.modify_preview(t2.x,t2.y,false);
						this.modify_preview(t3.x,t3.y,false);
						this.modify_preview(t4.x,t4.y,false);
						break;
					}
				}
			}			

			this.rectangular_fill = function(x_start,y_start,x_end,y_end,nature){
				/**
				* Fills the playfield with the selected blocks at the selected coordinates
				*/				
								
				var a = Math.min(x_start,x_end);
				var b = Math.max(x_start,x_end);
				 
				var c = Math.min(y_start,y_end);
				var d = Math.max(y_start,y_end);
		
				for(var i=a;i<=b;i++)
				{
					for(var j=c;j<=d;j++)
					{
					this.modify(i,j,nature);
					}
				}
		
			}
			this.recursive_fill = function(x,y, replaced, replacer) {
				/**
				*  Fills the playfield like a paint bucket. Thanks Digital !
				*/
				
				x = parseFloat(x);
				y = parseFloat(y);
				
				if (this.Tetrion[x][y]['content'] != replaced)
					return;

				this.modify(x, y, replacer);

				if (y-1 >= 0)
					this.recursive_fill(x, y-1, replaced, replacer);

				if (y+1 < this.pf_height)
					this.recursive_fill(x, y+1, replaced, replacer);

				if (x+1 < this.pf_width)
					this.recursive_fill(x+1, y, replaced, replacer);

				if (x-1 >= 0)
					this.recursive_fill(x-1, y, replaced, replacer);
			}			

			this.shift_field = function (direction) {
				/**
				*	Shifts the whole field in the specified direction.
				*/

				if (direction == 'up') {
					// shifts rows up beginning at top row
					for (j = 0; j < this.pf_height-1; j++)
					{
						for (i = 0; i < this.pf_width; i++)
						{
							this.modify(i, j, this.Tetrion[i][j+1]['content']);
						}
					}

					// shifts bottom row up since there's no row below
					for (i = 0; i < this.pf_width; i++)
					{
						this.modify(i, this.pf_height-1, "_");
					}
				}

				if (direction == 'down') {
					// shifts rows down beginning at bottom row
					for (j = this.pf_height-1; j > 0; j--)
					{
						for (i = 0; i < this.pf_width; i++)
						{
							this.modify(i, j, this.Tetrion[i][j-1]['content']);
						}
					}

					// shifts top row down since there's no row above
					for (i = 0; i < this.pf_width; i++)
					{
						this.modify(i, 0, "_");
					}
				}

				if (direction == 'left') {
					// shifts columns left beginning at first column
					for (i = 0; i < this.pf_width-1; i++)
					{
						for (j = 0; j < this.pf_height; j++)
						{
							this.modify(i, j, this.Tetrion[i+1][j]['content']);
						}
					}

					// shifts last column left since there's no column to the right
					for (j = 0; j < this.pf_height; j++)
					{
						this.modify(this.pf_width-1, j, "_");
					}
				}

				if (direction == 'right') {
					// shifts columns right beginning at last column
					for (i = this.pf_width-1; i > 0; i--)
					{
						for (j = 0; j < this.pf_height; j++)
						{
							this.modify(i, j, this.Tetrion[i-1][j]['content']);
						}
					}

					// shifts first column right since there's no column to the left
					for (j = 0; j < this.pf_height; j++)
					{
						this.modify(0, j, "_");
					}
				}
			}			
			
			/* Playfield properties */
			
			this.modify_system = function(new_system){
				/**
				*  Changes the system to the current selected option.
				*/
				this.system = new_system;
				$('#system').val(new_system); // this is for loading purpose   

					if(new_system)
					{
					$("#style-blocks").attr("href","ressources/"+new_system+".css");				
					}
					else
					{
					$("#style-blocks").attr("href","ressources/ARS.css");
					}
			}                                                                                                                                                                                                                                             
			this.modify_border = function(newborder){
				/**
				*  Changes the color of the playfield border to the current selected option.
				*/
				this.border_color = newborder;
				$diagram = $('#diagram');
				switch(this.border_color)
				{
				case "gray" :
					$diagram.css('border', '5px solid gray');
					break;
				case "yellow" :
					$diagram.css('border', '5px solid yellow');
					break;
				case "blue" :
					$diagram.css('border', '5px solid blue');
					break;
				case "red" :
					$diagram.css('border', '5px solid red');
					break;
				case "green" :
					$diagram.css('border', '5px solid green');
					break;
				case "clear" :
					$diagram.css('border', '5px solid transparent');
					break;
				case "none" :
					$diagram.css('border', '5px solid transparent');
					break;
				default:
					$diagram.css('border', '5px solid gray');
					break;
				}
				$('#border_color').val(newborder);

			}
			this.stackborder = function(x,y){
				/**
				* Add appropriate white border to an empty cell
				*/				
				
				var outbkg ="";
				$pixelborder = $('#p'+x+'x'+y).find('.pixelborder');                  
				$pixelborder.attr('class', 'pixelborder');
				if(this.Tetrion[x][y]['content'] == "_")
					{
						outbkg +="border-";
						if(y-1>=0 && this.Tetrion[x][y-1]['content'] != "_")
						{
							outbkg += "top";
						}					
						
						if(x+1<this.pf_width && this.Tetrion[x+1][y]['content'] != "_")
						{
							outbkg += "right";
						}					
						
						if(y+1<this.pf_height && this.Tetrion[x][y+1]['content'] != "_")
						{
							outbkg += "bottom";
						}										
						
						if(x-1>=0 && this.Tetrion[x-1][y]['content'] != "_")
						{
							outbkg += "left";
						}
					}
				if(outbkg)
					{
						$pixelborder.addClass(outbkg);						
					}
			}
			this.draw_stackborder = function(status){
				/**
				* Apply stackborder to every cell
				*/				
				
				var outbkg ="";	


				for(var i=0;i<this.pf_width;i++)
				{
					for(var j=0;j<this.pf_height;j++)
					{
						var $pixelborder = $('#p'+i+'x'+j).find('.pixelborder');                  
						$pixelborder.attr('class', 'pixelborder');						
						if(this.Tetrion[i][j]['content'] == "_")
						{
							if(this.Tetrion[i][j]['content_active'] == "")
							{
								if(status)
								{
									outbkg +="border-";
									
									if(j-1>=0 && this.Tetrion[i][j-1]['content'] != "_")
									{
										outbkg += "top";
									}					
									
									if(i+1<this.pf_width && this.Tetrion[i+1][j]['content'] != "_")
									{
										outbkg += "right";
									}					
									
									if(j+1<this.pf_height && this.Tetrion[i][j+1]['content'] != "_")
									{
										outbkg += "bottom";
									}										
									
									if(i-1>=0 && this.Tetrion[i-1][j]['content'] != "_")
									{
										outbkg += "left";
									}
								}

								if(outbkg)
								{
									$pixelborder.addClass(outbkg);						
								}
								
							outbkg ="";
							}
						}
					}
					
				}
				
			}
			this.save_comment = function(){
				/**
				* saves what is in the comment textarea
				*/
				this.comment = $('#com').val();
			}
			
			/* Active piece manipulation */
			
			this.paint_active = function(){
				/**
				* Looks for something in the active layer, paint it on the inactive layer
				*/
				for(var i=0;i<this.pf_width;i++)
				{
					for(var j=0;j<this.pf_height;j++)
					{
						if(this.Tetrion[i][j]['content_active'])
						{
							this.modify(i,j,this.Tetrion[i][j]['content_active']);
						}
					}			
				}
			}    
			this.lock_active = function(){
				/**
				* Locking is simply paint + remove active  
				*/				
				this.paint_active();
				this.rebootActive();
			}
			this.drop_active = function(){
				/*                                            
				get active positions . how about making that a class attribute ?
				look down
				draw in the highest place
				*/     


			}
			this.lookup_block = function(id) {
				/**
				* Looks for the block type at the coordinate in parameter (e.g. p3x2)
				* (only in the inactive layer)
				*/				

				var x_begin = id.indexOf('p');
				var y_begin = id.indexOf('x');

				var x = parseInt(id.substring(x_begin+1, y_begin));
				var y = parseInt(id.substring(y_begin+1));
				
				return this.Tetrion[x][y]['content'];
			}
			this.lookup_decoration = function(id) {
				/**
				* Looks for the decoration type at the coordinate in parameter (e.g. p3x2)
				*/				

				var x_begin = id.indexOf('p');
				var y_begin = id.indexOf('x');

				var x = parseInt(id.substring(x_begin+1, y_begin));
				var y = parseInt(id.substring(y_begin+1));
				
				return this.Tetrion[x][y]['decoration'];
			}			
			this.spawn_piece = function(piece_nature){
				/**
				*	Spawn an active piece to the top of a playfield, juste like a normal game would do
				*  TODO: implement IRS. Problem: the playfield need to be 2 case heigher in the Y direction
				*		  (4 in SRS)                   
				*/
				var position_x = parseInt(this.pf_width) / 2;
				var position_y = 3;
				var spawn_position = "p"+position_x+"x0"
				
				this.modify_set_piece(spawn_position,"active",piece_nature,piece_nature+"i");
			}

			this.move_piece = function (direction) {
				/**
				*	Moves the active piece in active layer of the array
				*/                                                         
				// i'm too lazy to rewrite the whole function according to the_active_center... I know, this is BAD :( 
				var lazy= this.the_active_center['coord'].split('x');
				var the_center = this.the_active_center['piece'];
				var center_position = new Array;
				center_position.x = lazy[0];                                                                                                                                                     
				center_position.y = lazy[1];   
				
				// we need a center ! where is it ?
				/*for(var i=0;i<this.pf_width;i++) // we need a center ! where is it ?
				{
					for(var j=0;j<this.pf_height;j++)
					{
						if(this.Tetrion[i][j]['center_active'])
						{
							var the_center = this.Tetrion[i][j]['center_active'];
							var center_position = new Array;
							center_position.x = i;                                                                                                                                                     
							center_position.y = j;
						}
					}
				}           */                          
				var piece_nature = the_center.slice(0,1); // extract the piece nature and orientation from the center_active string
				var piece_orientation = the_center.slice(1);

				switch(direction) //computes what to modify with the center position
				{
				case "none":
					center_position.x = parseFloat(center_position.x);
					center_position.y = parseFloat(center_position.y);
					break;
				case "up":
					center_position.x = parseFloat(center_position.x);
					center_position.y = parseFloat(center_position.y)-1;
					break;
				case "down":
					center_position.x = parseFloat(center_position.x);
					center_position.y = parseFloat(center_position.y)+1;
					break;
				case "left":
					center_position.x = parseFloat(center_position.x)-1;
					center_position.y = parseFloat(center_position.y);
					break;
				case "right":
					center_position.x = parseFloat(center_position.x)+1;
					center_position.y = parseFloat(center_position.y);
					break;
				case "cw":
					if(piece_orientation)
					{
						switch( piece_orientation )
						{
						case "i" :
							piece_orientation = "cw";
							break;
						case "cw" :
							piece_orientation = "u"
							break;
						case "u" :
							piece_orientation = "ccw"
							break;
						case "ccw" :
							piece_orientation = "i"
							break;
						}
					}
					the_center = piece_nature+piece_orientation;
					break;
				case "ccw":
					if(piece_orientation)
					{
						switch( piece_orientation )
						{
						case "i" :
							piece_orientation = "ccw";
							break;
						case "ccw" :
							piece_orientation = "u"
							break;
						case "u" :
							piece_orientation = "cw"
							break;
						case "cw" :
							piece_orientation = "i"
							break;
						}
					}
					the_center = piece_nature+piece_orientation;
					break;
				}

				var orientation = get_orientation(the_center,center_position,this.system);

				var t2 = new Array();
				var t3 = new Array();
				var t4 = new Array();
				t2.x = orientation[0].x;
				t2.y = orientation[0].y;
				t3.x = orientation[1].x;
				t3.y = orientation[1].y;
				t4.x = orientation[2].x;
				t4.y = orientation[2].y;

				if(the_center == "T"
					|| the_center == "L"
				|| the_center == "J"
				|| the_center == "S"
				|| the_center == "Z"
				|| the_center == "I"
				|| the_center == "G")
				{
					t2.x = center_position.x;
					t2.y = center_position.y;
					t3.x = center_position.x;
					t3.y = center_position.y;
					t4.x = center_position.x;
					t4.y = center_position.y;
				}
				if(this.is_in(t2.x,t2.y) && this.is_in(t3.x,t3.y) && this.is_in(t4.x,t4.y))
				{
					if($('input#collision:checked').val())
					{                                                                      
						if(this.Tetrion[center_position.x][center_position.y]['content'] == "_"
							&& this.Tetrion[t2.x][t2.y]['content'] == "_"
							&& this.Tetrion[t3.x][t3.y]['content'] == "_"	
							&& this.Tetrion[t4.x][t4.y]['content'] == "_")
						{
						this.rebootActive();
						this.modify_active(center_position.x,center_position.y,piece_nature);
						this.modify_active_center(center_position.x,center_position.y,the_center);
						this.modify_active(t2.x,t2.y,piece_nature);
						this.modify_active(t3.x,t3.y,piece_nature);
						this.modify_active(t4.x,t4.y,piece_nature);						
						}
					}
					else
					{          
						this.rebootActive();
						this.modify_active(center_position.x,center_position.y,piece_nature);
						this.modify_active_center(center_position.x,center_position.y,the_center);
						this.modify_active(t2.x,t2.y,piece_nature);
						this.modify_active(t3.x,t3.y,piece_nature);
						this.modify_active(t4.x,t4.y,piece_nature);
					}
				}
			}
			
			this.drop_active_piece = function(){
				/**
				* Drop the active piece as if it was 20G.
				*/

				var lazy= this.the_active_center['coord'].split('x');
				var the_center = this.the_active_center['piece'];
				var center_position = new Array;
				var piece_nature = the_center.slice(0,1); // extract the piece nature and orientation from the center_active string
				var piece_orientation = the_center.slice(1);
				
				center_position.x = lazy[0];                                                                                                                                                     
				center_position.y = lazy[1];   
				var orientation = get_orientation(the_center,center_position,this.system);
				var t2 = new Array();
				var t3 = new Array();
				var t4 = new Array();
				t2.x = orientation[0].x;
				t2.y = orientation[0].y;
				t3.x = orientation[1].x;
				t3.y = orientation[1].y;
				t4.x = orientation[2].x;
				t4.y = orientation[2].y;
				
						center_position.x = parseFloat(center_position.x);
						center_position.y = parseFloat(center_position.y)+1;	
						orientation = get_orientation(the_center,center_position,this.system);

						if($('#collision:checked').val())
						{     
							/* As long as the active piece doesn't hits something, shift 1 case down. */
							while(this.is_in(t2.x,t2.y) && this.is_in(t3.x,t3.y) && this.is_in(t4.x,t4.y)
								&&	this.Tetrion[center_position.x][center_position.y]['content'] == "_"
								&&	this.Tetrion[t2.x][t2.y]['content'] == "_"
								&&	this.Tetrion[t3.x][t3.y]['content'] == "_"
								&&	this.Tetrion[t4.x][t4.y]['content'] == "_")
							{
								center_position.y = parseFloat(center_position.y)+1;	
								orientation = get_orientation(the_center,center_position,this.system);
								t2.x = orientation[0].x;
								t2.y = orientation[0].y;
								t3.x = orientation[1].x;
								t3.y = orientation[1].y;
								t4.x = orientation[2].x;
								t4.y = orientation[2].y;
							}
						}
						else
						{          
							while(this.is_in(t2.x,t2.y) && this.is_in(t3.x,t3.y) && this.is_in(t4.x,t4.y))
							{
								center_position.y = parseFloat(center_position.y)+1;	
								orientation = get_orientation(the_center,center_position,this.system);
								t2.x = orientation[0].x;
								t2.y = orientation[0].y;
								t3.x = orientation[1].x;
								t3.y = orientation[1].y;
								t4.x = orientation[2].x;
								t4.y = orientation[2].y;

							}                                   
						}
							/* The while loops had the piece one case too low. */
							center_position.y = parseFloat(center_position.y)-1;	
							orientation = get_orientation(the_center,center_position,this.system);
							t2.x = orientation[0].x;
							t2.y = orientation[0].y;
							t3.x = orientation[1].x;
							t3.y = orientation[1].y;
							t4.x = orientation[2].x;
							t4.y = orientation[2].y;
						
						
						this.rebootActive();
						this.modify_active(center_position.x,center_position.y,piece_nature);
						this.modify_active_center(center_position.x,center_position.y,the_center);
						this.modify_active(t2.x,t2.y,piece_nature);
						this.modify_active(t3.x,t3.y,piece_nature);
						this.modify_active(t4.x,t4.y,piece_nature);
		
						

				
			}
			
			/* Playfield size management */			

			this.change_size = function(newwidth,newheight){

				/* $('diagram').html(newShinyPlayfield) won't work because 
				Jquery doesn't bind to newly created elements.
				I *don't* want to rewrite 90% of my code to implement
				livequery */ 
				/* The solution is to drawn a greater than necessary playfield and
				    hide what's unecessary (see change_size_display)*/

				// reset everything
				if(this.pf_height != newheight || this.pf_width != newwidth)
				{
								
					this.pf_height = newheight;
					this.pf_width = newwidth;
					
					defaultwidth  = newwidth;
					defaultheight = newheight;					
					
				}
			}
			
			this.change_size_display = function(){
				/**
				* change_size changed the class attribute, change_size_display actually
				* changes how the playfield is displayed
				*/
				
					for(var i=0;i<26;i++)
					{
						$('.row'+i,'#diagram').removeClass('hidden');					
						for(var j=0;j<this.pf_width;j++)
						{
							$('.col'+j,'#diagram').removeClass('hidden');
						}
					}
					
					
					for(var i=0;i<26;i++)
					{
						if(i<this.pf_height)
						{
							for(var j=this.pf_width;j<26;j++)
							{
								$('.col'+j,'#diagram').addClass('hidden');
							}
						}
						else
						{
							$('.row'+i,'#diagram').addClass('hidden');					
						}
						
					}
				
			}
			
			/* Next and hold management */
			this.modify_hold = function(newhold) {
				/**
				* Changes the hold piece
				*/
				this.hold = newhold ;  
				var $holdbox = $('#holdbox');
				$('#hold').val(newhold); // this is for loading purpose
				$holdbox.attr('class', 'holdbox')   
						.addClass('hold-'+newhold);
			}
			this.modify_next1 = function(newnext1) {
				this.next1 = newnext1        
				var $next1box = $('#next1box');
				$('#next1').val(newnext1);
				$next1box.attr('class', 'next1box') 
						  .addClass('next1-'+newnext1);
			}
			this.modify_next2 = function(newnext2) {
				this.next2 = newnext2
				var $next2box = $('#next2box');
				$('#next2').val(newnext2);
				$next2box.attr('class', 'next2box') 
						  .addClass('next2-'+newnext2);
			}
			this.modify_next3 = function(newnext3) {
				this.next3 = newnext3         
				var $next3box = $('#next3box');
				$('#next3').val(newnext3);
				$next3box.attr('class', 'next3box') 
						  .addClass('next3-'+newnext3);
			}
			this.switchhold = function(){
				/**
				* Switch the current active piece with the hold.
				*/
				
				var tmp = this.the_active_center['piece'].slice(0,1);
				this.rebootActive();
				if(this.hold)
				{
				this.spawn_piece(this.hold);
				this.modify_hold('');				
				}
				this.modify_hold(tmp);
				
			}

			this.advance_next = function(){
				/**
				* Advance the next piece, as if next1 was distributed
				* possible expansion: take next3 piece as parameter
				*/				
				
				this.modify_next1(this.next2);	
				this.modify_next2(this.next3);	
				this.modify_next3('');				
			}
			
			this.line_clear = function () {
				/**
				*	Clears all rows on the field that are full and shifts field down.
				*/

				for (var j = 0; j <= this.pf_height-1; j++) // start at the top row and go down
				{
					var row_occupation = 0; // to track how many blocks are on a row

					// searches the row to find out how many blocks are in it
					for (var i = 0; i < this.pf_width; i++)
					{
						if (this.Tetrion[i][j]['content'] != "_")
							row_occupation++;
					}

					// clears line if row is completely occupied
					if (row_occupation == this.pf_width)
					{
						// shifts rows down beginning at specified row and going up
						for (k = j; k > -1; k--)
						{
							// if not the top row, copy row above
							if ( k != 0)
							{
								for (i = 0; i < this.pf_width; i++)
								{
									this.modify(i, k, this.Tetrion[i][k-1]['content']);
								}
							}
							// for top row since there's no row above
							else {
								for (i = 0; i < this.pf_width; i++)
								{
									this.modify(i, k, "_");
								}
							}
						}
					}
				}
			}

			/* Import/export management */

			this.print = function (){
				/**
				* Generates an encoded string that describes the playfield.
				*******************
				* Encoding format *
				*******************
				* - Each frame are separated by a "+"
				* - within each frame, a "_" separates different data
				* - those data are identified with a two letters identifier, starting with "*" and following with:
				*   -> "s" : size
				*   -> "r" : "rotation", or rotation system currently in use
				*   -> "b" : border color
				*   -> "n" : "next" preview
				*   -> "m" : "next" + 1
				*   -> "o  : "next" + 2
				*   -> "g" : "garbage": the inactive pieces coordinates
				*			  each case are separated by a "-", and the coordinate are encoded by two letters (see alphanumconvert())
				*   -> "a" : "active": or the active center coordoniates                                                       
				*			  each case are separated by a "-", and the coordinate are encoded by two letters (see alphanumconvert())
				*   -> "d" : "decoration": the third 'decoration' layer
				*   -> "c" : "comment", encoded in base64
				*   -> "w" : "white (border)", white pixel border
				*				*
				* Example:
				* *rARS_*geeT-feT-dfT-efT-ffT-cgT-dgT-fgT-fhT-fiT-fjT-fkT-flT-fmT-fnT-_*cT25lIGJsdWU%3D+*rARS_*gdcL-ecL-fcL-ddL-fdL-gdL-ceL-geL-heL-cfL-hfL-cgL-hgL-chL-hhL-hiL-gjL-fkL-gkL-flL-emL-dnL-enL-doL-dpL-epL-fpL-gpL-hpL-_*cVHdvIG9yYW5nZQ%3D%3D+*rARS_*gbfZ-cfZ-dfZ-efZ-fgZ-fhZ-fiZ-cjZ-djZ-ejZ-fjZ-ekZ-flZ-glZ-fmZ-gmZ-enZ-fnZ-boZ-coZ-doZ-eoZ-_*ahc-Oi_*cVGhyZWUgZ3JlZW4gYW5kIGFjdGl2ZSB5ZWxsb3c%3D+

				* <- that should be One blue, Two Orange, Three green and yellow active.
                                *
				* Alt encoding (not implemented yet): list every piece type and then they positions, e.g.
				*
				* *gTO*ee-fe-df-df-ef-ff-cg*fj-fk-fl-fm
				* | |        |-> 1st coord      |-> 2nd
				* | |-> piece types (here, a T and a O)
				* |-> control character
				*
				* *rARS_*gT*ee-fe-df-ef-ff-cg*O
				*
				*/
				var TetrionState=""; // our final string
				var tmp=""; // an utility string, may be flushed at will
				var coord_x;
				var coord_y;

				// We're encoding for one frame only, the rest is handled by the higher class

				// "s"
				if(this.pf_height != 20 || this.pf_width != 10) // write size only if non-standard size
				{
					TetrionState +="*s"+this.pf_width+"x"+this.pf_height+"_";
				}
					
				
				// "r"
				if(this.system)
				{
					TetrionState += "*r"+this.system+"_";
				}

				// "b"

				if(this.border_color)
				{
					TetrionState += "*b"+this.border_color+"_";
				}

				// "h", "n","m","o": hold and nexts pieces; the system is modular enough to don't care if they aren't present
				if(this.hold)
				{
					TetrionState += "*h"+this.hold+"_";
				}

				if(this.next1)
				{
					TetrionState += "*n"+this.next1+"_";
				}

				if(this.next2)
				{
					TetrionState += "*m"+this.next2+"_";
				}
				if(this.next3)
				{
					TetrionState += "*o"+this.next3+"_";
				}
				
				// "g": Let's check if the Tetrion is empty. While we're at it, encode its content
				for(var j=0; j<this.pf_height;j++) //inactive
				{
					for(var i=0; i<this.pf_width;i++)
					{
						if(this.Tetrion[i][j]["content"] != "_")
						{
							
							coord_x = alphanumconvert(i);
							coord_y = alphanumconvert(j);
							tmp += coord_x+coord_y+this.Tetrion[i][j]["content"]+"-";
						}
					}
				}
				
				// if it's not empty, congratulation, you got a garbage string !
				if(tmp)
				{
					TetrionState+="*g";
					TetrionState+=tmp+"_";
					tmp=""; // let's reset tmp for further use
				}

				// "a" Active piece.

				if(this.the_active_center['piece'])
					{
						var coord = this.the_active_center['coord'].split('x');	
						coord_x = alphanumconvert(parseInt(coord[0]));
						coord_y = alphanumconvert(parseInt(coord[1]));
						tmp+=coord_x+coord_y+"-"+this.the_active_center['piece'];						
					}
				
				/*for(var j=0; j<this.pf_height;j++) //Active
				{
					for(var i=0; i<this.pf_width;i++)
					{
						if(this.Tetrion[i][j]['center_active'])
						{
							coord_x = alphanumconvert(i);
							coord_y = alphanumconvert(j);
							tmp+=coord_x+coord_y+"-"+this.Tetrion[i][j]['center_active'];
						}
					}
				}*/
                                                                                         
				// if it's not empty means we got an active center
				if(tmp)
				{
					TetrionState+="*a";
					TetrionState+=tmp+"_";
					tmp=""; // let's reset tmp for further use
				}


				// "d" same old song

				for(var j=0; j<this.pf_height;j++) //inactive
				{
					for(var i=0; i<this.pf_width;i++)
					{
						if(this.Tetrion[i][j]["decoration"])
						{
							coord_x = alphanumconvert(i);
							coord_y = alphanumconvert(j);
							tmp += coord_x+coord_y+this.Tetrion[i][j]["decoration"]+"-";
						}
					}
				}

				if(tmp)
				{
					TetrionState+="*d";
					TetrionState+=tmp+"_";
					tmp=""; // let's reset tmp for further use
				}				                                                              
				
				if(this.comment) //comment
				{
					//replace the authorized html tags
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
					
					TetrionState+="*c"+encodeURIComponent(Base64.encode(this.comment));
				}
				
				if(this.stackborder_status) //stackborder
				{
				TetrionState+="*w"
				}
				return TetrionState;
			}
			this.export_pf = function(){
				/**
				* Displays the print result in the export textarea
				*/

				$("#export").html(this.print());

			}
			this.load_pf = function(str){
				/**
				* Reboot the playfield, parses the string in parameter and
				* fills it accordingly. See print for more info about decoding
				*/
				this.rebootPlayfield();
				this.rebootActive();
				if(!str){return;}
				this.change_size(10,20); // reset size to standard
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
							this.change_size_display();
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
								this.modify(coord_x,coord_y,inactiveSplit[j].charAt(2));
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

							this.rebootActive();
							this.modify_active(center.x,center.y,piece_nature);
							this.modify_active_center(center.x,center.y,piece_orientation);
							this.modify_active(t2.x,t2.y,piece_nature);
							this.modify_active(t3.x,t3.y,piece_nature);
							this.modify_active(t4.x,t4.y,piece_nature);
							break;
						case "c":
							this.comment = Base64.decode(decodeURIComponent(Split[i].slice(2)));
							$('#com').val(this.comment);
							break;
						case "w" :
							this.stackborder_status = 1;
							this.draw_stackborder(1);
							break;

						}
					}

				}
			}
			this.export_to_tw = function (){
				/**
				* Generates a tetris wiki-compliant string from the array.
				*/
				var code="";

				code += '&#060;diagram';

				// border color
				if (this.border_color != "")
					code += ' border=' + this.border_color;

				// width other than 10
				if (parseInt($('#width').val()) != 10)
					code += ' width=' + parseInt($('#width').val());

				// system
				if (this.system != "")
					code += ' system=' + this.system;

				// hold
				if (this.hold != "")
					code += ' hold=' + this.hold;

				// next
				if (this.next1 != "") {
					code += ' next=' + this.next1;

					if(this.next2 != "")
						code += ',' + this.next2;

					if(this.next3 != "")
						code += ',' + this.next3;
				}

				code += '>\n';

				for(var j=0; j<this.pf_height;j++)
				{
					for(var i=0; i<this.pf_width;i++)
					{
						if(this.Tetrion[i][j]['content_active'])
						{
							code+= "|" + this.Tetrion[i][j]['content_active'];
						}
						else
						{
							if(this.Tetrion[i][j]["content"] == "_")
							{
								code += "| ";
							}
							else
							{
								code += "|" + this.Tetrion[i][j]["content"];
							}
						}
					}
					code += '|\n';
				}

				code += '&#060;/diagram>';

				if($('#com').val() != "")
					code += '\n' + $('#com').val();

				$('#export').html(code);
				$('#console-description').html("copy and paste into tetriswiki");
			}
			this.export_to_url = function(){
				/**
				* Generates an URL with the current playfield
				*/
				var output = window.location.protocol+window.location.hostname;
				var tmp = window.location.pathname.split("/");

				for(var i = 0; i<tmp.length-1;i++)
				{
					output += tmp[i]+"/";
				}
				output+="view.html";
				$("#export").html(output+"#"+this.print());
			}

			this.export_to_edit_url = function(){
				/**
				* Generates an URL with the current playfield
				*/
				var output = window.location.protocol+window.location.hostname;
				var tmp = window.location.pathname.split("/");

				for(var i = 0; i<tmp.length-1;i++)
				{
					output += tmp[i]+"/";
				}
				output+="tedige.html";
				$("#export").html(output+"#"+this.print());
			}

			
			this.export_to_forum = function(){
				/**
				* Generates an usable forum string
				*/
				$("#export").html("[tedige]"+this.print()+"[/tedige]");
			}

			/* Internal function */

			this.is_in = function(x,y){
				/**
				* Checks if a point is outside of the playfield
				*/
				if(x < 0 ||y < 0 || x>=this.pf_width || y>=this.pf_height)
					{return false;}
				return true;
			}

			this.rebootPlayfield = function(){
				/**
				* Sets the whole inactive layer of the array to "_" (empty cell).
				*/
				for(var i=0;i<this.pf_width;i++)
				{
					for(var j=0;j<this.pf_height;j++)
					{
						this.Tetrion[i][j]["content"]= "_";
					}
				}
			}

			this.rebootActive = function(){
				/**
				* Sets the whole active layer of the array to "" (empty cell).
				* Sets the same with the active center
				*/
				for(var i=0;i<this.pf_width;i++)
				{
					for(var j=0;j<this.pf_height;j++)
					{
						this.modify_active(i,j,"");
						this.modify_active_center(i,j,"");
					}
				}
			}

			this.draw = function(){
				/**
				* Sets every cells to its rightful class
				* /!\ Slow function ! Do not overuse it (especially on mouseover)
				*/				 

				this.modify_system(this.system);  
                                                                 
				var $diagram = $('#diagram');
				this.change_size_display();
				                                
				// sets the border
				switch(this.border_color)
				{
				case "gray" :                     
					$diagram.css('border', '5px solid gray');
					break;
				case "yellow" :
					$diagram.css('border', '5px solid yellow');
					break;
				case "blue" :
					$diagram.css('border', '5px solid blue');
					break;
				case "red" :
					$diagram.css('border', '5px solid red');
					break;
				case "green" :
					$diagram.css('border', '5px solid green');
					break;
				case "clear" :
					$diagram.css('border', '5px solid transparent');
					break;
				case "none" :
					$diagram.css('border', '5px solid transparent');
					break;
				default :
					$diagram.css('border', '5px solid gray');
					break;
				
				}

				// sets hold_and next
					this.modify_hold(this.hold);
					this.modify_next1(this.next1);				
					this.modify_next2(this.next2);				
					this.modify_next3(this.next3);									
				var $workingcell = '';	
				// sets every cell
				for(var i=0;i<this.pf_width;i++)
				{
					for(var j=0;j<this.pf_height;j++)
					{      
						$workingcell = $('#p'+i+'x'+j);
						$inactivelayer = $workingcell.find('.inactivelayer');
						$activelayer = $workingcell.find('.activelayer');
						$decorationlayer = $workingcell.find('.decorationlayer');
						
						$inactivelayer.attr('class', 'inactivelayer');
						$activelayer.attr('class', 'activelayer');                               
						$decorationlayer.attr('class', 'decorationlayer'); 
						$workingcell.removeClass('haspreview foreground-inactive hasinactive hasactive');
						                                                                  
						/* inactive pixel active deco preview */                         

						if(this.Tetrion[i][j]['content_active'])
						{                                                                    
							$activelayer.addClass('piece-'+this.Tetrion[i][j]['content_active']);
							$workingcell.addClass('hasactive');    
							if(this.Tetrion[i][j]['content'] != "_")
							{
								$workingcell.addClass('hasinactive');    								
							}   
						}
						
						if(this.Tetrion[i][j]['content'] != "_") // <- if not empty cell
						{                                                                     
							$inactivelayer.addClass('piece-'+this.Tetrion[i][j]['content']);
							$workingcell.addClass('hasinactive foreground-inactive');              
                                                
						}
						
						if(this.Tetrion[i][j]['decoration'])
						{
							$decorationlayer.addClass(this.Tetrion[i][j]["decoration"]);
						}
						
                                         
					}
				}
				$('#com').val(this.comment);
				
				if(this.stackborder_status)
				{
				this.draw_stackborder(this.stackborder_status);				
				}


			}
		
			/* Undo manager */
			this.Tetrion_History_Save = function (){
				/**
				* Stores the last frame in memory
				*/
				this.Tetrion_History.push(this.print());
			}
			this.Tetrion_History_Recall = function (){
				/**
				* Load the last frame in memory
				*/
				this.load_pf(this.Tetrion_History[this.Tetrion_History.length-1]);
				this.Tetrion_History.pop();
			}
			
			
		}


		/* -------------------------------------------------------------
		More general function here
		------------------------------------------------------------- */
	
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
						case "Sccw" :
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
						case "Scw" :
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
						case "Lccw" :                         
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
						case "Lcw" :
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

		/* -------------------------------------------------------------
		Interface there
		------------------------------------------------------------- */
		var D = new Diagram();
		D.init();
		
		/*------------------------ Save control ------------------ */  
		
		var URLHash = window.location.search;
		if(URLHash) // load if there's something in the url
		{
			var toLoad = URLHash.split('?');
			D.load(toLoad[1]);
			D.first_playfield();
			                 
		}      
        	
        	
		$("#save-button").click(function(){    
					if ($('input[name=export]:checked').val() == 'All') {
						if($('input[name=exporturl]:checked').val() == 'url')
						{
							D.export_all_to_url();
							$('#export').select();
						}
						else if($('input[name=exporturl]:checked').val() == 'urledit')
						{
							D.export_all_to_edit_url();
							$('#export').select();
						}
						else if($('input[name=exporturl]:checked').val() == 'forum')
						{
							D.export_all_to_forum();
							$('#export').select();
						}
						else
						{
							D.save();
							$('#export').select();
						}
					}
        	
					if ($('input[name=export]:checked').val() == 'Current') {
						if($('input[name=exporturl]:checked').val() == 'url')
						{
							D.Playfields[D.current_playfield].export_to_url();
							$('#export').select();
						}
						else if($('input[name=exporturl]:checked').val() == 'urledit')
						{
							D.Playfields[D.current_playfield].export_to_edit_url();
							$('#export').select();
						}
						else if($('input[name=exporturl]:checked').val() == 'forum')
						{
							D.Playfields[D.current_playfield].export_to_forum();
							$('#export').select();
						}
						else
						{
							D.Playfields[D.current_playfield].export_pf();
							$('#export').select();
						}
					}
			})

		$("#load-button").click(function(){
					if ($('input[name=export]:checked').val() == 'All') {
						var bigstr = $("#import").val();
						D.load(bigstr);
					}
					if ($('input[name=export]:checked').val() == 'Current') {
						var str = $("#import").val();
						D.Playfields[D.current_playfield].load_pf(str);
					}
			})    		
		/*------------------------ Mouse control ------------------ */ 
			 var $body = $('body'); 
			$body.mousedown(function(){is_clicking = 1; right_clicking = 0;})
				  .mouseup(function(){is_clicking = 0; right_clicking = 0; left_remove = 0;})
		/*		  .rightMouseDown(function(){is_clicking = 0; right_clicking = 1;})
				  .rightMouseUp(function(){is_clicking = 0; right_clicking = 0;});*/
			
			$('#diagram td').hover(function()
			{
				var position = $(this).attr("id");
				var piece_nature = $('input[type=radio][name=tetramino]:checked').attr('class'); // get the selected tetramino nature (L, S, garbage, item...)
				var piece_orientation = $('input[type=radio][name=tetramino]:checked').attr('value'); // get the selected tetramino type (L flat, upside down, etc...)
				var is_active = $('#active').attr('checked');
				
				if(right_clicking) // right click -> remove blocks by dragging with a right click
				{
					D.Playfields[D.current_playfield].modify_set_piece(position,"inactive","_",piece_orientation); // replace with empty
				}
				else if(is_clicking) // left click
				{
					if(piece_nature == 'decoration') // decoration
					{
						var x_begin = clicked.indexOf('p');
						var y_begin = clicked.indexOf('x');

						var x = parseInt(clicked.substring(x_begin+1, y_begin));
						var y = parseInt(clicked.substring(y_begin+1));
						
						if(D.Playfields[D.current_playfield].lookup_decoration(clicked) && D.Playfields[D.current_playfield].lookup_decoration(clicked) == piece_orientation)
						{
						D.Playfields[D.current_playfield].modify_decoration(x,y,"");						
						}
						else{
						D.Playfields[D.current_playfield].modify_decoration(x,y,piece_orientation);						
						}
					}
					else  
					{
						if(is_active) //do we work on the active layer ?
						{
							D.Playfields[D.current_playfield].modify_set_piece(position,"active",piece_nature,piece_orientation);
						}
						else // else we work on the inactive
						{
							// does the click remove the block ? (-> if it's not empty & if it's the same piece nature)
							if (D.Playfields[D.current_playfield].lookup_block(position) != "_" && D.Playfields[D.current_playfield].lookup_block(clicked) == piece_nature) 
							{
								D.Playfields[D.current_playfield].modify_set_piece(position,"inactive","_",piece_orientation);
							}
							else // else we add something
							{
								D.Playfields[D.current_playfield].modify_set_piece(position,"inactive",piece_nature,piece_orientation);
							}
						}						
					}
				}
				else // hover enter: add preview
				{
					D.Playfields[D.current_playfield].modify_set_piece($(this).attr("id"),"addpreview",piece_nature,piece_orientation,is_active); // add preview
				}           
			},                       
			function()
			{          
				// hover quit: remove preview
				var piece_nature = $('input[type=radio][name=tetramino]:checked').attr('class'); // get the selected tetramino nature (L, S, garbage, item...)
				var piece_orientation = $('input[type=radio][name=tetramino]:checked').attr('value'); // get the selected tetramino type (L flat, upside down, etc...)
				var is_active = $('#active').attr('checked');
				D.Playfields[D.current_playfield].modify_set_piece($(this).attr("id"),"removepreview",piece_nature,piece_orientation,is_active); // remove preview
			}    
			);
                	
			var rect_x_start, rect_x_end, rect_y_start,rect_y_end;
			var have_coord;
                	
			$('#diagram td').mousedown(function(){
					var clicked = $(this).attr("id");
					var piece_nature = $('input[type=radio][name=tetramino]:checked').attr('class'); // get the selected tetramino nature (L, S, garbage, item...)
					var piece_orientation = $('input[type=radio][name=tetramino]:checked').attr('value'); // get the selected tetramino type (L flat, upside down, etc...)
					var is_active = $('#active').attr('checked');
					var is_rectangle_mode = $('#rectangular-fill').attr('checked');
					var is_recursive_fill_mode = $('#recursive-fill').attr('checked');
					var is_advancing = $('#advance').attr('checked');
					var is_painting = $('#paintactive').attr('checked');                                                                    
					
					
					if(piece_nature == 'decoration') // decoration
					{
						var x_begin = clicked.indexOf('p');
						var y_begin = clicked.indexOf('x');

						var x = parseInt(clicked.substring(x_begin+1, y_begin));
						var y = parseInt(clicked.substring(y_begin+1));
						
						if(D.Playfields[D.current_playfield].lookup_decoration(clicked) && D.Playfields[D.current_playfield].lookup_decoration(clicked) == piece_orientation)
						{
						D.Playfields[D.current_playfield].modify_decoration(x,y,"");						
						}
						else{
						D.Playfields[D.current_playfield].modify_decoration(x,y,piece_orientation);						
						}
						
					}                                                                             
					
					else if(is_rectangle_mode) // rectangular fill
					{
						if(have_coord)
						{                                                                      
							$('#p'+rect_x_start+'x'+rect_y_start).css('background-color','');
							rect_x_end = clicked.slice(1,clicked.indexOf("x"));	
							rect_y_end = clicked.slice(clicked.indexOf("x")+1);
							D.Playfields[D.current_playfield].rectangular_fill(rect_x_start,rect_y_start,rect_x_end, rect_y_end,piece_nature);	
							have_coord = false;
							$('#rectangular-fill').removeAttr('checked');					
						}
						else
						{
							rect_x_start = clicked.slice(1,clicked.indexOf("x"));	
							rect_y_start = clicked.slice(clicked.indexOf("x")+1);    					
							have_coord = true;
							$('#'+clicked).css('background-color','green');
						}
					}
					else if(is_recursive_fill_mode) // recursive fill
					{
						var x_location = clicked.slice(1,clicked.indexOf("x"));	
						var y_location = clicked.slice(clicked.indexOf("x")+1);
						D.Playfields[D.current_playfield].recursive_fill(x_location, y_location, D.Playfields[D.current_playfield].lookup_block(clicked), piece_nature);
					}
					else // normal click
					{
						
						if(is_active) //do we work on the active layer ?
						{
							D.Playfields[D.current_playfield].modify_set_piece(clicked,"active",piece_nature,piece_orientation);
						}
						else // else we work on the inactive
						{
							// does the click remove the block ? (-> if it's not empty & if it's the same piece nature)
							if (D.Playfields[D.current_playfield].lookup_block(clicked) != "_" && D.Playfields[D.current_playfield].lookup_block(clicked) == piece_nature) 
							{
								D.Playfields[D.current_playfield].modify_set_piece(clicked,"inactive","_",piece_orientation);
							}
							else // else we add something
							{
								D.Playfields[D.current_playfield].modify_set_piece(clicked,"inactive",piece_nature,piece_orientation);

							}
						}						
					}
					// TODO: pf_modifly(clicked, "highlight");
					if(is_painting){
						D.Playfields[D.current_playfield].paint_active();
						D.Playfields[D.current_playfield].draw();
					}

					if(is_advancing)
					{
							D.new_copy_playfield();
					}    
			} );
                	/*
			$('#diagram td').rightMouseDown(function(){
					var clicked = $(this).attr("id");
					var piece_nature = "_";
					var piece_orientation = $('input[type=radio][name=tetramino]:checked').attr('value'); // get the selected tetramino type (L flat, upside down, etc...)
					var is_active = $('#active').attr('checked');
					
					D.Playfields[D.current_playfield].modify_set_piece(clicked,"inactive",piece_nature,piece_orientation);
					right_clicking = 1;                 
			} );		*/
		
		/*------------------------ Checkbox control --------------- */  

			var $activecheckbox = $('#active');
			var $recursivefill = $('#recursive-fill');
			var $rectangularfill = $('#rectangular-fill');

			$activecheckbox.click(function(){
					$recursivefill.removeAttr('disabled','');
					$rectangularfill.removeAttr('disabled','');
					if($activecheckbox.attr('checked'))
					{
					$recursivefill.attr('disabled','disabled');
					$rectangularfill.attr('disabled','disabled');
					}
			})
		
		/*------------------------ Button control ------------------ */  
			$('#com').change(function(){
					D.Playfields[D.current_playfield].save_comment();
			})
			/* Right panel */
				/* Properties*/
					$('#stackborder').change(function(){
                				
								if($('#stackborder:checked').val())
								{
								D.Playfields[D.current_playfield].stackborder_status = 1;				
								}
								else{
								D.Playfields[D.current_playfield].stackborder_status = 0;									
								}
								D.Playfields[D.current_playfield].draw_stackborder(D.Playfields[D.current_playfield].stackborder_status);
					})		
					$('.size-change','#properties').change(function(){
							if($('#size-all:checked').val())
							{
								D.Playfields[D.current_playfield].change_size($('#width').val(),$('#height').val());					
							}
							for(var i=0 ; i < D.Playfields.length;i++)
							{
							D.Playfields[i].change_size($('#width').val(),$('#height').val());					
							}
							D.Playfields[D.current_playfield].change_size_display();
					})		   			
					$('#size-change-reset').click(function(){                          
							defaultwidth = 10;
							defaultheight = 20;
							for(var i=0 ; i < D.Playfields.length;i++)
							{
							D.Playfields[i].change_size(10,20);					
							}
							D.Playfields[D.current_playfield].change_size_display();					
					})	
					$('#cmd_size_default').click(function(){
							defaultwidth = $('#width').val();
							defaultheight = $('#height').val();
					})					
					$("#cmd_spawn").click(function(){
							var piece_nature = $('input[type=radio][name=tetramino]:checked').attr('class')
							D.Playfields[D.current_playfield].Tetrion_History_Save();
							D.Playfields[D.current_playfield].spawn_piece(piece_nature);
					
					})		
					$("#cmd_hold").click(function(){
							D.Playfields[D.current_playfield].Tetrion_History_Save();
							D.Playfields[D.current_playfield].switchhold();
					})	
					$("#cmd_advance_next").click(function(){
							D.Playfields[D.current_playfield].advance_next();
					})
					$('#border_color').change(function(){
							if($('#border_all:checked').val())
							{
								D.set_border_to_all($('#border_color').val());
							}
							else
							{
								D.Playfields[D.current_playfield].modify_border($('#border_color').val());
							}
					})
					$('#cmd_border_default').click(function(){
								D.set_default_border($('#border_color').val());
					})
					$('#cmd_border_reset').click(function(){
							if($('#border_all:checked').val())
							{
								D.set_border_to_all($(''));
							}
							else
							{
								D.Playfields[D.current_playfield].modify_border('');
							}					
					})
					$('#hold').change(function(){
							D.Playfields[D.current_playfield].modify_hold($('#hold').val());
					})
					$('#next1').change(function(){
							D.Playfields[D.current_playfield].modify_next1($('#next1').val());
					})
					$('#next2').change(function(){
							D.Playfields[D.current_playfield].modify_next2($('#next2').val());
					})
					$('#next3').change(function(){
							D.Playfields[D.current_playfield].modify_next3($('#next3').val());
					})
				
				/* Frame manipulation */
					$("#cmd_new").click(function(){
							D.new_playfield();
					})
					$("#cmd_next").click(function(){
							if(D.current_playfield == D.Playfields.length-1) 
							{
							D.new_copy_playfield();
							}
							else
							{
							D.next_playfield();
							}
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
					$("#cmd_new_copy").click(function(){
							D.new_copy_playfield();
					})
					$("#cmd_del").click(function(){
							D.remove_current_playfield();
					})
					$("#cmd_del_follow").click(function(){
							var agree = confirm("This will remove every frame after the current one. \n Are you sure ?");
							if (agree)
							{
								D.remove_following_playfields();
							}
					})
					$("#cmd_del_all").click(function(){
						var agree = confirm("This will nuke everything ! \n Are you sure ?");
						if (agree)
						{
							D.remove_all_playfields();
						}
					})
                		/* Active manipulation*/
                	
					$("#cmd_up").click(function(){
							D.Playfields[D.current_playfield].Tetrion_History_Save();
							D.Playfields[D.current_playfield].move_piece('up');
					})
					$("#cmd_down").click(function(){
							D.Playfields[D.current_playfield].Tetrion_History_Save();
							D.Playfields[D.current_playfield].move_piece('down');
					})
					$("#cmd_left").click(function(){
							D.Playfields[D.current_playfield].Tetrion_History_Save();
							D.Playfields[D.current_playfield].move_piece('left');
					})
					$("#cmd_right").click(function(){
							D.Playfields[D.current_playfield].Tetrion_History_Save();
							D.Playfields[D.current_playfield].move_piece('right');
					})
					$("#cmd_cw").click(function(){
							D.Playfields[D.current_playfield].Tetrion_History_Save();
							D.Playfields[D.current_playfield].move_piece('cw');
					})
					$("#cmd_ccw").click(function(){
							D.Playfields[D.current_playfield].Tetrion_History_Save();
							D.Playfields[D.current_playfield].move_piece('ccw');
					})
					$("#cmd_recall").click(function(){
							D.Playfields[D.current_playfield].Tetrion_History_Recall();
					})
					$("#cmd_clearactive").click(function(){
							D.Playfields[D.current_playfield].Tetrion_History_Save();
							D.Playfields[D.current_playfield].rebootActive();
					})
					$("#cmd_paintactive").click(function(){
							D.Playfields[D.current_playfield].Tetrion_History_Save();
							D.Playfields[D.current_playfield].paint_active();
					})		
					$("#cmd_lockactive").click(function(){
							D.Playfields[D.current_playfield].Tetrion_History_Save();
							D.Playfields[D.current_playfield].lock_active();
					})		
					$("#cmd_dropactive").click(function(){
							D.Playfields[D.current_playfield].Tetrion_History_Save();
							D.Playfields[D.current_playfield].drop_active_piece();
					})						
				/* Field manipulation */
					$("#cmd_line_clear").click(function(){
							D.Playfields[D.current_playfield].Tetrion_History_Save();
							D.Playfields[D.current_playfield].line_clear();
					})
					$("#cmd_shift_field_up").click(function(){
							D.Playfields[D.current_playfield].Tetrion_History_Save();
							D.Playfields[D.current_playfield].shift_field('up');
					})
					$("#cmd_shift_field_down").click(function(){
							D.Playfields[D.current_playfield].Tetrion_History_Save();
							D.Playfields[D.current_playfield].shift_field('down');
					})
					$("#cmd_shift_field_left").click(function(){
							D.Playfields[D.current_playfield].Tetrion_History_Save();
							D.Playfields[D.current_playfield].shift_field('left');
					})
					$("#cmd_shift_field_right").click(function(){
							D.Playfields[D.current_playfield].Tetrion_History_Save();
							D.Playfields[D.current_playfield].shift_field('right');
					})
					$("#cmd_clear_field").click(function(){
							D.Playfields[D.current_playfield].Tetrion_History_Save();
							D.Playfields[D.current_playfield].rebootPlayfield();
							D.Playfields[D.current_playfield].draw();
                			
					})
					$('#system').change(function(){
							var new_system = $('#system').val();
							if($('#system_all:checked').val())
							{
								D.set_system_to_all(new_system);
							}
							else
							{
								D.Playfields[D.current_playfield].modify_system(new_system);						
							}
					})
					$('#system-change-default').click(function(){
							var new_system = $('#system').val();
							D.set_default_system(new_system);
					})
			
			

		/*------------------------ Keyboard control ------------------ */
			
			var kb_modifier;
			var kb_up; 
			var kb_left; 
			var kb_righ;
			var kb_down;
			var kb_ccw;
			var kb_cw; 
			var kb_del; 
			var kb_new;
			var kb_previous;
			var kb_next;
			var kb_modifier;
			var kb_paint;
			var kb_lock;
			var kb_1;		
			var kb_2;		
			var kb_3;		
			var kb_4;		
			var kb_5;		
			var kb_6;		
			var kb_7;		
			var kb_8;		
			
			function kb_default(){
				kb_modifier = 16; //shift
				kb_up = 87; // w
				kb_left = 65; // a
				kb_right = 68; // d
				kb_down = 83; // s
				kb_ccw = 72; // h
				kb_cw = 71; // g
				kb_del = 79; // o                                                                                                                                        
				kb_new = 38; // â†‘
				kb_previous = 37; // â†
				kb_next =  39; // â†’
				kb_modifier = 16; //shift
				kb_paint = 75 ;// k			
				kb_browse_next = 73 ;// i			
				kb_browse_previous = 85 ;// u			
        	
				kb_1 = 49; //1
				kb_2 = 50; //2
				kb_3 = 51; //3
				kb_4 = 52; //4
				kb_5 = 53; //5
				kb_6 = 54; //6
				kb_7 = 55; //7
				kb_8 = 56; //8
        	
				
				$('#kb_modifier').val(kb_modifier); 
				$('#kb_up').val(kb_up); 
				$('#kb_left').val(kb_left); 
				$('#kb_right').val(kb_right);
				$('#kb_down').val(kb_down);
				$('#kb_ccw').val(kb_ccw);                                                                                                                           
				$('#kb_cw').val(kb_cw);                                                                                                                              
				$('#kb_del').val(kb_del);
				$('#kb_new').val(kb_new);
				$('#kb_previous').val(kb_previous);
				$('#kb_next').val(kb_next);		
				$('#kb_paint').val(kb_paint);   
				$('#kb_browse_next').val(kb_browse_next);	
				$('#kb_browse_previous').val(kb_browse_previous); 
				$('kb_1').val(kb_1);
				$('kb_2').val(kb_2);
				$('kb_3').val(kb_3);
				$('kb_4').val(kb_4);
				$('kb_5').val(kb_5);
				$('kb_6').val(kb_6);
				$('kb_7').val(kb_7);
				$('kb_8').val(kb_8);
   			}	          
		
			kb_default();
			/* Cookies */
			if(readCookie('kb_modifier'))
			{
				kb_modifier = readCookie('kb_modifier');		
			}
			$('#kb_modifier').val(kb_modifier); 
			
			if(readCookie('kb_up'))
			{
				kb_up = readCookie('kb_up');
			}
			$('#kb_up').val(kb_up); 
			
			if(readCookie('kb_left'))
			{
				kb_left = readCookie('kb_left');		
			}
			$('#kb_left').val(kb_left); 
			
			if(readCookie('kb_right'))
			{
				kb_right = readCookie('kb_right');
			}
			$('#kb_right').val(kb_right);
			
			if(readCookie('kb_down'))
			{
				kb_down = readCookie('kb_down');
			}
			$('#kb_down').val(kb_down);
			
			if(readCookie('kb_ccw'))
			{
				kb_ccw = readCookie('kb_ccw');                                                                                                                                   
			}
			$('#kb_ccw').val(kb_ccw);
			
			if(readCookie('kb_cw'))
			{
				kb_cw = readCookie('kb_cw');		
			}
			$('#kb_cw').val(kb_cw);
			
			if(readCookie('kb_del'))
			{
				kb_del = readCookie('kb_del')
			}
			$('#kb_del').val(kb_del);
			
			if(readCookie('kb_new'))
			{
				kb_new = readCookie('kb_new');
			}
			$('#kb_new').val(kb_new);
			
			if(readCookie('kb_previous'))
			{
				kb_previous = readCookie('kb_previous');
			}
			$('#kb_previous').val(kb_previous);
			
			if(readCookie('kb_next'))
			{
				kb_next = readCookie('kb_next');
			}
			$('#kb_next').val(kb_next);   
        	
			if(readCookie('kb_paint'))
			{
				kb_paint = readCookie('kb_paint');
			}
			$('#kb_paint').val(kb_paint);   
        	
			if(readCookie('kb_browse_next'))
			{
				kb_browse_next = readCookie('kb_browse_next');
			}
			$('#kb_browse_next').val(kb_browse_next); 
        	
			if(readCookie('kb_browse_previous'))
			{
				kb_browse_previous = readCookie('kb_browse_previous');
			}
			$('#kb_browse_previous').val(kb_browse_previous); 
        	
			if(readCookie('kb_1'))
			{
				kb_browse_previous = readCookie('kb_1');
			}
			$('#kb_1').val(kb_1); 
			
			if(readCookie('kb_2'))
			{
				kb_browse_previous = readCookie('kb_2');
			}
			$('#kb_2').val(kb_2); 
			if(readCookie('kb_3'))
			{
				kb_browse_previous = readCookie('kb_3');
			}
			$('#kb_3').val(kb_3); 
			if(readCookie('kb_4'))
			{
				kb_browse_previous = readCookie('kb_4');
			}
			$('#kb_4').val(kb_4); 
			if(readCookie('kb_5'))
			{
				kb_browse_previous = readCookie('kb_5');
			}
			$('#kb_5').val(kb_5); 
			if(readCookie('kb_6'))
			{
				kb_browse_previous = readCookie('kb_6');
			}
			$('#kb_6').val(kb_6); 
			if(readCookie('kb_7'))
			{
				kb_browse_previous = readCookie('kb_7');
			}
			$('#kb_7').val(kb_7); 
			if(readCookie('kb_8'))
			{
				kb_browse_previous = readCookie('kb_8');
			}
			$('#kb_8').val(kb_8); 
        	
			$('#kb_modifier').change(function(){ kb_up = $('#kb_modifier').val();});		
			$('#kb_up').change(function(){ kb_up = $('#kb_up').val();});
			$('#kb_down').change(function(){ kb_down = $('#kb_down').val();});
			$('#kb_left').change(function(){ kb_left = $('#kb_left').val();});
			$('#kb_right').change(function(){ kb_right = $('#kb_right').val();});
			$('#kb_cw').change(function(){ kb_cw = $('#kb_cw').val();});
			$('#kb_ccw').change(function(){ kb_ccw = $('#kb_ccw').val();});
			$('#kb_del').change(function(){ kb_del = $('#kb_del').val();});
			$('#kb_new').change(function(){ kb_new = $('#kb_new').val();});	
			$('#kb_previous').change(function(){ kb_previous = $('#kb_previous').val();});	
			$('#kb_next').change(function(){ kb_next = $('#kb_next').val();});		
			$('#kb_paint').change(function(){ kb_paint = $('#kb_paint').val();});		
			$('#kb_browse_previous').change(function(){ kb_browse_previous = $('#kb_browse_previous').val();});	
			$('#kb_browse_next').change(function(){ kb_browse_next = $('#kb_browse_next').val();});		
			$('#kb_1').change(function(){ kb_new = $('#kb_1').val();});	
			$('#kb_2').change(function(){ kb_new = $('#kb_2').val();});	
			$('#kb_3').change(function(){ kb_new = $('#kb_3').val();});	
			$('#kb_4').change(function(){ kb_new = $('#kb_4').val();});	
			$('#kb_5').change(function(){ kb_new = $('#kb_5').val();});	
			$('#kb_6').change(function(){ kb_new = $('#kb_6').val();});	
			$('#kb_7').change(function(){ kb_new = $('#kb_7').val();});	
			$('#kb_8').change(function(){ kb_new = $('#kb_8').val();});	
			                                     
			
			
			// major keyboard handler. If you want to bind key to function, do it here !
			$(window).keydown(function(event){
					var ismodifier;
					if(kb_modifier == 16 || kb_modifier == 17 ||kb_modifier == 18)
					{
						if(event.shiftKey)
						{
						ismodifier = true;	
						}
        	
						if(event.ctrlKey)
						{
						ismodifier = true;	
						}
        	
						if(event.alttKey)
						{
						ismodifier = true;	
						}
						
					}
					if ($('#kb-control-status:checked').val() != null)
					{
						if(ismodifier) // if ismodifier is true, user has inputted modifier+key (e.g. shift+w)
						{
							// I'd like to use a switch but I don't know how to make a dynamic switch (and everybody says eval is evil)						     
							if(event.keyCode == kb_up)
							{
								D.Playfields[D.current_playfield].Tetrion_History_Save();
								D.Playfields[D.current_playfield].shift_field('up');					
							}
							if(event.keyCode == kb_left)
							{
								D.Playfields[D.current_playfield].Tetrion_History_Save();
								D.Playfields[D.current_playfield].shift_field('left');					
							}
							if(event.keyCode == kb_right)
							{
								D.Playfields[D.current_playfield].Tetrion_History_Save();
								D.Playfields[D.current_playfield].shift_field('right');					
							}
							if(event.keyCode == kb_down)
							{
								D.Playfields[D.current_playfield].Tetrion_History_Save();
								D.Playfields[D.current_playfield].shift_field('down');					
							}
							if(event.keyCode == kb_new)
							{
								D.new_copy_playfield();
							}		
							if(event.keyCode == kb_del)
							{
								D.remove_following_playfields();
							}		
							if(event.keyCode == kb_previous)
							{
								D.first_playfield();
							}
							if(event.keyCode == kb_next)
							{
								D.last_playfield();
							}
							if(event.keyCode == kb_paint)
							{
								D.Playfields[D.current_playfield].Tetrion_History_Save();
								D.Playfields[D.current_playfield].lock_active();					
							}						                      
						}						
						else
						{
							if(event.keyCode == kb_up)
							{
								D.Playfields[D.current_playfield].Tetrion_History_Save();
								D.Playfields[D.current_playfield].move_piece('up');					
							}
							if(event.keyCode == kb_left)
							{
								D.Playfields[D.current_playfield].Tetrion_History_Save();
								D.Playfields[D.current_playfield].move_piece('left');					
							}
							if(event.keyCode == kb_right)
							{
								D.Playfields[D.current_playfield].Tetrion_History_Save();
								D.Playfields[D.current_playfield].move_piece('right');					
							}
							if(event.keyCode == kb_down)
							{
								D.Playfields[D.current_playfield].Tetrion_History_Save();
								D.Playfields[D.current_playfield].move_piece('down');					
							}
							if(event.keyCode == kb_ccw)
							{
								D.Playfields[D.current_playfield].Tetrion_History_Save();
								D.Playfields[D.current_playfield].move_piece('ccw');					
							}
							if(event.keyCode == kb_cw)
							{
								D.Playfields[D.current_playfield].Tetrion_History_Save();
								D.Playfields[D.current_playfield].move_piece('cw');					
							}
							if(event.keyCode == kb_new)
							{                                                                                                                              
								D.new_playfield();
							}
							if(event.keyCode == kb_del)
							{
								D.remove_current_playfield();
							}			
							if(event.keyCode == kb_previous)
							{
								D.previous_playfield();
							}
							if(event.keyCode == kb_next)
							{
								if(D.current_playfield == D.Playfields.length-1)
								{
									D.new_copy_playfield();
								}
								else
								{
									D.next_playfield();
								}
							}
							if(event.keyCode == kb_paint)
							{
								D.Playfields[D.current_playfield].Tetrion_History_Save();
								D.Playfields[D.current_playfield].paint_active();					
							}	
							if(event.keyCode == kb_browse_previous)
							{
								browse_previous_piece();					
							}						
							if(event.keyCode == kb_browse_next)
							{
								browse_next_piece();												
							}
							if(event.keyCode == kb_1)
							{
								browse_row1_cycle();												
							}				
							if(event.keyCode == kb_2)
							{
								browse_row2_cycle();												
							}				
							if(event.keyCode == kb_3)
							{
								browse_row3_cycle();												
							}				
							if(event.keyCode == kb_4)
							{
								browse_row4_cycle();												
							}				
							if(event.keyCode == kb_5)
							{
								browse_row5_cycle();												
							}				
							if(event.keyCode == kb_6)
							{
								browse_row6_cycle();												
							}				
							if(event.keyCode == kb_7)
							{
								browse_row7_cycle();												
							}				
							if(event.keyCode == kb_8)
							{
								browse_row8_cycle();												
							}				
        	
        	
						}   
					}
			}); 
			$('#kb-control-save').click(function(){
					eraseCookie('kb_modifier'	 );  		                                                                                                                 
					eraseCookie('kb_up'      );
					eraseCookie('kb_up'      );
					eraseCookie('kb_down'    );
					eraseCookie('kb_left'    );
					eraseCookie('kb_right'   );
					eraseCookie('kb_cw'      );
					eraseCookie('kb_ccw'     );
					eraseCookie('kb_del'     );
					eraseCookie('kb_new'     );
					eraseCookie('kb_previous');
					eraseCookie('kb_next'	 );  		                                                                                                         
					eraseCookie('kb_browse_previous');
					eraseCookie('kb_browse_next'	 );  
					eraseCookie('kb_1'); 
					eraseCookie('kb_2'); 
					eraseCookie('kb_3'); 
					eraseCookie('kb_4'); 
					eraseCookie('kb_5'); 
					eraseCookie('kb_6'); 
					eraseCookie('kb_7'); 
					eraseCookie('kb_8'); 
					
					createCookie('kb_modifier'       , kb_modifier       );				
					createCookie('kb_up'       , kb_up       );
					createCookie('kb_down'     , kb_down     );
					createCookie('kb_left'     , kb_left     );
					createCookie('kb_right'    , kb_right    );
					createCookie('kb_cw'       , kb_cw       );
					createCookie('kb_ccw'      , kb_ccw      );
					createCookie('kb_del'      , kb_del      );
					createCookie('kb_new'      , kb_new      );
					createCookie('kb_previous' , kb_previous );
					createCookie('kb_next'	   , kb_next	 );
					createCookie('kb_browse_previous' , kb_browse_previous );
					createCookie('kb_browse_next'	   , kb_browse_next	 );
					createCookie('kb_1', kb_1);
					createCookie('kb_2', kb_2);
					createCookie('kb_3', kb_3);
					createCookie('kb_4', kb_4);
					createCookie('kb_5', kb_5);
					createCookie('kb_6', kb_6);
					createCookie('kb_7', kb_7);
					createCookie('kb_8', kb_8);
					createCookie('kb_1', kb_1);
					createCookie('kb_1', kb_1);
			});
			
			$('#kb-control-default').click(function(){
			kb_default();
			});
			
			
			$('#palette input[name="tetramino"]').click(function(){
			   if($(this).is(':checked')) 
			   {
			   	   //$(this).parent() select the td, to which we add a class
			   	   $('#palette input[name="tetramino"]').parent().removeClass("boxcheck");
			   	   $(this).parent().addClass("boxcheck");
        	
			   }
			});	
			
			var pieceIndex = 0;
			var pieceMax = $('input[name="tetramino"]').length;                        
			var currentrow = 9;
			var pieceIndexR = 0; // T 5
						// L 5
						// J 5
						// S 3
						// Z 3
						// I 3
						// O 2
						// G 1
        	
        	
			function browse_row1_cycle(){
				if(currentrow != 1)
				{
				currentrow = 1;
				pieceIndexR = 0;
				}
        	
				if(pieceIndexR < $('#pr1 input[name="tetramino"]').length)
				{
					$('#pr1 input[name="tetramino"]')[pieceIndexR].checked = true;
					$($('input[name="tetramino"]')).parent().removeClass("boxcheck");
					$($('#pr1 input[name="tetramino"]')[pieceIndexR]).parent().addClass("boxcheck");
					if($('#active').attr('checked'))
					{
					D.Playfields[D.current_playfield].spawn_piece($($('#pr1 input[name="tetramino"]')[pieceIndex]).attr('class'));
					}
					pieceIndexR++;                                     
				}
				else
				{
				pieceIndexR = 0;
					$('#pr1 input[name="tetramino"]')[pieceIndexR].checked = true;
					$($('input[name="tetramino"]')).parent().removeClass("boxcheck");
					$($('#pr1 input[name="tetramino"]')[pieceIndexR]).parent().addClass("boxcheck");
					if($('#active').attr('checked'))
					{
					D.Playfields[D.current_playfield].spawn_piece($($('#pr1 input[name="tetramino"]')[pieceIndex]).attr('class'));
					}
				}
			}		
        	
			function browse_row2_cycle(){
				if(currentrow != 2)
				{
				currentrow = 2;
				pieceIndexR = 0;
				}
        	
				if(pieceIndexR < $('#pr2 input[name="tetramino"]').length)
				{
					$('#pr2 input[name="tetramino"]')[pieceIndexR].checked = true;
					$($('input[name="tetramino"]')).parent().removeClass("boxcheck");
					$($('#pr2 input[name="tetramino"]')[pieceIndexR]).parent().addClass("boxcheck");
					if($('#active').attr('checked'))
					{
					D.Playfields[D.current_playfield].spawn_piece($($('#pr2 input[name="tetramino"]')[pieceIndex]).attr('class'));
					}
					pieceIndexR++;                                     
				}
				else
				{
				pieceIndexR = 0;
					$('#pr2 input[name="tetramino"]')[pieceIndexR].checked = true;
					$($('input[name="tetramino"]')).parent().removeClass("boxcheck");
					$($('#pr2 input[name="tetramino"]')[pieceIndexR]).parent().addClass("boxcheck");
					if($('#active').attr('checked'))
					{
					D.Playfields[D.current_playfield].spawn_piece($($('#pr2 input[name="tetramino"]')[pieceIndex]).attr('class'));
					}
				}
			}		
			function browse_row3_cycle(){
				if(currentrow != 3)
				{
				currentrow = 3;
				pieceIndexR = 0;
				}
        	
				if(pieceIndexR < $('#pr3 input[name="tetramino"]').length)
				{
					$('#pr3 input[name="tetramino"]')[pieceIndexR].checked = true;
					$($('input[name="tetramino"]')).parent().removeClass("boxcheck");
					$($('#pr3 input[name="tetramino"]')[pieceIndexR]).parent().addClass("boxcheck");
					if($('#active').attr('checked'))
					{
					D.Playfields[D.current_playfield].spawn_piece($($('#pr3 input[name="tetramino"]')[pieceIndex]).attr('class'));
					}
					pieceIndexR++;                                     
				}
				else
				{
				pieceIndexR = 0;
					$('#pr3 input[name="tetramino"]')[pieceIndexR].checked = true;
					$($('input[name="tetramino"]')).parent().removeClass("boxcheck");
					$($('#pr3 input[name="tetramino"]')[pieceIndexR]).parent().addClass("boxcheck");
					if($('#active').attr('checked'))
					{
					D.Playfields[D.current_playfield].spawn_piece($($('#pr3 input[name="tetramino"]')[pieceIndex]).attr('class'));
					}
				}
			}		
			function browse_row4_cycle(){
				if(currentrow != 4)
				{
				currentrow = 4;
				pieceIndexR = 0;
				}
        	
				if(pieceIndexR < $('#pr4 input[name="tetramino"]').length)
				{
					$('#pr4 input[name="tetramino"]')[pieceIndexR].checked = true;
					$($('input[name="tetramino"]')).parent().removeClass("boxcheck");
					$($('#pr4 input[name="tetramino"]')[pieceIndexR]).parent().addClass("boxcheck");
					if($('#active').attr('checked'))
					{
					D.Playfields[D.current_playfield].spawn_piece($($('#pr4 input[name="tetramino"]')[pieceIndex]).attr('class'));
					}
					pieceIndexR++;                                     
				}
				else
				{
				pieceIndexR = 0;
					$('#pr4 input[name="tetramino"]')[pieceIndexR].checked = true;
					$($('input[name="tetramino"]')).parent().removeClass("boxcheck");
					$($('#pr4 input[name="tetramino"]')[pieceIndexR]).parent().addClass("boxcheck");
					if($('#active').attr('checked'))
					{
					D.Playfields[D.current_playfield].spawn_piece($($('#pr4 input[name="tetramino"]')[pieceIndex]).attr('class'));
					}
				}
			}		
			function browse_row5_cycle(){
				if(currentrow != 5)
				{
				currentrow = 5;
				pieceIndexR = 0;
				}
        	
				if(pieceIndexR < $('#pr5 input[name="tetramino"]').length)
				{
					$('#pr5 input[name="tetramino"]')[pieceIndexR].checked = true;
					$($('input[name="tetramino"]')).parent().removeClass("boxcheck");
					$($('#pr5 input[name="tetramino"]')[pieceIndexR]).parent().addClass("boxcheck");
					if($('#active').attr('checked'))
					{
					D.Playfields[D.current_playfield].spawn_piece($($('#pr5 input[name="tetramino"]')[pieceIndex]).attr('class'));
					}
					pieceIndexR++;                                     
				}
				else
				{
				pieceIndexR = 0;
					$('#pr5 input[name="tetramino"]')[pieceIndexR].checked = true;
					$($('input[name="tetramino"]')).parent().removeClass("boxcheck");
					$($('#pr5 input[name="tetramino"]')[pieceIndexR]).parent().addClass("boxcheck");
					if($('#active').attr('checked'))
					{
					D.Playfields[D.current_playfield].spawn_piece($($('#pr5 input[name="tetramino"]')[pieceIndex]).attr('class'));
					}
				}
			}		
			function browse_row6_cycle(){
				if(currentrow != 6)
				{
				currentrow = 6;
				pieceIndexR = 0;
				}
        	
				if(pieceIndexR < $('#pr6 input[name="tetramino"]').length)
				{
					$('#pr6 input[name="tetramino"]')[pieceIndexR].checked = true;
					$($('input[name="tetramino"]')).parent().removeClass("boxcheck");
					$($('#pr6 input[name="tetramino"]')[pieceIndexR]).parent().addClass("boxcheck");
					if($('#active').attr('checked'))
					{
					D.Playfields[D.current_playfield].spawn_piece($($('#pr6 input[name="tetramino"]')[pieceIndex]).attr('class'));
					}
					pieceIndexR++;                                     
				}
				else
				{
				pieceIndexR = 0;
					$('#pr6 input[name="tetramino"]')[pieceIndexR].checked = true;
					$($('input[name="tetramino"]')).parent().removeClass("boxcheck");
					$($('#pr6 input[name="tetramino"]')[pieceIndexR]).parent().addClass("boxcheck");
					if($('#active').attr('checked'))
					{
					D.Playfields[D.current_playfield].spawn_piece($($('#pr6 input[name="tetramino"]')[pieceIndex]).attr('class'));
					}
				}
			}		
			function browse_row7_cycle(){
				if(currentrow != 7)
				{
				currentrow = 7;
				pieceIndexR = 0;
				}
        	
				if(pieceIndexR < $('#pr7 input[name="tetramino"]').length)
				{
					$('#pr7 input[name="tetramino"]')[pieceIndexR].checked = true;
					$($('input[name="tetramino"]')).parent().removeClass("boxcheck");
					$($('#pr7 input[name="tetramino"]')[pieceIndexR]).parent().addClass("boxcheck");
					if($('#active').attr('checked'))
					{
					D.Playfields[D.current_playfield].spawn_piece($($('#pr7 input[name="tetramino"]')[pieceIndex]).attr('class'));
					}
					pieceIndexR++;                                     
				}
				else
				{
				pieceIndexR = 0;
					$('#pr7 input[name="tetramino"]')[pieceIndexR].checked = true;
					$($('input[name="tetramino"]')).parent().removeClass("boxcheck");
					$($('#pr7 input[name="tetramino"]')[pieceIndexR]).parent().addClass("boxcheck");
					if($('#active').attr('checked'))
					{
					D.Playfields[D.current_playfield].spawn_piece($($('#pr7 input[name="tetramino"]')[pieceIndex]).attr('class'));
					}
				}
			}		
			function browse_row8_cycle(){
				if(currentrow != 8)
				{
				currentrow = 8;
				pieceIndexR = 0;
				}
        	
				if(pieceIndexR < $('#pr8 input[name="tetramino"]').length)
				{
					$('#pr8 input[name="tetramino"]')[pieceIndexR].checked = true;
					$($('input[name="tetramino"]')).parent().removeClass("boxcheck");
					$($('#pr8 input[name="tetramino"]')[pieceIndexR]).parent().addClass("boxcheck");
					if($('#active').attr('checked'))
					{
					D.Playfields[D.current_playfield].spawn_piece($($('#pr8 input[name="tetramino"]')[pieceIndex]).attr('class'));
					}
					pieceIndexR++;                                     
				}
				else
				{
				pieceIndexR = 0;
					$('#pr8 input[name="tetramino"]')[pieceIndexR].checked = true;
					$($('input[name="tetramino"]')).parent().removeClass("boxcheck");
					$($('#pr8 input[name="tetramino"]')[pieceIndexR]).parent().addClass("boxcheck");
					if($('#active').attr('checked'))
					{
					D.Playfields[D.current_playfield].spawn_piece($($('#pr8 input[name="tetramino"]')[pieceIndex]).attr('class'));
					}
				}
			}		
			
			function browse_next_piece(){
			
				if(pieceIndex < pieceMax)
				{
					pieceIndex++;                                     
					$('input[name="tetramino"]')[pieceIndex].checked = true;
					$('input[name="tetramino"]').parent().removeClass("boxcheck");
					$($('input[name="tetramino"]')[pieceIndex]).parent().addClass("boxcheck");
					if($('#active').attr('checked'))
					{
					D.Playfields[D.current_playfield].spawn_piece($($('input[name="tetramino"]')[pieceIndex]).attr('class'));
					}
				}
				else
				{
				pieceIndex = 0;
				}
			
			}
        	
			function browse_previous_piece(){
        	
			
				if(pieceIndex > 0)
				{
					pieceIndex--;
					$('input[name="tetramino"]')[pieceIndex].checked = true;
					$('input[name="tetramino"]').parent().removeClass("boxcheck");
					$($('input[name="tetramino"]')[pieceIndex]).parent().addClass("boxcheck");
					if($('#active').attr('checked'))
					{
					D.Playfields[D.current_playfield].spawn_piece($($('input[name="tetramino"]')[pieceIndex]).attr('class'));
					}
					
				}
				else
				{
				pieceIndex = pieceMax;
				}
			
			}

		
		
		
});

// cookies function from http://www.quirksmode.org/js/cookies.html

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
                   
function eraseCookie(name) {
	createCookie(name,"",-1);
}


