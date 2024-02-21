//Implementazione dei metodi che permettono il movimento dell'occhio
var posX, posY, posZ, facing; //variabili che indicano la posizione e il puntamento
var direzione; 
var vx, vy, vz; //veriabili che indicano la velocità
var velDirezione, velRitDirezione, accMax, attrito, raggioRuotaA, raggioRuotaP, grip, attritoX, attritoY, attritoZ, key;

function initOcchio(){
    posX= posY= posZ= facing= 0;
    direzione= 0;
    vx= vy= vz= 0;
    key= [false, false, false, false];
    velDirezione= 3.2;
    velRitDirezione= 0.84;
    accMax= 0.005;
    attritoZ= 0.99;
    attritoY= 1.0;
    attritoX= 0.8;
    grip= 0.35;
}

function occhioDoStep(){
    var vxm, vym, vzm;
    var cosf= Math.cos(facing * Math.PI / 180.0);
    var sinf= Math.sin(facing * Math.PI / 180.0);
    vxm= +cosf * vx - sinf * vz;
    vym = vy;
    vzm = +sinf * vx + cosf * vz;

    if(key[1]) direzione += velDirezione;
    if(key[3]) direzione -= velDirezione;
    direzione*= velRitDirezione;
    if(key[0]) vzm -= accMax;
    if(key[2]) vzm += accMax;

    vxm *= attritoX;
    vym *= attritoY;
    vzm *= attritoZ;

    facing= facing - (vzm*grip) * direzione;

    vx= +cosf*vxm+sinf*vzm;
    vy=vym;
    vz= -sinf*vxm+cosf+vzm;
        posX+=vx;
        posY+=vy;
        posZ+=vz;
    if(posX>= -31 && posX<= -19 && posZ>= -21 && posZ<= -9){
        morte= 1;
    }

    if(posX>= 29 && posX<= 41 && posZ>= 14 && posZ<= 26){
        morte= 1;
    }

    if(posX>= 3 && posX<= 17.5 && posZ>= 23 && posZ<= 36.5){
        morte= 1;
    }

    if(posX>= -5.5 && posX<= 5 && posZ >= -15 && posZ<= -4 && provetta1==true && provetta2==true && provetta3==true){
        morte= 1;
    }

    if(posX>= 0 && posX<= 12 && posZ>= -41 && posZ<= -2){
        provetta1= true;
    }

    if(posX>= 27 && posX<= 37 && posZ>= -14 && posZ<= -2){
        provetta2= true;
    }

    if(posX>= -21 && posX<= -9 && posZ>= 29 && posZ<= 41){
        provetta3= true;
    }

    if(posX>= -6 && posX <= 6 && posZ >= -35 && posZ<= -23 && numprovetta==3){
        pacco= true;
    }

    if(posX>= 67.8 || posX<= -67.8 || posZ>= 67.7 || posZ<= -58.8){
        morte= true;
    }
}