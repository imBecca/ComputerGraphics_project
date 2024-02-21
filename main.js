"use strict";
var provetta1, provetta2, provetta3= 0;
var pacco, morte= false;
var cameraP= true;
var cambiaCamera= false;
var cameraA= false;
var click_end= false;
var D= 17;
var cameraL, cameraL2= false;
var drag;
var numprovetta= 3;
var bias= -0.00005;
var provetta= false;
var THETA= degToRad(86);
var PHI= degToRad(23);
var x_light= 10, y_light= 200, z_light= 250;
var x_targetlight, y_targetlight, z_targetlight= 0;
var width_projLight= 3000;
var height_projLight= 1200;
var fovLight= 12, lightIntensity= 2.5, sahdowIntensity= 0.9;
var viewParamsChanged= false;
var doneSomething= false;
var nstep= 0;
var timeNow=0;
//matrici globali
var lightWorldMatrix;
var lightProjectionMatrix;
var projectionMatrix;
var cameraMatrix;
var viewParamsChanged;


const zNear= 0.1
const zFar= 200
const fieldOfViewRadians= degToRad(60);
const aspect= gl.canvas.clientWidth/gl.canvas.clientHeight;
const PHYS_SAMPLING_STEP= 20;

let cameraTarget= [0,0,0]
let cameraPosition= [0,0,0]
let up= [0,1,0]

function updateLightx(event, ui){
    x_light= ui.value;
}

function updateLighty(event, ui){
    y_light= ui.value;
}

function updateLightz(event, ui){
    z_light= ui.value;
}

var meshProgramInfo= webglUtils.createProgramInfo(gl, [vertShader, fragShader]);
var skyboxProgramInfo= webglUtils.createProgramInfo(gl, [skyVertShader,skyFragShader]);
var sun= webglUtils.createProgramInfo(gl, [sunVertShader, sunFragShader]);
var colorProgramInfo=  webglUtils.createProgramInfo(gl, [colorVertShader, colorFragShader]);

var matrix= new Image();
matrix.src= "oggetti/gameover.png";
matrix.addEventListener('load', function(){});

var wasd= new Image();
wasd.src= "oggetti/wasd.png";
wasd.addEventListener('load', function(){});

var arrow= new Image();
arrow.src= "oggetti/freccia.png";
arrow.addEventListener('load', function(){});

var sfondo= new Image();
sfondo.src= "oggetti/sfondo.png";
sfondo.addEventListener('load', function(){});

var riprova= new Image();
riprova.src= "oggetti/riprova.png";
riprova.addEventListener('load', function(){});

var image_menu= new Image();
image_menu.src= "oggetti/back.jpg"
image_menu.addEventListener('load', function(){});
setCoor(gl);
initOcchio();
createTextureLight();

webglLessonsUI.setupSlider("#LightX", {value: 10, slide: updateLightx, min: 0, max: 450, step: 1});
webglLessonsUI.setupSlider("#LightY", {value: 200, slide: updateLighty, min: 100, max: 450, step: 1});
webglLessonsUI.setupSlider("#LightZ", {value: 250, slide: updateLighty, min: 100, max: 350, step: 1});

function update(time){
    if(nstep*PHYS_SAMPLING_STEP<= timeNow){
        occhioDoStep();
        nstep++;
        doneSomething= true;
        window.requestAnimationFrame(update);
        return;
    }
    timeNow= time;
    if(doneSomething){
        render(time);
        doneSomething= false;
    }
    window.requestAnimationFrame(update);
}

function render(time){
    time *= 0.001;
    gl.enable(gl.DEPTH_TEST);   
    lightWorldMatrix= m4.lookAt(
        [x_light, y_light, z_light],
        [x_targetlight, y_targetlight, z_targetlight],
        up,
    );

    lightProjectionMatrix= m4.perspective(
        degToRad(fovLight),
        width_projLight/height_projLight,
        8, 700
    );
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
    gl.viewport(0,0, depthTextureSize, depthTextureSize);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    drawScene(lightProjectionMatrix, lightWorldMatrix, m4.identity(), lightWorldMatrix, colorProgramInfo, time);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let textureMatrix= m4.identity();
    textureMatrix= m4.translate(textureMatrix, 0.5, 0.5, 0.5);
    textureMatrix= m4.scale(textureMatrix, 0.5, 0.5, 0.5);
    textureMatrix= m4.multiply(textureMatrix, lightProjectionMatrix);
    textureMatrix= m4.multiply(textureMatrix, m4.inverse(lightProjectionMatrix));

    var proj= m4.perspective(fieldOfViewRadians, aspect, 0.1, 1200);
    var camera= m4.lookAt(cameraPosition, cameraTarget, up);
    var view= m4.inverse(camera);

    if(cameraP){
        cameraPosition= [posX +(D*Math.sin(degToRad(facing))), posY+7, posZ+(D*Math.cos(degToRad(facing)))];
    }

    if(cameraL2){
        cameraPosition = [D*1.5*Math.sin(PHI)*Math.cos(THETA),D*1.5*Math.sin(PHI)*Math.sin(THETA),D*1.5*Math.cos(PHI)];
    }

    if(cambiaCamera && !cameraL2){
        cameraPosition = [posX+(-D*Math.sin(degToRad(facing))), posY+20, posZ+(-D*Math.cos(degToRad(facing)))];		 
    }

    if(cameraA){
        cameraPosition=[0,105,2];
    }

    if(!cameraA){
        cameraTarget = [posX, posY, posZ]
    }else{
        cameraTarget= [0,0,0,];
    }

    drawScene(proj, camera, textureMatrix, lightWorldMatrix, sun, time);
    drawSkybox(gl, skyboxProgramInfo, view, proj);
    drawTextInfo();
}
update();
window.requestAnimationFrame(update);

function drawScene(projectionMatrix, camera, textureMatrix, lightProjectionMatrix, programInfo, time){
    const viewMatrix= m4.inverse(camera);
    gl.useProgram(programInfo.program);

    if(texture_enable == true){
        webglUtils.setUniforms(programInfo, {u_view: viewMatrix, u_projection: projectionMatrix, u_bias: bias, u_textureMatrix: textureMatrix, u_projectedTexture: depthTexture, u_reverseLightDirection: lightWorldMatrix.slice(8, 11), u_lightDirection: m4.normalize([-1, 3, 5]), u_lightIntensity: lightIntensity, u_shadowIntensity: sahdowIntensity});
    }else if(texture_enable == false){
        textureMatrix= m4.identity();
        textureMatrix= m4.scale(textureMatrix, 0, 0, 0);
        webglUtils.setUniforms(programInfo, {u_view: viewMatrix, u_projection: projectionMatrix, u_bias: bias, u_textureMatrix: textureMatrix, u_reverseLightDirection: lightWorldMatrix.slice(8, 11), u_lightIntensity: lightIntensity, u_shadowIntensity: sahdowIntensity});
    }

    drawMouse(programInfo);
    drawSchermo(programInfo);
    drawGlasses(programInfo, time);
    drawGlasses2(programInfo, time);
    drawGlasses3(programInfo, time);
    drawGlasses4(programInfo, time);
    if(provetta1 == 0){
        drawProvetta(programInfo, time);
    }
    if(provetta2 == 0){
        drawProvetta2(programInfo, time);
    }
    if(provetta3 == 0){
        drawProvetta3(programInfo, time);
    }

    if(numprovetta == 0){
        if(pacco == false){
            drawPacco(programInfo, time);
        }
        drawFoto(programInfo, time);
    }
    drawPavimento(programInfo);
}

function drawTextInfo(){
    ctx.drawImage(image_menu, 871.5, 1);
    ctx.font= '14pt Calibri';
    ctx.fillStyle= 'blue';
    ctx.fillText("Prova a raccogliere tutte le provette!", 800, 50);
    ctx.font= '14pt Calibri';
    ctx.fillStyle= 'red';
    numprovetta= provetta1 + provetta2 + provetta3;
    if((numprovetta) != 3){
        ctx.fillText("Provette da raccogliere: $numprovetta", 880, 100);
    }else if((numprovetta) == 3){
        ctx.fillStyle= 'green';
        ctx.fillText("Complimenti!! Hai raccolto tutte le provette!!", 880, 120);
        ctx.font= '14pt Calibri';
        ctx.fillStyle= 'red';
        ctx.fillText("Hai fatto infuriare il boss! prova a guardare cosa nasconde alle sue spalle", 880, 120);
    }
    if(pacco == true){
        ctx.fillStyle = 'green';
        ctx.fillText("    Grazie per aver recuperato", 880, 230);
        ctx.fillText("    tutte le provette!!", 880, 250);
    }

    ctx.font = '12pt Calibri';
	ctx.fillStyle = 'purple';
	ctx.fillText("Attenzione evita i virus rotanti per ", 880, 140);
	ctx.fillText("non rimetterci i circuiti", 880, 160);
	ctx.font = '10pt Calibri';
	ctx.fillStyle = 'black';
	ctx.fillText("----------------------------------------------------------", 871, 270);
	ctx.font = '16pt Calibri';
	ctx.fillStyle = 'red';
	ctx.fillText("	             CONTROLLI 		", 870, 290);
	ctx.font = '13pt Calibri';
	ctx.fillStyle = 'black';
    ctx.fillText("          Controllo movimento", 880, 310);
    ctx.font = '12pt Calibri';
	ctx.fillText("          W avanti            A sinistra", 880, 330); 
	ctx.fillText("          S indietro          D destra", 880, 350); 
    ctx.font = '13pt Calibri';
    ctx.fillText("Controllo movimento camera", 880, 380);
	ctx.fillText("con le freccie direzionali ⇑⇓⇒⇐", 880, 400); 
    ctx.fillText("o con il movimento del mouse", 880, 420);
	ctx.font = '13pt Calibri';
	ctx.fillText("Puoi avvicinare e allontare la", 880, 440); 
    ctx.fillText("camera con la rotella del mouse", 880, 460); 
	
   if(morte==1){  
        ctx.drawImage(matrix,0,0,text.clientWidth,text.clientHeight);
        ctx.drawImage(riprova,480, 380);
    }

}

function drawMouse(ProgramInfo){
    let u_model4= m4.scale(m4.translation(posX, posY, posZ), 3, 3, 3)
    u_model4= m4.yRotate(u_model4, degToRad(facing))
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_mouse)
    webglUtils.setUniforms(ProgramInfo, {u_world: u_model4, u_texture: texture_mouse,})
    webglUtils.drawBufferInfo(gl, bufferInfo_mouse)
}

function drawGlasses(ProgramInfo, time){
    let u_model= m4.identity()
    u_model= m4.scale(m4.translation(-25, 5.5, -15), 5.5, 5.5, 5.5)
    u_model= m4.yRotate(u_model, time)
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_glasses)
    webglUtils.setUniforms(ProgramInfo, {u_world: u_model, u_texture: texture_glasses})
    webglUtils.drawBufferInfo(gl, bufferInfo_glasses)
}

function drawGlasses2(ProgramInfo, time){
    let u_model= m4.identity()
    u_model= m4.scale(m4.translation(10, 5.5, 30), 5.5, 5.5, 5.5)
    u_model= m4.yRotate(u_model, time)
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_glasses)
    webglUtils.setUniforms(ProgramInfo, {u_world: u_model, u_texture: texture_glasses})
    webglUtils.drawBufferInfo(gl, bufferInfo_glasses)
}

function drawGlasses3(ProgramInfo, time){
    let u_model= m4.identity()
    u_model= m4.scale(m4.translation(35, 1, 20), 5, 5, 5)
    u_model= m4.yRotate(u_model, time)
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_enemy)
    webglUtils.setUniforms(ProgramInfo, {u_colorMult: [0.5, 0.5, 1, 1], u_world: u_model, u_texture: texture_enemy})
    webglUtils.drawBufferInfo(gl, bufferInfo_enemy)
}

function drawGlasses4(ProgramInfo, time){
    let u_model= m4.identity()
    u_model= m4.scale(m4.translation(12, 1, -10), 5, 5, 5)
    u_model= m4.yRotate(u_model, time)
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_enemy)
    webglUtils.setUniforms(ProgramInfo, {u_colorMult: [0.5, 0.5, 1, 1], u_world: u_model, u_texture: texture_enemy_purp})
    webglUtils.drawBufferInfo(gl, bufferInfo_enemy)
}

function drawProvetta(ProgramInfo, time){
    let u_modelprovetta= m4.scale(m4.translation(6, 0, -35), 1.3, 1.3, 1.3)
    u_modelprovetta= m4.yRotate(u_modelprovetta, time);
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_provetta)
    webglUtils.setUniforms(ProgramInfo, {u_colorMult: [0.5, 0.5, 1, 1], u_world: u_modelprovetta, u_texture: texture_provetta,})
    webglUtils.drawBufferInfo(gl, bufferInfo_provetta)
}

function drawProvetta2(ProgramInfo, time){
    let u_modelprovetta= m4.scale(m4.translation(32, 0, -8), 1.3, 1.3, 1.3)
    u_modelprovetta= m4.yRotate(u_modelprovetta, time);
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_provetta)
    webglUtils.setUniforms(ProgramInfo, {u_colorMult: [0.5, 0.5, 1, 1], u_world: u_modelprovetta, u_texture: texture_provetta})
    webglUtils.drawBufferInfo(gl, bufferInfo_provetta)
}

function drawProvetta3(ProgramInfo, time){
    let u_modelprovetta= m4.scale(m4.translation(-15, 0, 35), 1.3, 1.3, 1.3)
    u_modelprovetta= m4.yRotate(u_modelprovetta, time);
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_provetta)
    webglUtils.setUniforms(ProgramInfo, {u_colorMult: [0.5, 0.5, 1, 1], u_world: u_modelprovetta, u_texture: texture_provetta})
    webglUtils.drawBufferInfo(gl, bufferInfo_provetta)
}

function drawCube(ProgramInfo){
    let u_modelcube= m4.scale(m4.translation(20, 10, -5), 10, 10, 10)
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_cube)
    webglUtils.setUniforms(ProgramInfo, {u_texture: texture_cube, u_world: u_modelcube,})
    webglUtils.drawBufferInfo(gl, bufferInfo_provetta)
}

function drawPavimento(ProgramInfo){
    let u_modelpavimento= m4.identity()
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_pavimento)
    webglUtils.setUniforms(ProgramInfo, {u_world: u_modelpavimento, u_texture: texture_pavimento,})
    webglUtils.drawBufferInfo(gl, bufferInfo_pavimento)
}

function drawPacco(ProgramInfo){
    let u_modelfoto= m4.identity()
    u_modelfoto= m4.scale(m4.translation(0, 2, -29), 4, 4, 4)
    u_modelfoto= m4.yRotate(u_modelfoto, degToRad(180))
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_foto)
    webglUtils.setUniforms(ProgramInfo, {u_world: u_modelfoto, u_texture: texture_foto,})
    webglUtils.drawBufferInfo(gl, bufferInfo_foto)
}

function drawSchermo(ProgramInfo){
    let u_modelfoto= m4.identity()
    u_modelfoto= m4.scale(m4.translation(0, 45, -66), 140, 90, 1)
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_foto)
    webglUtils.setUniforms(ProgramInfo, {u_world: u_modelfoto, u_texture: texture_win,})
    webglUtils.drawBufferInfo(gl, bufferInfo_foto)
}

function drawFoto2(ProgramInfo, time){
    let u_modelfoto= m4.identity()
    u_modelfoto= m4.scale(m4.translation(0, 5.5, -10), 7, 7, 7)
    u_modelfoto= m4.zRotate(m4.xRotate(m4.yRotate(u_modelfoto, time), time), time)
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_foto)
    webglUtils.setUniforms(ProgramInfo, {u_world: u_modelfoto, u_texture: texture_face,})
    webglUtils.drawBufferInfo(gl, bufferInfo_foto)
}

function drawSkybox(gl, skyboxProgramInfo, view, projection){
    gl.depthFunc(gl.LEQUAL)
    const viewMatrix= m4.copy(view);
    viewMatrix[12]= 0;
    viewMatrix[13]= 0;
    viewMatrix[14]= 0;
    let viewDirectionProjectionMatrix= m4.multiply(projection, viewMatrix)
    let viewDirectionProjectionInverse= m4.inverse(viewDirectionProjectionMatrix)
    gl.useProgram(skyboxProgramInfo.program);
    webglUtils.setBuffersAndAttributes(gl, skyboxProgramInfo, bufferInfo_skybox)
    webglUtils.setUniforms(skyboxProgramInfo, {u_viewDirectionProjectionInverse: viewDirectionProjectionInverse, u_skybox: texture_skybox,})
    webglUtils.drawBufferInfo(gl, bufferInfo_skybox)
}