
BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;	//	the tween manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    this.gameWidth=640;
    this.gameHeight=1136;
    // this.stage.backgroundColor=0xFFFFFF;
    this.testinfo='start';
    this.test=new Object();
        this.test.a=0;
        this.test.b=0;
        this.test.c=0;
    this.initFinished =false;
    this.clickStat =0;
    this.score=new Array();
        this.score[0]=0;
        this.score[1]=0;
    this.winInfo;
    this.gameNotOver=true;
    this.tween;
    this.scoreA;
    this.scoreAb;
    this.scoreZ;
    this.scoreZb;
    this.player = new Object();
        this.player.p=0;// playing
        this.player.r=0;// played rounds
        this.player.o =function()// opposite
        {
            return this.player.p===0? 1:0;
        };
        this.player.change =function()
        {
            this.player.r++;
            this.player.p=this.player.o();
            for(var i=0;i<12;i++)
                if(this.chess[i].own===this.player.p)
                    this.chess[i].health++;
                //revive chess in tomb after 1 round;
            this.winplayer=this.scoreCheck();
            // someone win
            if(this.winplayer>-1)
            {
                this.gameNotOver=false;
                for(var i=0;i<12;i++)
                    this.chess[i].inputEnabled=false;
                if(this.winplayer===0)
                    this.winInfo.animations.play("order");
                else
                    this.winInfo.animations.play("chaos");
                    this.tween = this.add.tween(this.winInfo.scale).to( { x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true);
            }

        };
    this.selectedChess=-1;
    this.selectedArea=-1;

    this.chess = new Array();

    this.CP = new Object();//center postion caculated from

        this.CP.xxx = this.gameWidth/2;
        this.CP.yyy = this.gameHeight/2;

    this.DiBoard = 263;//diameter of  board
    this.DiBattle =90;//diameter of battle area
    this.DiTomb =60;
    this.AR =
    {
        createNew: function(type,own,xx,yy,agl)
        {
            var area = new Object();
            area.typ=type;//0 battle, 1 big, 2 small, 3 core, 4  -1 null
            area.own=own;//0 ordre, 1 chaos , also use by domained by for battle area. -1 unused;
            area.cap= (type===0||type===4)? 4:1 ; //capbility
            area.hold=0;// hold #
            area.x=this.CP.xxx+xx;// delta x
            area.y=this.CP.yyy+yy;// delta y
            area.agl=agl;// content angle
            area.cont= new Array();//content
            for (var i = 1; i <=4; i++) // cannot use index 0
            {
                area.cont[i]= new Object();
                area.cont[i].chessid = -1;//-1 no chess on ; the chessID
                area.cont[i].x=area.x;
                area.cont[i].y=area.y;
            }
            // area.cont[5]= game.add.sprite(area.x,area.y,'AL');
            return area;
        },
    };

    this.MP = new Array();//Map Point Position
    {

        this.MP[0] = new this.AR.createNew(2,     0,  0,      295,    180);
        this.MP[1] = new this.AR.createNew(2,     0,  -103,   117,    180);
        this.MP[2] = new this.AR.createNew(2,     0,  103,    117,    180);
        this.MP[3] = new this.AR.createNew(3,     0,  0,      57,     0);
        this.MP[4] = new this.AR.createNew(1,     0,  -103,   236,    0);
        this.MP[5] = new this.AR.createNew(1,     0,  103,    236,    0);
        this.MP[6] = new this.AR.createNew(0,     0,  0,      355,    180);
        this.MP[7] = new this.AR.createNew(0,     0,  -155,   87,     180);
        this.MP[8] = new this.AR.createNew(0,     0,  155,    87,     180);
        this.MP[9] = new this.AR.createNew(-1,    0,  0,      176,    0);
        for(var i=10;i<20;i++)
            this.MP[i]= new this.AR.createNew(this.MP[i-10].typ,1,(this.MP[i-10].x-CP.x)*-1,(this.MP[i-10].y-CP.y)*-1,(this.MP[i-10].agl===0? 180:0));
        for(var i=6;i<9;i++)
        {
            this.MP[i].cont[2].y+=this.DiBattle;
            this.MP[i].cont[3].x-=this.DiBattle*0.866;
            this.MP[i].cont[3].y-=this.DiBattle*0.5;
            this.MP[i].cont[4].x+=this.DiBattle*0.866;
            this.MP[i].cont[4].y-=this.DiBattle*0.5;
        }
        for(var i=16;i<19;i++)
        {
            this.MP[i].cont[2].y-=this.DiBattle;
            this.MP[i].cont[3].x-=this.DiBattle*0.866;
            this.MP[i].cont[3].y+=this.DiBattle*0.5;
            this.MP[i].cont[4].x+=this.DiBattle*0.866;
            this.MP[i].cont[4].y+=this.DiBattle*0.5;
        }
            this.MP[9].cont[2].y+=this.DiTomb;
            this.MP[9].cont[3].x-=this.DiTomb*0.866;
            this.MP[9].cont[3].y-=this.DiTomb*0.5;
            this.MP[9].cont[4].x+=this.DiTomb*0.866;
            this.MP[9].cont[4].y-=this.DiTomb*0.5;
            this.MP[19].cont[2].y-=this.DiTomb;
            this.MP[19].cont[3].x-=this.DiTomb*0.866;
            this.MP[19].cont[3].y+=this.DiTomb*0.5;
            this.MP[19].cont[4].x+=this.DiTomb*0.866;
            this.MP[19].cont[4].y+=this.DiTomb*0.5;
    }

    this.Chess =
    {
        createNew: function(i)
        {
            var texture;
            var type =Math.floor(i/3);
            switch (type)
            {
                case 0:
                    texture='AS';
                    break;
                case 1:
                    texture='AL';
                    break;
                case 2:
                    texture='ZS';
                    break;
                case 3:
                    texture='ZL';
                    break;
            }
            // var tempChess= game.add.sprite(CP.x+MP[ii][i%6].x,CP.y+MP[ii][i%6].y,texture);
            var tempChess= this.add.sprite(CP.x,CP.y,   texture);

            tempChess.anchor.setTo(0.5, 2/3);

            //  And enable the Sprite to have a physics body:
            this.physics.arcade.enable(tempChess);
            tempChess.body.allowRotation=true;
            tempChess.inputEnabled = true;
            tempChess.input.consumePointerEvent=true;
            tempChess.input.pixelPerfectAlpha=10;
            tempChess.input.pixelPerfectClick=true;
            tempChess.input.bringToTop=true;


            tempChess.health=1;
            tempChess.own = type<2 ? 0:1;// 0 order, 1 chaos
            // tempChess.z=2*i + tempChess.own;// set smaller in the front
            tempChess.typ = type%2===0 ? 0:1;// 0 small , 1 big
            tempChess.belong = 0;// which area.
            tempChess.belong2= 0;// the content position of area
            return tempChess;
        },
    };

    this.accessArray = new Array();
    {
        for(var i=0;i<20;i++)
        {
            this.accessArray[i]=new Array();
            for(var ii=i;ii<20;ii++)
            {
                // this.accessArray[i][ii]=new Object();
                // this.accessArray[i][ii].typ=0;// typ 0 cannot access, 1 can access directly, 2 access through big area;
                // this.accessArray[i][ii].mid=-1;// mid area for access through
                this.accessArray[i][ii]=-2;//-2 cannot access. -1 access directly. else is the area# access through.
            }
        }
        // same board access
        for(var i=0;i<20;i+=10)
        {
            this.accessArray[0+i][6+i]=-1;
            this.accessArray[1+i][7+i]=-1;
            this.accessArray[2+i][8+i]=-1;
            this.accessArray[3+i][7+i]=-1;
            this.accessArray[3+i][8+i]=-1;
            this.accessArray[4+i][6+i]=-1;
            this.accessArray[4+i][7+i]=-1;
            this.accessArray[5+i][6+i]=-1;
            this.accessArray[5+i][8+i]=-1;
            this.accessArray[6+i][9+i]=-1;// center tomb move to tail area
            this.accessArray[6+i][7+i]=4+i;
            this.accessArray[6+i][8+i]=5+i;
            this.accessArray[7+i][8+i]=3+i;
        }
        //access between boards
        this.accessArray[3][13]=-1;
        this.accessArray[7][18]=-1;
        this.accessArray[8][17]=-1;
    };









};

BasicGame.Game.prototype =
{




    access:function(x,y)
    {
        if(x>y)
        {
            var z=y;
            y=x;
            x=z;
        }
        return this.accessArray[x][y];
    },


    scoreCheck:function()
    {
        this.score[0]=0;
        this.score[1]=0;
        for(var i=0;i<6;i++)
        {
            if(this.MP[i].cont[1].chessid!=-1 && this.MP[i].own!=this.chess[this.MP[i].cont[1].chessid].own)
                this.score[this.chess[this.MP[i].cont[1].chessid].own]++;
            if(this.MP[i+10].cont[1].chessid!=-1 && this.MP[i+10].own!=this.chess[this.MP[i+10].cont[1].chessid].own)
                this.score[this.chess[this.MP[i+10].cont[1].chessid].own]++;
        }
        if(this.score[0]>=3 || this.score[1]>=3)
        {
            if(this.score[0]==this.score[1])
                return this.player.o();
            else if(this.score[0]>this.score[1])
                return 0;
            else if(this.score[0]<this.score[1])
                return 1;
        }
        return -1;
    },

    areaLevel:function(areaid)// the # of the domain chesses;
    {
        var N0=0,N1=0;//Np # chess of 0 or 1
        for(var ii=1;ii<=4;ii++)
        {
            if(this.MP[areaid].cont[ii].chessid===-1)
                continue;
            else if(this.MP[areaid].cont[ii].chessid<6)
                N0++;
            else if(this.MP[areaid].cont[ii].chessid>=6)
                N1++;
        }
        return N1>N0? N1: N0;
    },

    battleChange:function()
    {   // battle own;
        for(var i=0; i<20;i++)
        {
            if(this.MP[i].typ===0)
            {
                if(this.MP[i].hold===0)
                    this.MP[i].own=-1;
                else
                {
                    var N0=0,N1=0;//Np # chess of 0 or 1
                    for(var ii=1;ii<=4;ii++)
                    {
                        if(this.MP[i].cont[ii].chessid===-1)
                            continue;
                        else if(this.MP[i].cont[ii].chessid<6)
                            N0++;
                        else if(this.MP[i].cont[ii].chessid>=6)
                            N1++;
                    }

                    // game.debug.text(N0, 40, 80,0xFFFFFF);
                    // game.debug.text(N1, 40, 120,0xFFFFFF);
                    // no condition they are equal.
                    if(N0>N1)
                        this.MP[i].own=0;
                    if(N0<N1)
                        this.MP[i].own=1;

                }
                switch(this.MP[i].own)
                {
                    case 0:
                        this.MP[i].cont[5].loadTexture('order');
                        this.MP[i].cont[5].body.angularVelocity=10;
                        this.MP[i].cont[5].scale.set(0.8);
                        break;
                    case 1:
                        this.MP[i].cont[5].loadTexture('chaos');
                        this.MP[i].cont[5].body.angularVelocity=-10;
                        this.MP[i].cont[5].scale.set(0.8);
                        break;
                    case -1:
                        this.MP[i].cont[5].loadTexture('balance');
                        this.MP[i].cont[5].body.angularVelocity=0;
                        this.MP[i].cont[5].angle=this.MP[i].agl;
                        this.MP[i].cont[5].scale.set(1.5);
                        break;
                }
            }
        }
    },

    boardChange:function(chessid,coreid)
    {
        var chessown= this.chess[chessid].own;
        var chessownoppo = chessown===0? 1:0;
        switch(coreid)
        {
            case 3:
                for(var i=0;i<20;i++)
                {
                    if(i===6)
                        i=9;
                    if(i===16)
                        i=19;
                    this.MP[i].own= i<10 ? chessown:chessownoppo;
                }
                break;
            case 13:
                for(var i=0;i<20;i++)
                {
                    if(i===6)
                        i=9;
                    if(i===16)
                        i=19;
                    this.MP[i].own= i<10 ? chessownoppo:chessown;
                }
                break;
            default:
            return false;
        }
        for(var i=9;i<20;i+=10)
        {
            //tomb sign
            if(this.MP[i].typ===-1)
            {
                switch(this.MP[i].own)
                {
                    case 0:
                        this.MP[i].cont[5].loadTexture('order');
                        this.MP[i].cont[5].body.angularVelocity=10;
                        this.MP[i].cont[5].scale.set(0.8);
                        break;
                    case 1:
                        this.MP[i].cont[5].loadTexture('chaos');
                        this.MP[i].cont[5].body.angularVelocity=-10;
                        this.MP[i].cont[5].scale.set(0.8);
                        break;
                    case -1:
                        this.MP[i].cont[5].loadTexture('balance');
                        this.MP[i].cont[5].body.angularVelocity=0;
                        this.MP[i].cont[5].angle=this.MP[i].agl;
                        break;
                }
            }
        }
        return true;
    },


    moveIn:function(chessid,areaid,contid)
    {

        this.chess[chessid].belong = areaid;
        this.chess[chessid].belong2= contid;
        this.MP[areaid].hold++;
        this.MP[areaid].cont[contid].chessid=chessid;
        // step in a foe core?
        if(this.chess[chessid].own!=this.MP[areaid].own && (areaid===3 || areaid===13))
            boardChange(chessid,areaid);
    },

    moveOut:function(chessid)
    {
        this.MP[this.chess[chessid].belong].hold--;
        this.MP[this.chess[chessid].belong].cont[this.chess[chessid].belong2].chessid=-1;
        //when a chess leave a core, if the oppo core is also a own chess, and oppo core is foe
        switch(this.chess[chessid].belong)
        {
            case 3:
                if(this.MP[13].cont[1].chessid!=-1 && this.chess[this.MP[13].cont[1].chessid].own===this.chess[chessid].own &&this.MP[13].own!=this.chess[chessid].own)
                    boardChange(this.MP[13].cont[1].chessid,13);
                return true;
            case 13:
                if(this.MP[3].cont[1].chessid!=-1 && this.chess[this.MP[3].cont[1].chessid].own===this.chess[chessid].own &&this.MP[3].own!=this.chess[chessid].own)
                    boardChange(this.MP[3].cont[1].chessid,3);
                return true;
            default:
                return false;
        }
    },

    goTomb:function(chessid)
    {
        this.testinfo='die';
        var tombid= this.chess[chessid].own===this.MP[9].own? 9:19;
        if(this.MP[tombid].hold<4)
        {
            var contid=1;
            for(var i=1;i<=4;i++)
                if(this.MP[tombid].cont[i].chessid===-1)
                {
                    contid=i;
                    break;
                }
            moveOut(chessid);
            moveIn(chessid,tombid,contid);
            this.chess[chessid].health=0;
            // chess[chessid].inputEnabled=false;
            return true;
        }
        else
            return false;
    },

    revive:function()
    {
            //chess revive;
        for(var i=0;i<12;i++)
        {
            if(this.chess[i].health>0)
            {
                switch(this.chess[i].belong)
                {
                    case 9:
                        move(i,6);
                        break;
                    case 19:
                        move(i,16);
                        break;

                }
            }
        }
    },

    contSort:function(areaid)
    {
        // for(var i=1;i<=this.MP[areaid].hold;i++)
        // {
        //  if(this.MP[areaid].cont[i].chessid===-1)
        //  {
        //      for(var ii=i+1;ii<=4;i++)
        //          if(this.MP[areaid].cont[ii].chessid!=-1)
        //          {
        //              this.MP[areaid].cont[i].chessid=this.MP[areaid].cont[ii].chessid;
        //              this.MP[areaid].cont[ii].chessid;
        //              break;
        //          }
        //  }
        // }
        var tempchessid=-2;
        for(var i=3;i>1;i--)
            for(var ii=1;ii<=i;ii++)
            {
                if(this.MP[areaid].cont[ii].chessid===-1 && this.MP[areaid].cont[ii+1].chessid!=-1)
                {
                    // tempchessid=MP[areaid].cont[ii].chessid;
                    // MP[areaid].cont[ii].chessid=MP[areaid].cont[ii+1].chessid;
                    // MP[areaid].cont[ii+1].chessid=tempchessid;
                    tempchessid=this.MP[areaid].cont[ii+1].chessid;
                    moveOut(tempchessid);
                    moveIn(tempchessid,areaid,ii);
                }
            }
    },

    areaSort:function()
    {
        for(var i=0;i<20;i++)
            if(this.MP[i].typ===0 || this.MP[i].typ===-1)
                contSort(i);
    },

    move:function(chessid,areaid)
    {
        // make decision
        // if(typeof die ==='undefined')
        //  die=0;
        //if die is true
        // else if(die===1)
        //  {
                // if(this.MP[areaid].hold<4)
                // {
                //  for(var i=1;i<=4;i++)
                //      if(this.MP[areaid].cont[i].chessid===-1)
                //      {
                //          contid=i;
                //          break;
                //      }
                // }
            //  break;
            // }
        var contid=1;
        // cannot move into the current areaid
        if(this.chess[chessid].belong===areaid)
            return false;

        //can it move into the target? check access array
        var mid= access(this.chess[chessid].belong,areaid);
        // test.a=mid;
        // test.b=chess[chessid].belong;
        // test.c=areaid;
        switch(mid)
        {
            case -2:
                return false;
            case -1:
                break;
            default:
                if(this.MP[mid].hold>0 && this.chess[this.MP[mid].cont[1].chessid].own===this.chess[chessid].own && this.chess[this.MP[mid].cont[1].chessid].typ===1 && this.chess[chessid].typ===0)
                    break;
                else
                    return false;
        }


        //caculate the areaid domain level
        // dLevel=areaLevel(areaid)


        // two condition cannot move caused by oppo domain level
        // in a battle area, level >=2 and it's not the same own, then cannot move out
        if(this.MP[this.chess[chessid].belong].typ===0 && this.MP[this.chess[chessid].belong].own!=this.chess[chessid].own && areaLevel(this.chess[chessid].belong)>=2)
                return false;
        // to a battle area, level >=3 and it's not the same own, then cannot move in
        if(this.MP[areaid].typ===0 && this.MP[areaid].own!=this.chess[chessid].own && areaLevel(areaid)>=3)
                return false;



                            // game.debug.text(this.MP[areaid].hold, 40, 80,0xFFFFFF);
        //decide area type
        switch(this.MP[areaid].typ)
        {
            case 0://battle
                //find a empty cont position for the moving chess
                if(this.MP[areaid].hold<4)
                {
                    for(var i=1;i<=4;i++)
                        if(this.MP[areaid].cont[i].chessid===-1)
                        {
                            contid=i;
                            break;
                        }
                }
                else
                {
                    // this is our full area, cannot step in more chess.
                    if(this.MP[areaid].own===this.chess[chessid].own && areaLevel(areaid)===4)
                        return false;
                    else
                    {
                        // find a first foe chess first.
                        for(var i=1;i<=4;i++)
                            if(this.chess[this.MP[areaid].cont[i].chessid].own!=this.chess[chessid].own)
                            {
                                contid=i;
                                break;
                            }
                        // find a first same type foe chess first.
                        for(var i=1;i<=4;i++)
                            if(this.chess[this.MP[areaid].cont[i].chessid].own!=this.chess[chessid].own && this.chess[this.MP[areaid].cont[i].chessid].typ ==this.chess[chessid].typ )
                            {
                                contid=i;
                                break;
                            }
                        goTomb(this.MP[areaid].cont[contid].chessid);
                    }


                }
                break;
            case 1:// big
            case 3://core
                // if this place already has chess
                if(this.MP[areaid].hold>0)
                {
                    // if it's a foe small chess and you are using a big chess, kill it!!
                    if(this.chess[this.MP[areaid].cont[1].chessid].own!= this.chess[chessid].own && this.chess[this.MP[areaid].cont[1].chessid].typ===0 && this.chess[chessid].typ===1)
                        goTomb(this.MP[areaid].cont[1].chessid);
                    else // else condition cannot move in and replace.
                        return false;

                }
                break;
            case 2:// small
                if(this.MP[areaid].hold>0 || this.chess[chessid].typ===1)// big chess cannot move in small area
                    return false;
                break;
            case -1:// center tomb
                //tomb cannot be stepped in by player's hand.
            default:
                return false;

        }





        moveOut(chessid);
        moveIn(chessid,areaid,contid);
        battleChange();// not include change tomb sigh, tomb sigh is included in boardChange();
        areaSort();

        return true;
    },




    moveAnimation:function()
    {
        // game.physics.arcade.accelerateToXY(chess[chessid], this.MP[areaid].cont[contid].x, this.MP[areaid].cont[contid].y, 30, 100, 100);
        // game.physics.arcade.moveToXY(chess[chessid], this.MP[areaid].cont[contid].x, this.MP[areaid].cont[contid].y, 30);
        // if(initFinished)
        // {
            for (var i = 0; i <12; i++)
            {
                if(i===this.selectedChess)
                    continue;
                this.physics.arcade.moveToXY(this.chess[i], this.MP[this.chess[i].belong].cont[this.chess[i].belong2].x,this.MP[this.chess[i].belong].cont[this.chess[i].belong2].y,0,200);
                if (this.physics.arcade.distanceBetween(this.chess[i],this.MP[this.chess[i].belong].cont[this.chess[i].belong2])>40)
                    this.chess[i].body.angularVelocity   = 10* this.physics.arcade.distanceBetween(this.chess[i],this.MP[this.chess[i].belong].cont[this.chess[i].belong2]);
                else
                {
                    if (this.chess[i].body.angularVelocity<10)
                    {
                        this.chess[i].body.angularVelocity=0;
                        this.chess[i].angle=this.MP[this.chess[i].belong].agl;
                    }
                    else
                    {
                        if(this.MP[this.chess[i].belong].agl===0)
                            this.chess[i].body.angularVelocity = (Math.abs(360-(this.chess[i].angle+360)%360))*10;
                        if(this.MP[this.chess[i].belong].agl===180)
                            this.chess[i].body.angularVelocity = (Math.abs(180-(this.chess[i].angle+360)%360))*10;
                    }
                }

            }
        // which player is playing?

            this.MP[this.player.p*10+9].cont[5].body.angularVelocity=50+0.5*this.physics.arcade.distanceToPointer(this.MP[this.player.p+9]);
            this.MP[this.player.o()*10+9].cont[5].body.angularVelocity=10;
        // }
    },

    clickEvent:function()
    {
        this.testinfo='clicked';
        switch(this.clickStat)
        {
        case 0:
            this.testinfo+=' clickStat=0;';
            //why it cannot work!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            // for(var i=0;i<12;i++)
            //  chess[i].input.pixelPerfectClick=true;
            for (var i = 0; i<12; i++)
            {
                //pixelPerfectClick cost too much? then open it when it neccessary
                // chess[i].input.pixelPerfectClick=true;
                if(this.chess[i].own===this.player.p && (this.chess[i].input.pointerDown(0) ||this.chess[i].input.pointerDown(1) ))
                {
                    this.selectedChess=i;
                    this.clickStat=1;
                    this.chess[i].body.angularVelocity=500;
                    this.testinfo+=this.selectedChess;
                    this.testinfo+='.own='+this.chess[selectedChess].own;
                }
                // chess[i].input.pixelPerfectClick=false;
            }
            // for(var i=0;i<12;i++)
            //  chess[i].input.pixelPerfectClick=false;
            break;
        case 1:
            this.testinfo+=' clickStat=1;';
            var selectedDistance=3000;
            // for(var i=0;i<12;i++)
            //  chess[i].input.pixelPerfectClick=false;
            for(var i=0;i<20;i++)
            {
                if(selectedDistance>this.physics.arcade.distanceToPointer(this.MP[i]))
                {
                    selectedDistance=this.physics.arcade.distanceToPointer(this.MP[i])
                    this.selectedArea=i;
                    // testinfo+=game.physics.arcade.distanceToPointer(this.MP[i].cont[1])+'\n';
                }

            }
            if (selectedDistance<50)// in the board.
                if(move(selectedChess,selectedArea))
                {
                    revive();
                    this.player.change();  // switch players
                }
                // testinfo+=selectedArea;

            this.selectedChess=-1;
            this.selectedArea=-1;
            this.clickStat=0;
            break;

        }
    },














	create: function ()
    {

		//	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

        //  To make the sprite move we need to enable Arcade Physics
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.board_up = this.add.sprite(CP.x,CP.y-DiBoard, 'board');
        this.board_up.anchor.setTo(0.5, 0.5);
        this.board_down = this.add.sprite(CP.x,CP.y+DiBoard, 'board');
        this.board_down.anchor.setTo(0.5, 0.5);
        this.board_down.angle=180;
        this.winInfo=this.add.sprite(CP.x,CP.y,'winInfo');
        this.winInfo.animations.add("null",[0],1,false);
        this.winInfo.animations.add("order",[3,4,5,4,3],2,true);
        this.winInfo.animations.add("chaos",[6,7,8,7,6],2,true);
        this.winInfo.animations.play("null");
        this.winInfo.anchor.set(0.5);
        this.winInfo.scale.set(0);
        this.scoreA = this.add.sprite(CP.x+200,CP.y+400, 's0');
        this.scoreA.anchor.set(0.5);
        this.scoreAb= this.add.sprite(CP.x+200,CP.y+400, 'order');
        this.scoreAb.anchor.set(0.5,2/3);
        this.scoreAb.scale.set(0.6);
        this.physics.arcade.enable(this.scoreAb);
        this.scoreAb.body.allowRotation=true;
        this.scoreAb.body.angularVelocity=10;
        this.scoreZ = this.add.sprite(CP.x-200,CP.y-400, 's0');
        this.scoreZ.anchor.set(0.5);
        this.scoreZb= this.add.sprite(CP.x-200,CP.y-400, 'chaos');
        this.scoreZb.anchor.set(0.5,2/3);
        this.scoreZb.scale.set(0.6);
        this.physics.arcade.enable(this.scoreZb);
        this.scoreZb.body.allowRotation=true;
        this.scoreZb.body.angularVelocity=-10;
        for (var i = 0; i <12; i++)
        {
            this.chess[i] = new this.Chess.createNew(i);
            var mi=i;//map area id
            if (i>=6)// chaos chessid
                mi=i+4;//chaos area begin from 10;
            moveIn(i,mi,1);
        }
        //battle area sign.
        for(var i=0; i<20;i++)
        {

            if(this.MP[i].typ===0||this.MP[i].typ===-1)
            {
                this.MP[i].cont[5]=this.add.sprite(this.MP[i].x,this.MP[i].y,'balance');
                this.MP[i].cont[5].anchor.set(0.5,2/3);
                this.MP[i].cont[5].angle=this.MP[i].agl;
                this.physics.arcade.enable(this.MP[i].cont[5]);
                this.MP[i].cont[5].body.allowRotation=true;
                // this.MP[i].cont[5].body.angularVelocity = this.MP[i].own===0? 10:10;// rotation clockwise
            }
        }
        battleChange();
        boardChange(3,3);
        scoreCheck();

        this.initFinished=true;
        this.input.onTap.add(clickEvent);



        // move(0,19,3);
        // move(1,19,2);
        // move(2,19,4);
        // move(6,19,1);




	},

	update: function ()
    {

		//	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        if(this.initFinished)
        {   // score check;
            // scoreCheck();

            //control control
            // I don't know why if i put this in the player.change or similar function it will make the input confuse.
            for(var i=0;this.gameNotOver&&i<12;i++)
            {
                if((this.chess[i].belong===9)||(this.chess[i].belong===19))
                    this.chess[i].inputEnabled=false;
                else
                    this.chess[i].inputEnabled=true;
            }
            moveAnimation();
        }
        //game over and bring the this.wininfo to the front
        if(!this.gameNotOver)
        {
            this.winInfo.bringToTop();
            this.MP[9].cont[5].body.angularVelocity=0;
            this.MP[19].cont[5].body.angularVelocity=0;
        }

	},

    render: function()
    {
        if(this.scoreA.frameName!=('images/'+this.score[0]+'.png'))
        {
            this.scoreA.loadTexture('s'+this.score[0]);
            this.scoreA.scale.set(0);
            this.tween = this.add.tween(this.scoreA.scale).to( { x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true);
            this.scoreAb.body.angularVelocity=this.score[0]*100+5;
            this.scoreAb.scale.set(this.score[0]/8+0.6);
        }
        if(this.scoreZ.frameName!=('images/'+this.score[1]+'.png'))
        {
            this.scoreZ.loadTexture('s'+this.score[1]);
            this.scoreZ.scale.set(0);
            this.tween = this.add.tween(this.scoreZ.scale).to( { x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true);
            this.scoreZb.body.angularVelocity=this.score[1]*-100-5;
            this.scoreZb.scale.set(this.score[1]/8+0.6);
        }
    },

	quitGame: function (pointer)
    {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.state.start('MainMenu');

	}

};
