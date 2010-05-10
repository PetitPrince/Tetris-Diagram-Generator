/*
TeDiGe uses an array to store information about playfield state (each case would
be a independant state of the game) in an conveniently sized multidimensional
array containing symbols that represents the current type of bloc.

The symbol encoding is nearly compatible with tetriswiki's
<playfield> notation (see http://www.tetrisconcept.net/wiki/Help:Playfield):

_ 	  	Empty Cell
Z 	  	Red Block (Z Tetromino)
L 		Orange Block (L Tetromino)
O 		Yellow Block (O Tetromino)
S 		Green Block (S Tetromino)
I 		Cyan Block (I Tetromino)
J 		Blue Block (J Tetromino)
T 		Purple Block (T Tetromino)
G 		Gray Block (Garbage or playfield wall)
- 		Ghost piece or Line clear
C 		Rotation center of a piece, a bomb in Bombliss, or any other specially marked block
P 		Purple block for the T Tetromino, designed for use in documenting T-Spin setups
B 		Mark a cell that has to be occupied for something (like a wallkick) to happen
X 		Mark a cell that cannot be occupied for something (like a wallkick) to happen
1–9 		Mark the cells that reject a given kick position

Note that for obvious CSS reasons, . (dot) was remplaced by _ (underscore).
*/


$(document).ready(function(){

		var is_clicking = 0;
		var right_clicking = 0;
		var left_remove = 0;
		var defaultsystem = "ARS";
		var defaultborder = "Gray";
		

		
		
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
				

				// technicly speaking, we shouldn't refer to this.Playfields[0] and directly use a blank state
				// because the "viewer" mode
				// these are the hold and next pieces
				drawnTetrion += '<div id="top-box">';
				drawnTetrion += '<img id="holdbox"  src="" />';
				drawnTetrion += '<img id="next1box" src="" />';
				drawnTetrion += '<img id="next2box" src="" />';
				drawnTetrion += '<img id="next3box" src="" />';
				drawnTetrion += '</div>';
				drawnTetrion += '<table id="diagram"> \n';
				
				
				for(var j=0; j<this.Playfields[0].pf_height;j++)
				{
					drawnTetrion += '<tr>';
					for(var i=0; i<this.Playfields[0].pf_width;i++)
					{
						
							drawnTetrion += '<td id="p' + i + 'x' + j + '" class=""><div class="prev"></div></td>';
						
						// classes are p<value> and not just <value> because CSS doesn't support
						// classes that begins with a number (theorically yes, but then you'll
						// have to convert the first number into a utf-8 number)...
					}
					drawnTetrion += '</tr> \n';
				}
				drawnTetrion += '</table> \n';
				$("#seed").prepend(drawnTetrion);
			}

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
			}

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

					$("#border_color").val(D.Playfields[D.current_playfield].border_color); // sets selected border color to current
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

			this.set_system_to_all = function(newsystem){
			
				for(var i=0;i<this.Playfields.length;i++)
				{
					this.Playfields[i].system = newsystem;				
				}
			}

			this.set_default_system = function(newsystem){
			
				defaultsystem = newsystem;
			}

			this.set_border_to_all = function(newborder){
			
				for(var i=0;i<this.Playfields.length;i++)
				{
					this.Playfields[i].border = newborder;				
				}
			}

			this.set_default_border = function(newborder){
			
				defaultborder = newborder;
			}
			
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
			this.export_all_to_tw = function (){
				/**
				* Generates a tetris wiki-compliant string of all playfield arrays.
				*/
				var code="";

				if ($('#slidagram:checked').val() != null)
					code += '&#060;slide>\n';

				for (var playfield = 0; playfield < this.Playfields.length; playfield++) {
					code += '&#060;diagram';

					// border color
					if (this.Playfields[playfield].border_color != "")
						code += ' border=' + this.Playfields[playfield].border_color;

					// width other than 10
					if (parseInt($('#width').val()) != 10)
						code += ' width=' + parseInt($('#width').val());

					// system
					if (this.Playfields[playfield].system != "")
						code += ' system=' + this.Playfields[playfield].system;

					// hold
					if (this.Playfields[playfield].hold != "")
						code += ' hold=' + this.Playfields[playfield].hold;

					// next
					if (this.Playfields[playfield].next1 != "" || this.Playfields[playfield].next2 != "" || this.Playfields[playfield].next3 != "") {
						code += ' next=';

						if(this.Playfields[playfield].next1 != "")
							code += this.Playfields[playfield].next1 + ',';
						else
							code += ',';

						if(this.Playfields[playfield].next2 != "")
							code += this.Playfields[playfield].next2;

						if(this.Playfields[playfield].next3 != "")
							code += ',' + this.Playfields[playfield].next3;
					}

					code += '>\n';

					for(var j=0; j<this.Playfields[playfield].pf_height;j++)
					{
						for(var i=0; i<this.Playfields[playfield].pf_width;i++)
						{
							if(this.Playfields[playfield].Tetrion[i][j]['content_active'])
							{
								code+= "|" + this.Playfields[playfield].Tetrion[i][j]['content_active'];
							}
							else
							{
								if(this.Playfields[playfield].Tetrion[i][j]["content"] == "_")
								{
									code += "| ";
								}
								else
								{
									code += "|" + this.Playfields[playfield].Tetrion[i][j]["content"];
								}
							}
						}
						code += '|\n';
					}

					code += '&#060;/diagram>';

					if($('#com').val() != "")
						code += '\n' + $('#com').val();

					if ($('#slidagram:checked').val() != null && playfield != this.Playfields.length-1)
						code += '&#060;sep>\n';
				}

				if ($('#slidagram:checked').val() != null)
					code += '\n&#060;/slide>';

				$('#export').html(code);
				$('#console-description').html("copy and paste into tetriswiki");
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
				$("#export").html(output+"#"+this.print());
			}


		}

		/* ------------------------------------------------------------- */

		function Playfield(){
			/**
			* Playfield: an object that stores a single state of the game
			* It two arrays      : - one for the pieces, that has three layers:
			*							- the inactive layer (unmoveable blocks). Data is stored as a simple character
			*							- the active layer (blocks that players can move). Data is stored as a simple character
			*							- the active center (so one can rotate). Data is stored as 1 character for the piece nature and 1-3 character for the orientation
			*						- one for the mouseover preview
			*/

			this.pf_width = 10; //default values
			this.pf_height = 20; //default values
			this.comment ="";
			this.Tetrion = new Array();
			this.Tetrion_Preview = new Array();
			this.system;
			this.whiteborder;

			this.border_color;
			this.hold = "";
			this.next1 = "";
			this.next2 = "";
			this.next3 = "";


			this.change_size = function(newwidth,newheight){

				/* $('diagram').html(newShinyPlayfield) won't work because 
				Jquery doesn't bind to newly created elements.
				I *don't* want to rewrite 90% of my code to implement
				livequery */

			}
			
			this.Tetrion_History;
			this.Tetrion_History_Save = function (){
				/**
				* Stores the last frame in memory
				*/
				Tetrion_History = this.print();
			}
			this.Tetrion_History_Recall = function (){
				/**
				* Load the last frame in memory
				*/
				this.load_pf(Tetrion_History);
			}

			this.init=function(){
				/**
				* Initializes the playfield and fills it with "_" (empty space).
				* Also initializes others variable
				*/
				// this.pf_width = parseInt($('#width').val());
				// this.pf_height = parseInt($('#height').val());
				this.system = defaultsystem; 
				$('#system').val(defaultsystem); // this is for loading purpose

				for(var i=0;i<this.pf_width;i++)
				{
					this.Tetrion.push(new Array(this.pf_height))

					for(var j=0;j<this.pf_height;j++)
					{
						/* Tetrion store all the necessary information: content stores what type of piece is at (i,j)
						content_active stores the same but for the activer layer and finally
						active_center store the center of the active piece*/
						this.Tetrion[i][j] = new Array();
						this.Tetrion[i][j]['content']="_";
						this.Tetrion[i][j]['content_active']="";
						this.Tetrion[i][j]['center_active']="";
					}
				}


			}

			this.modify=function(x,y,value){
				/**
				*	Modifies the type of a single inactive cell in the array at the selected point.
				*	Also calls an update of the display.
				*/

				this.Tetrion[x][y]["content"]=value;
				$('#p'+x+'x'+y).removeClass();
				if(value == "_")
				{
					if(this.Tetrion[x][y]['content_active'])
						{}
					else
					{
						$('#p'+x+'x'+y).css('background-image', 'url(\'img/blocks/' + this.system + '/' + this.system + value + 'Tet.png\')');
					}
				}
				else
				{
					if(this.Tetrion[x][y]['content_active'])
						{}
					else
					{
						$('#p'+x+'x'+y).addClass('inactive');
						$('#p'+x+'x'+y).css('background-image', 'url(\'img/blocks/' + this.system + '/' + this.system + value + 'Tet.png\')');
					}
				}
				
			}

			this.modify_active=function(x,y,value){
				/**
				*	Modifies the type of a single active cell in the array at the selected point.
				*	Also calls an update of the display.
				*/

				this.Tetrion[x][y]['content_active']=value;
				$('#p'+x+'x'+y).removeClass();
				if(value)
				{
					$('#p'+x+'x'+y).css('background-image', 'url(\'img/blocks/' + this.system + '/' + this.system + value + 'Tet.png\')');
					$('#p'+x+'x'+y).addClass("active");
				}
				else // if we set the active layer to something empty, add the class of the non-active case
				{
					if(this.Tetrion[x][y]['content'] == "_") // <- "_" is an empty cell. The class doesn't have any g in it.
					{
						$('#p'+x+'x'+y).css('background-image', 'url(\'img/blocks/' + this.system + '/' + this.system + this.Tetrion[x][y]['content'] + 'Tet.png\')');
					}
					else
					{
						$('#p'+x+'x'+y).css('background-image', 'url(\'img/blocks/' + this.system + '/' + this.system + this.Tetrion[x][y]['content'] + 'Tet.png\')');
						$('#p'+x+'x'+y).addClass("inactive")
					}
					$('#p'+x+'x'+y).removeClass("active");
				}
			}
			this.modify_active_center = function(x,y,value){
				/**
				*	Modifies the type of a single active center in the array at the selected point.
				*/
				this.Tetrion[x][y]["center_active"]=value;
			}

			this.modify_system = function(new_system){
				/**
				*  Changes the system to the current selected option.
				*/
				this.system = new_system;
				$('#system').val(new_system); // this is for loading purpose
				this.draw();
			}

			this.modify_hold = function(newhold) {
				this.hold = newhold ;
				var holddisplay = 'img/blocks/' + this.system + '/hold/' + this.system + 'hold' + this.hold + '.png';
				$('#hold').val(newhold); // this is for loading purpose
				$('#holdbox').attr("src", holddisplay);
			}

			this.modify_next1 = function(newnext1) {
				this.next1 = newnext1
				var next1display = 'img/blocks/' + this.system + '/bignext/' + this.system + 'NEXT' + this.next1 + '.png';
				$('#next1').val(newnext1);
				$('#next1box').attr("src", next1display);
			}

			this.modify_next2 = function(newnext2) {
				this.next2 = newnext2
				var next2display = 'img/blocks/' + this.system + '/smallnext/' + this.system + 'NEXT' + this.next2 + '.png';
				$('#next2').val(newnext2);
				$('#next2box').attr("src", next2display);
			}

			this.modify_next3 = function(newnext3) {
				this.next3 = newnext3
				var next3display = 'img/blocks/' + this.system + '/smallnext/' + this.system + 'NEXT' + this.next3 + '.png';
				$('#next3').val(newnext3);
				$('#next3box').attr("src", next3display);
			}

			this.modify_border = function(newborder){
				/**
				*  Changes the color of the playfield border to the current selected option.
				*/
				this.border_color = newborder;
				switch(this.border_color)
				{
				case "gray" :
					$('table#diagram').css('border', '5px solid gray');
					break;
				case "yellow" :
					$('table#diagram').css('border', '5px solid yellow');
					break;
				case "blue" :
					$('table#diagram').css('border', '5px solid blue');
					break;
				case "red" :
					$('table#diagram').css('border', '5px solid red');
					break;
				case "green" :
					$('table#diagram').css('border', '5px solid green');
					break;
				case "clear" :
					$('table#diagram').css('border', '5px solid transparent');
					break;
				case "none" :
					$('table#diagram').css('border', '5px solid transparent');
					break;
				}
				$('#border_color').val(newborder);

			}

			this.modify_preview=function(x,y,value){
				/**
				*	Calls for an update of the display at the selected point
				*/
				$('#p'+x+'x'+y).removeClass("preview");
				$('#p'+x+'x'+y+' .prev').removeClass("transparent-preview");
				if(value)
				{
					$('#p'+x+'x'+y).addClass("preview");
					$('#p'+x+'x'+y+' .prev').addClass("transparent-preview");

				}
			}

			this.paint_active = function(){
				// looks for something in the active layer, paint it on the inactive layer
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
				this.paint_active();
				this.rebootActive();
			}
			
			this.lookup_block = function(id) {
				var x_begin = id.indexOf('p');
				var y_begin = id.indexOf('x');

				var x = parseInt(id.substring(x_begin+1, y_begin));
				var y = parseInt(id.substring(y_begin+1));

				return this.Tetrion[x][y]['content'];
			}

			this.add_piece = function(current,modifier,piece_nature,piece_orientation,is_active){
				/**
				* Another method that modifies the playfield, but in some more complicated ways (it *uses* the other modify methods).
				* I know, it has an awful name.
				*
				* Takes as parameter:
				*		- current: array of the coordinate of the current case.
				*		- modifier: a flag that tells whether the method should add a piece in the playfield, or should add or remove a preview
				*		- piece_nature: the nature of the piece, e.g. L, S, T, garbage, item...
				*		- piece_orientation: the orientation of the piece: flat, upside down, ...
				*		- is_active: if the piece we add is an active one.
				*/

				/* This method:
				1. Get the coordinate of the current case
				2. Compute the coordinate of the other case according to the selected tetramino type
				3. Modify the playfield array accordingly
				4. Calls an update */


				var center = new Array();
				center.x=current.slice(1,current.indexOf("x")); // X position
				center.y=current.slice(current.indexOf("x")+1); // Y position

				var orientation = get_orientation(piece_orientation,center); // the orientation is set via an exterior function

				var t2 = new Array();
				var t3 = new Array();
				var t4 = new Array();

				t2.x = orientation[0].x; // put the orientation we got in the new arrays
				t2.y = orientation[0].y;
				t3.x = orientation[1].x;
				t3.y = orientation[1].y;
				t4.x = orientation[2].x;
				t4.y = orientation[2].y;

				if(piece_orientation == "T"	// exception if the piece is a locked single case
					|| piece_orientation == "L"
				|| piece_orientation == "J"
				|| piece_orientation == "S"
				|| piece_orientation == "Z"
				|| piece_orientation == "I"
				|| piece_orientation == "G"
				|| piece_orientation == "single"
				|| piece_orientation == "l"
				|| piece_orientation == "j"
				|| piece_orientation == "s"
				|| piece_orientation == "z"
				|| piece_orientation == "i"
				|| piece_orientation == "g"
				|| piece_orientation == "0"
				|| piece_orientation == "1"
				|| piece_orientation == "2"
				|| piece_orientation == "3"
				|| piece_orientation == "4"
				|| piece_orientation == "5"
				|| piece_orientation == "6"
				|| piece_orientation == "7"
				|| piece_orientation == "8"
				|| piece_orientation == "9"
				|| piece_orientation == "B"
				|| piece_orientation == "C"
				|| piece_orientation == "c"
				|| piece_orientation == "-"
				|| piece_orientation == "."
				|| piece_orientation == "X"
				|| piece_orientation == "x"
				|| piece_orientation == "@"
				)
				{
					t2.x = center.x;
					t2.y = center.y;
					t3.x = center.x;
					t3.y = center.y;
					t4.x = center.x;
					t4.y = center.y;
				}

				if(this.is_in(t2.x,t2.y) && this.is_in(t3.x,t3.y) && this.is_in(t4.x,t4.y)) // we don't want any out of bounds pieces
				{
					switch (modifier) // let us modify our 4 cases
					{
					case "class":
						if(is_active)
						{
							this.rebootActive();
							this.modify_active(center.x,center.y,piece_nature);
							this.modify_active_center(center.x,center.y,piece_orientation);
							this.modify_active(t2.x,t2.y,piece_nature);
							this.modify_active(t3.x,t3.y,piece_nature);
							this.modify_active(t4.x,t4.y,piece_nature);
						}
						else // if_inactive
						{
							this.Tetrion_History_Save(); //history
							this.modify(center.x,center.y,piece_nature);
							this.modify(t2.x,t2.y,piece_nature);
							this.modify(t3.x,t3.y,piece_nature);
							this.modify(t4.x,t4.y,piece_nature);
						}
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


			this.switchhold = function(){
				
				var tmp;
				
				for(var j=0; j<this.pf_height;j++) //Active
				{
					for(var i=0; i<this.pf_width;i++)
					{
						if(this.Tetrion[i][j]['center_active'])
						{
							tmp = this.Tetrion[i][j]['center_active'];
							tmp = tmp.slice(0,1);
						}
					}
				}
				this.rebootActive();
				if(this.hold)
				{
				this.spawn_piece(this.hold);
				this.modify_hold('');				
				}
				this.modify_hold(tmp);
				
			}

			this.advance_next = function(){
				
				this.modify_next1(this.next2);	
				this.modify_next2(this.next3);	
				this.modify_next3('');				
			}
			
			this.spawn_piece = function(piece_nature){
				/**
				*	Spawn an active piece to the top of a playfield, juste like a normal game would do
				*  TODO: implement IRS. Problem: the playfield need to be 2 case heigher ine the Y direction
				*		  (4 in SRS)                   
				*/
				var position_x = parseInt(this.pf_width) / 2;
				var position_y = 3;
				var spawn_position = "p"+position_x+"x0"
				
				this.add_piece(spawn_position,"class",piece_nature,piece_nature+"i",true);
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

			this.move_piece = function (direction) {
				/**
				*	Moves the active piece in active layer of the array
				*/
				for(var i=0;i<this.pf_width;i++) // we need a center ? where is it ?
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
				}
				var piece_nature = the_center.slice(0,1); // extract the piece nature and orientation from the center_active string
				var piece_orientation = the_center.slice(1);

				switch(direction) //computes what to modify with the center position ?
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

				var orientation = get_orientation(the_center,center_position);

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
					this.rebootActive();
					this.modify_active(center_position.x,center_position.y,piece_nature);
					this.modify_active_center(center_position.x,center_position.y,the_center);
					this.modify_active(t2.x,t2.y,piece_nature);
					this.modify_active(t3.x,t3.y,piece_nature);
					this.modify_active(t4.x,t4.y,piece_nature);
				}
			}

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

			this.print = function (){
				/**
				* Generates an encoded string that describes the playfield.
				*******************
				* Encoding format *
				*******************
				* - Each frame are separated by a "+"
				* - within each frame, a "_" separates different data
				* - those data are identified with a two letters identifier, starting with ")" and the following
				*   -> "r" : "rotation", or rotation system currently in use
				*	 -> "b" : border color
				*	 -> "n" : "next" preview
				*   -> "m" : "next" + 1
				*   -> "o  : "next" + 2
				*   -> "g" : "garbage", or the inactive pieces coordinates
				*			  each case are separated by a "-", and the coordinate are encoded by two letters (see alphanumconvert())
				*   -> "a" : "active", or the active center coordoniates
				*			  each case are separated by a "-", and the coordinate are encoded by two letters (see alphanumconvert())
				*   -> "c" : "comment", encoded in base64
				*
				* Example:
				* )rARS_)geeT-feT-dfT-efT-ffT-cgT-dgT-fgT-fhT-fiT-fjT-fkT-flT-fmT-fnT-_)cT25lIGJsdWU%3D+)rARS_)gdcL-ecL-fcL-ddL-fdL-gdL-ceL-geL-heL-cfL-hfL-cgL-hgL-chL-hhL-hiL-gjL-fkL-gkL-flL-emL-dnL-enL-doL-dpL-epL-fpL-gpL-hpL-_)cVHdvIG9yYW5nZQ%3D%3D+)rARS_)gbfZ-cfZ-dfZ-efZ-fgZ-fhZ-fiZ-cjZ-djZ-ejZ-fjZ-ekZ-flZ-glZ-fmZ-gmZ-enZ-fnZ-boZ-coZ-doZ-eoZ-_)ahc-Oi_)cVGhyZWUgZ3JlZW4gYW5kIGFjdGl2ZSB5ZWxsb3c%3D+
				* <- that should be One blue, Two Orange, Three green and yellow active.

				* Old string, disregard that
				* irARS_igdcT-ecT-fcT-edT-+igfbL-gbL-gcL-gdL-_icSSBsb3ZlIFRldHJpcyAh+igfbL-gbL-gcL-gdL-_iadd-Zcw_icxVmVyeSBtdWNoIG11Y2ggIQ%3D%3D+
				* <-----Frame 1---->|<----------------Frame 2---------------->|<-----------------------Frame 3--------------------------->|
				* idrot¦id<--cases coord->|id<- cases coord->¦id<- comment string ->|id<-pieces info-->¦id<actv>¦id<----- comment string------->|
				* idrot¦id<->¦<->¦<->¦<->¦|id<->¦<->¦<->¦<-> ¦                      |                  ¦        ¦                               |
				*        |                                                                          |
				*        ---> ecT: e = 5 ; c = 3 ; so at 5x3 there's a T case                       _--> dd-Zcw : d = 4, so at 4x4 there's a Z in clockwise orientation
				*
				*/
				var TetrionState=""; // our final string
				var tmp=""; // an utility string, may be flushed at will
				var coord_x;
				var coord_y;

				// We're encoding for one frame only, the rest is handled by the higher class



				// "r": since a pf has *always" a rotation system, we're beginning with it
				if(this.system)
				{
					TetrionState += ")r"+this.system+"_";
				}

				// "b": the same thing could be said about the border color :)

				if(this.border_color)
				{
					TetrionState += ")b"+this.border_color+"_";
				}

				// "h", "n","m","o": hold and nexts pieces; the system is modular enough to don't care if they aren't present
				if(this.hold)
				{
					TetrionState += ")h"+this.hold+"_";
				}

				if(this.next1)
				{
					TetrionState += ")n"+this.next1+"_";
				}

				if(this.next2)
				{
					TetrionState += ")m"+this.next2+"_";
				}
				if(this.next3)
				{
					TetrionState += ")o"+this.next3+"_";
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
					TetrionState+=")g";
					TetrionState+=tmp+"_";
					tmp=""; // let's reset tmp for further use
				}

				// "a" now for the Active piece. Same strategy

				for(var j=0; j<this.pf_height;j++) //Active
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
				}

				// if it's not empty means we got an active center
				if(tmp)
				{
					TetrionState+=")a";
					TetrionState+=tmp+"_";
					tmp=""; // let's reset tmp for further use
				}


				if(this.comment) //comment
				{
					TetrionState+=")c"+encodeURIComponent(Base64.encode(this.comment));
				}
				
				if(this.whiteborder)
				{
				TetrionState+=")w1"
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


				this.rebootPlayfield();
				this.rebootActive();
				if(!str){return;}
				var Split = str.split("_"); // let's decompose our string into individual element...

				for(var i=0;i<Split.length;i++) // for each of its constituent, analyse what it is
				{
					if(Split[i].charAt(0) == ")") // the first character must be the identifier z
					{

						switch(Split[i].charAt(1)) // let's see what is second character...
						{
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
						case "a" :
							var activeSplit = Split[i].slice(2).split("-");
							var center = new Array;

							center['x'] = alphanumconvert(activeSplit[0].charAt(0));
							center['y'] = alphanumconvert(activeSplit[0].charAt(1));

							var piece_nature = activeSplit[1].slice(0,1);
							var piece_orientation = activeSplit[1];
							var orientation = get_orientation(piece_orientation,center);

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
							this.draw_whiteborder(Split[i].slice(2));
							break;

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

			this.draw = function(){
				/**
				* Sets every cells to its rightful class
				* /!\ Slow function ! Do not overuse it (especially on mouseover)
				*/

				// sets the border
				switch(this.border_color)
				{
				case "gray" :
					$('table#diagram').css('border', '5px solid gray');
					break;
				case "yellow" :
					$('table#diagram').css('border', '5px solid yellow');
					break;
				case "blue" :
					$('table#diagram').css('border', '5px solid blue');
					break;
				case "red" :
					$('table#diagram').css('border', '5px solid red');
					break;
				case "green" :
					$('table#diagram').css('border', '5px solid green');
					break;
				case "clear" :
					$('table#diagram').css('border', '5px solid transparent');
					break;
				case "none" :
					$('table#diagram').css('border', '5px solid transparent');
					break;
				}

				// sets hold_and next
				$('#holdbox').attr("src", 'img/blocks/' + this.system + '/hold/' + this.system + 'hold' + this.hold + '.png');

				$('#next1box').attr("src", 'img/blocks/' + this.system + '/bignext/' + this.system + 'NEXT' + this.next1 + '.png');

				$('#next2box').attr("src", 'img/blocks/' + this.system + '/smallnext/' + this.system + 'next' + this.next2 + '.png');

				$('#next3box').attr("src", 'img/blocks/' + this.system + '/smallnext/' + this.system + 'next' + this.next3 + '.png');

				// sets every cell
				for(var i=0;i<this.pf_width;i++)
				{
					for(var j=0;j<this.pf_height;j++)
					{
						$('#p'+i+'x'+j).removeClass();
						if(this.Tetrion[i][j]['content_active'])
						{
							//$('#p'+i+'x'+j).addClass(this.system+this.Tetrion[i][j]['content_active']);
							//$('#p'+i+'x'+j).addClass("active");
							$('#p'+i+'x'+j).css('background-image', 'url(\'img/blocks/' + this.system + '/' + this.system + this.Tetrion[i][j]['content_active'] + 'Tet.png\')');
							$('#p'+i+'x'+j).addClass("active");
						}
						else
						{
							if(this.Tetrion[i][j]['content'] == "_") // <- if empty cell
							{
								$('#p'+i+'x'+j).css('background-image', 'url(\'img/blocks/' + this.system + '/' + this.system + this.Tetrion[i][j]['content'] + 'Tet.png\')');
							}
							else
							{
								$('#p'+i+'x'+j).css('background-image', 'url(\'img/blocks/' + this.system + '/' + this.system + this.Tetrion[i][j]['content'] + 'Tet.png\')');
								$('#p'+i+'x'+j).addClass("inactive");
							}
						}
					}
				}
				$('#com').val(this.comment);

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

			this.export_to_forum = function(){
				/**
				* Generates an usable forum string
				*/
				$("#export").html("[tedige]"+this.print()+"[/tedige]");
			}

			this.draw_whiteborder = function(status){
			
			var outbkg ="";	
				
			for(var i=0;i<this.pf_width;i++)
			{
			
				for(var j=0;j<this.pf_height;j++)
				{
					if( this.Tetrion[i][j]['content'] == "_")
					{
						
						if(status)
						{
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
						$('#p'+i+'x'+j).css('background-image', 'url(\'img/blocks/' + this.system + '/' + this.system + outbkg + 'Tet.png\')');
						outbkg ="";
					}
					
				}
				
			}
				
			}
			
			
		}


		/* -------------------------------------------------------------
		More general function here
		------------------------------------------------------------- */
		function alphanumconvert(input){
			/**
			* convert a letter to his corresponding number and vice-versa.
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

		function get_orientation(piece_orientation,center){
			/**
			* returns an two dimensionnals array that stores the position of the blocks
			* relative to a center given in parameter and to a set orientation also given in parameter
			*/
			var t2 = new Array();
			var t3 = new Array();
			var t4 = new Array();
			switch(piece_orientation)
			{
				/*
				This switch choose the cases to be modified
				g: locked / garbage
				i: initial orientation
				ccw: CCW-rotation
				cw: CW-rotation
				u: reverse or rotated orientation
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
			case "Iu" :
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
		var URLHash = window.location.hash;
		if(URLHash) // load if there's something in the url
		{
			D.load(URLHash.slice(1));
			D.first_playfield();
		}


		$("#save-button").click(function(){
				if ($('input[name=export]:checked').val() == 'All') {
					if ($('#wiki:checked').val() != null)
					{
						D.export_all_to_tw();
						$('#export').select();
					}
					else if ($('#url:checked').val() != null)
					{
						D.export_all_to_url();
						$('#export').select();
					}
					else
					{
						D.save();
						$('#export').select();
					}
				}

				if ($('input[name=export]:checked').val() == 'Current') {
					if ($('#wiki:checked').val() != null)
					{
						D.Playfields[D.current_playfield].export_to_tw();
						$('#export').select();
					}
					else if ($('#url:checked').val() != null)
					{
						D.Playfields[D.current_playfield].export_to_url();
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

		$('body').mousedown(function(){is_clicking = 1; right_clicking = 0;});
		$('body').mouseup(function(){is_clicking = 0; right_clicking = 0; left_remove = 0;});
		$('body').rightMouseDown(function(){is_clicking = 0; right_clicking = 1;});
		$('body').rightMouseUp(function(){is_clicking = 0; right_clicking = 0;});

		$('#diagram td').hover(function()
			{
				var piece_nature = $('input[type=radio][name=tetramino]:checked').attr('class'); // get the selected tetramino nature (L, S, garbage, item...)
				var piece_orientation = $('input[type=radio][name=tetramino]:checked').attr('value'); // get the selected tetramino type (L flat, upside down, etc...)
				var is_active = $('#active').attr('checked');

				// remove blocks by dragging with a right click
				if(right_clicking)
				{
					D.Playfields[D.current_playfield].add_piece($(this).attr("id"),"class","_",piece_orientation,is_active); // replace with empty
				}
				else if(is_clicking)
				{
					// remove blocks by dragging with a left click
					if (left_remove) {
						D.Playfields[D.current_playfield].add_piece($(this).attr("id"),"class","_",piece_orientation,is_active);
					}
					// place blocks by dragging with a left click
					else {
						D.Playfields[D.current_playfield].add_piece($(this).attr("id"),"class",piece_nature,piece_orientation,is_active); //add class
					}
				}
				else
				{
					D.Playfields[D.current_playfield].add_piece($(this).attr("id"),"addpreview",piece_nature,piece_orientation,is_active); // add preview
				}

			},                       
			function(){
				{
					var piece_nature = $('input[type=radio][name=tetramino]:checked').attr('class'); // get the selected tetramino nature (L, S, garbage, item...)
					var piece_orientation = $('input[type=radio][name=tetramino]:checked').attr('value'); // get the selected tetramino type (L flat, upside down, etc...)
					var is_active = $('#active').attr('checked');
					D.Playfields[D.current_playfield].add_piece($(this).attr("id"),"removepreview",piece_nature,piece_orientation,is_active); // remove preview
				}
			}
			);

		var rect_x_start, rect_x_end, rect_y_start,rect_y_end;
		var have_coord;

		$('#diagram td').mousedown(function(){
				clicked = $(this).attr("id");
				var piece_nature = $('input[type=radio][name=tetramino]:checked').attr('class'); // get the selected tetramino nature (L, S, garbage, item...)
				var piece_orientation = $('input[type=radio][name=tetramino]:checked').attr('value'); // get the selected tetramino type (L flat, upside down, etc...)
				var is_active = $('#active').attr('checked');
				var is_rectangle_mode = $('#rectangular-fill').attr('checked');
				if(is_rectangle_mode)
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
				else
				{
					
					if (D.Playfields[D.current_playfield].lookup_block(clicked) != "_" && D.Playfields[D.current_playfield].lookup_block(clicked) == piece_nature) {
						
						if(is_active)
						{
							D.Playfields[D.current_playfield].add_piece(clicked,"class",piece_nature,piece_orientation,is_active);
						left_remove = 1;
						}
						else
						{
						D.Playfields[D.current_playfield].add_piece(clicked,"class","_",piece_orientation,is_active);
						left_remove = 1;
						}
					}
					else {
						D.Playfields[D.current_playfield].add_piece(clicked,"class",piece_nature,piece_orientation,is_active);
					}
				}
				// TODO: pf_modifly(clicked, "highlight");
		} );

		$('#diagram td').rightMouseDown(function(){
				clicked = $(this).attr("id");
				var piece_nature = "_";
				var piece_orientation = $('input[type=radio][name=tetramino]:checked').attr('value'); // get the selected tetramino type (L flat, upside down, etc...)
				var is_active = $('#active').attr('checked');

				D.Playfields[D.current_playfield].add_piece(clicked,"class",piece_nature,piece_orientation,is_active);
				right_clicking = 1;                 
		} );

		$('#draw-whiteborder').click(function(){
				D.Playfields[D.current_playfield].whiteborder = 1;
				D.Playfields[D.current_playfield].draw_whiteborder(1);
		})

		$('#remove-whiteborder').click(function(){
				D.Playfields[D.current_playfield].whiteborder = 0;
				D.Playfields[D.current_playfield].draw_whiteborder(0);
		})		
		
		$('#com').change(function(){
				D.Playfields[D.current_playfield].save_comment();
		})

		$('#size-change').click(function(){
				D.Playfields[D.current_playfield].change_size(20,20);
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
		
		$("#cmd_new").click(function(){
				D.new_playfield();
		})

		$("#cmd_next").click(function(){
				if(D.currentplayfield == this.Playfields.lengeth-1)
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
		
		$("#cmd_recall").click(function(){
				D.Playfields[D.current_playfield].Tetrion_History_Recall();
		})


		$('#border_color').change(function(){
				D.Playfields[D.current_playfield].modify_border($('#border_color').val());
		})
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
				D.Playfields[D.current_playfield].modify_system(new_system);
				//D.Playfields[D.current_playfield].update_class();

		})

		$('#system-change-all').click(function(){
				var new_system = $('#system').val();
				D.set_system_to_all(new_system);
		})

		$('#system-change-default').click(function(){
				var new_system = $('#system').val();
				D.set_default_system(new_system);
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

		$('.preview').click(function(){
				return false;
		})
		$('.preview').mousedown(function(){
				return false;
		})
		$('.preview').mouseup(function(){
				return false;
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
		
		
		
		function kb_default(){
			kb_modifier = 16; //shift
			kb_up = 87; // w
			kb_left = 65; // a
			kb_right = 68; // d
			kb_down = 83; // s
			kb_ccw = 72; // h
			kb_cw = 71; // g
			kb_del = 79; // o                                                                                                                                        
			kb_new = 38; // ↑
			kb_previous = 37; // ←
			kb_next =  39; // →
			kb_modifier = 16; //shift
			kb_paint = 75 ;// k			



			
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
		}	          
	
		kb_default();
		
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
		
		$('#kb_modifier').change(function(){ kb_up = $('#kb_modifier').val();});		
		$('#kb_up').change(function(){ kb_up = $('#kb_up').val();});
		$('#kb_down').change(function(){ kb_down = $('#kb_down').val();});
		$('#kb_left').change(function(){ kb_left = $('#kb_left').val();});
		$('#kb_right').change(function(){ kb_right = $('#kb_right').val();});
		$('#kb_cw').change(function(){ kb_cw = $('#kb_cw').val();});
		$('#kb_ccw').change(function(){ kb_ccw = $('#kb_ccw').val();});
		$('#kb_del').change(function(){ kb_ccw = $('#kb_del').val();});
		$('#kb_new').change(function(){ kb_ccw = $('#kb_new').val();});	
		$('#kb_previous').change(function(){ kb_ccw = $('#kb_previous').val();});	
		$('#kb_next').change(function(){ kb_ccw = $('#kb_next').val();});		
		                                     
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
							D.next_playfield();
						}
						if(event.keyCode == kb_paint)
						{
							D.Playfields[D.current_playfield].Tetrion_History_Save();
							D.Playfields[D.current_playfield].paint_active();					
						}							
					}   
				}
		}); 
		$('#kb-control-save').click(function(){
		console.log('inkb1 = '+kb_up);
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
		});
		
		$('#kb-control-default').click(function(){
		kb_default();
		});
		
});

// deep copy clone function found in snipplr
                                                                                                                                                                                     
Array.prototype.clone = function () {var a = new Array(); for (var property in this) {a[property] = typeof (this[property]) == 'object' ? this[property].clone() : this[property]} return a}



                                                                                                                                                                            
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

