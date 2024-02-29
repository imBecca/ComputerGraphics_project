
// Implementazione dei metodi che permettono il movimento del mouse.

// STATO Mouse
// (DoStep fa evolvere queste variabili nel tempo)
var posX, posY, posZ, facing; // posizione e orientamento
var sterzo; 
var vx, vy, vz; // velocita' attuale

// queste di solito rimangono costanti
var velSterzo, velRitornoSterzo, accMax, attrito,
    raggioRuotaA, raggioRuotaP, grip,
    attritoX, attritoY, attritoZ; // attriti
var key;


//Inizializziamo le variabili utili  al movimento del mouse
function initOcchio() {
    // inizializzo lo stato della macchina
    posX = posZ = facing = 0;
    posY = 5; // posizione e orientamento
    sterzo = 0;   // stato
    vx = vy = vz = 0;      // velocita' attuale
    // inizializzo i controlli
    key = [false, false, false, false];
   

    velSterzo = 3.2;         // A
    velRitornoSterzo = 0.84; // B, sterzo massimo = A*B / (1-B)

    accMax = 0.005;

    // attriti: percentuale di velocita' che viene mantenuta
    // 1 = no attrito
    // <<1 = attrito grande
    attritoZ = 0.99;  // piccolo attrito sulla Z 
    attritoX = 0.8;  // grande attrito sulla X 
    attritoY = 1.0;  // attrito sulla y nullo


    grip = 0.35; // quanto il facing macchina si adegua velocemente allo sterzo
}

//Indipendente dal rendering permette i movimenti del mouse
function occhioDoStep() {

    var vxm, vym, vzm; // velocita' in spazio 

    // da vel frame mondo a vel frame 
    var cosf = Math.cos(facing * Math.PI / 180.0);
    var sinf = Math.sin(facing * Math.PI / 180.0);
    vxm = +cosf * vx - sinf * vz;
    vym = vy;
    vzm = +sinf * vx + cosf * vz;

    // gestione dello sterzo
    if (key[1]) sterzo += velSterzo;
    if (key[3]) sterzo -= velSterzo;
    sterzo *= velRitornoSterzo; // ritorno a "volante" fermo

    if (key[0]) vzm -= accMax; // accelerazione in avanti
    if (key[2]) vzm += accMax; // accelerazione indietro
    

    // attriti (semplificando)
    vxm *= attritoX;
    vym *= attritoY;
    vzm *= attritoZ;

    // l'orientamento del mouse segue quello dello sterzo
    // (a seconda della velocita' sulla z)
    facing = facing - (vzm * grip) * sterzo;


    // ritorno a vel coord mondo
    vx = +cosf * vxm + sinf * vzm;
    vy = vym;
    vz = -sinf * vxm + cosf * vzm;



  
		posX+=vx;
		posY+=vy;
		posZ+=vz;
	


    //console.log("posX: " + posX + " posY: " + posY + " posZ: " + posZ);

    //primo cubo
    if (posX >= -31 && posX <= -19
		&& posZ >= -21 && posZ <= -9) {
            morte=1;
		}

    if (posX >= 29 && posX <= 41
		&& posZ >= 14 && posZ <= 26) {
            morte=1;
            
		}

    /*   if (posX >= 6 && posX <= 18
            && posZ >= -16 && posZ <= -4) {
                morte=1;
                
            }

     /*if (posX >= 3 && posX <= 17.5
        && posZ >= 23 && posZ <= 36.5) {
            morte=1;
            
        }*/

    if (posX >= -5.5 && posX <= 5
        && posZ >= -15 && posZ <= -4
        && provetta1==true && provetta2==true && provetta3==true) {
            morte=1;
        }
    
        if (posX >= 0 && posX <= 12
            && posZ >= -41 && posZ <= -29) {
            provetta1=true;
           }

    if (posX >= 27 && posX <= 37
        && posZ >= -14 && posZ <= -2) {
        provetta2=true;
        
        }
		
       
        if (posX >= -21 && posX <= -9
            && posZ >= 29 && posZ <= 41) {
            provetta3=true;
            
            }

            if (posX >= -6 && posX <= 6
                && posZ >= -35 && posZ <= -23 && numprovetta==3) {
                pacco=true;
                
                }
    

    if (posX >= 67.8 || posX <= -67.8
        || posZ >= 67.7 || posZ <= -58.8) {
           morte=true;
      }

}
