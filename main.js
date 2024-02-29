"use strict";
var provetta1=0;
var provetta2= 0;
var provetta3= 0;
var pacco= false;
var morte= false;
var vittoria= false;
var cameraP= true;
var cambiaCamera= false;
var cameraA= false;
var click_end= false;
var D= 17;
var cameraL= false;
var cameraL2= false;
var drag;
var numprovetta= 3;
var bias= -0.00005;
var provetta= false;
var THETA= degToRad(86);
var PHI= degToRad(23);
var x_light= 10, 
    y_light= 200, 
    z_light= 250,
    x_targetlight= 0,
    y_targetlight= 0,
    z_targetlight= 0,
    width_projLight= 3000,
    height_projLight= 1200,
    fovLight= 12,
    lightIntensity= 2.5,
    sahdowIntensity= 0.9;
var viewParamsChanged= false;
var doneSomething= false;
var nstep= 0;
var timeNow=0;
var viewParamsChanged= false;
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
    matrix.src= "../oggetti/gameover.png";
    matrix.addEventListener('load', function(){});

    var win= new Image();
    win.src= "../oggetti/win.jpeg";
    win.addEventListener('load', function(){});

    var sfondo= new Image();
    sfondo.src= "oggetti/cielo.jpeg";
    sfondo.addEventListener('load', function(){});

    var riprova= new Image();
    riprova.src= "../oggetti/reset.png";
    riprova.addEventListener('load', function(){});

    var image_menu= new Image();
    image_menu.src= "../oggetti/back.jpeg"
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
        8, 
        700);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
    gl.viewport(0, 0, depthTextureSize, depthTextureSize);
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
    textureMatrix= m4.multiply(textureMatrix, m4.inverse(lightWorldMatrix));

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
        cameraTarget= [0,0,0];
    }

    drawScene(proj, camera, textureMatrix, lightWorldMatrix, sun, time);
    drawSkybox(gl, skyboxProgramInfo, view, proj);
    drawTextInfo();
}
update();
window.requestAnimationFrame(update);

function drawScene(projectionMatrix, camera, textureMatrix, lightWorldMatrix, programInfo, time){
    const viewMatrix= m4.inverse(camera);
    gl.useProgram(programInfo.program);

    if(texture_enable == true){
        webglUtils.setUniforms(programInfo, {
            u_view: viewMatrix,
            u_projection: projectionMatrix, 
            u_bias: bias, 
            u_textureMatrix: textureMatrix, 
            u_projectedTexture: depthTexture, 
            u_reverseLightDirection: lightWorldMatrix.slice(8, 11), 
            u_lightDirection: m4.normalize([-1, 3, 5]), 
            u_lightIntensity: lightIntensity, 
            u_shadowIntensity: sahdowIntensity
        });
    }
    if(texture_enable == false){
        textureMatrix= m4.identity();
        textureMatrix= m4.scale(textureMatrix, 0, 0, 0);
        webglUtils.setUniforms(programInfo, {u_view: viewMatrix, u_projection: projectionMatrix, u_bias: bias, u_textureMatrix: textureMatrix, u_reverseLightDirection: lightWorldMatrix.slice(8, 11), u_lightIntensity: lightIntensity, u_shadowIntensity: sahdowIntensity});
    }

    drawOcchio(programInfo);
    drawGlasses(programInfo, time);
    drawGlasses2(programInfo, time);
    if(provetta1 == 0){
        drawProvetta(programInfo, time);
    }
    if(provetta2 == 0){
        drawProvetta2(programInfo, time);
    }
    if(provetta3 == 0){
        drawProvetta3(programInfo, time);
    }
    drawPavimento(programInfo);
}

function drawTextInfo(){
    ctx.drawImage(image_menu, 871.5, 1);
    ctx.font= '14pt Calibri';
    ctx.fillStyle= 'blue';
    ctx.fillText("Raccogli tutte le fialette ", 900, 50);
    ctx.fillText("di collirio!", 950, 65);
    ctx.font= '14pt Calibri';
    ctx.fillStyle= 'white';
    numprovetta= provetta1 + provetta2 + provetta3;
    //console.log("Il valore di numprovetta è:", numprovetta);
    ctx.fillText(`Fialette da raccogliere:`, 900, 100);
    if((numprovetta) == 0){
        ctx.fillText("3", 985, 120);
    }else if((numprovetta) == 1){
        ctx.fillText("2", 985, 120);
    }else if((numprovetta) == 2){
        ctx.fillText("1", 985, 120);
    }else if((numprovetta) == 3){
        vittoria= true;
    }

    ctx.font = '12pt Calibri';
	ctx.fillStyle = 'red';
	ctx.fillText("Attenzione ai cattivi rotanti ", 900, 180);
	ctx.fillText("che ti faranno infiammare", 905, 200);
    ctx.fillText("la pupilla!", 955, 220);
	ctx.font = '10pt Calibri';
	ctx.fillStyle = 'white';
	ctx.fillText("----------------------------------------------------------", 871, 250);
	ctx.font = '16pt Calibri';
	ctx.fillStyle = 'red';
	ctx.fillText("	             CONTROLLI 		", 860, 270);
	ctx.font = '14pt Calibri';
	ctx.fillStyle = 'white';
    ctx.fillText("Controllo movimento Occhio", 875, 300);
    ctx.font = '12pt Calibri';
	ctx.fillText("W avanti            A sinistra", 904, 320); 
	ctx.fillText("S indietro          D destra", 908, 340); 
    ctx.font = '14pt Calibri';
    ctx.fillText("Controllo movimento Camera", 875, 375);
    ctx.font = '12pt Calibri';
    ctx.fillText("Muovi la camera con le", 905, 400);
	ctx.fillText("freccie direzionali ⇑⇓⇒⇐", 905, 420); 
	ctx.font = '12pt Calibri';
	ctx.fillText("Puoi avvicinare e allontare la", 895, 450); 
    ctx.fillText("camera con la rotella del mouse", 885, 470); 
	
   if(morte==1){  
        ctx.drawImage(matrix,0,0,text.clientWidth,text.clientHeight);
        ctx.drawImage(riprova,480, 175);
    }else if(vittoria== true){
        ctx.drawImage(win,0,0,text.clientWidth,text.clientHeight);
        ctx.drawImage(riprova,480, 175);
    }
}

function drawOcchio(ProgramInfo){
    let u_model4= m4.scale(m4.translation(posX, posY, posZ), 3.5, 3.5, 3.5)
    u_model4= m4.yRotate(u_model4, degToRad(facing))
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_mouse)
    webglUtils.setUniforms(ProgramInfo, {u_world: u_model4, u_texture: texture_mouse,})
    webglUtils.drawBufferInfo(gl, bufferInfo_mouse)
}


function drawGlasses(ProgramInfo, time){
    let u_model= m4.identity()
    u_model= m4.scale(m4.translation(-25, 7.5, -15), 5.5, 5.5, 5.5)
    u_model= m4.yRotate(u_model, time)
    u_model= m4.zRotate(u_model, -time)
    u_model = m4.xRotate(u_model, Math.PI / 2)
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_glasses)
    webglUtils.setUniforms(ProgramInfo, {u_world: u_model, u_texture: texture_glasses})
    webglUtils.drawBufferInfo(gl, bufferInfo_glasses)
}

function drawGlasses2(ProgramInfo, time){
    let u_model= m4.identity()
    u_model= m4.scale(m4.translation(35, 7.5, 30), 5.5, 5.5, 5.5)
    u_model= m4.yRotate(u_model, time)
    u_model= m4.zRotate(u_model, time)
    u_model = m4.xRotate(u_model, Math.PI / 2)
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_glasses)
    webglUtils.setUniforms(ProgramInfo, {u_world: u_model, u_texture: texture_glasses})
    webglUtils.drawBufferInfo(gl, bufferInfo_glasses)
}

function drawProvetta(ProgramInfo, time){
    let u_modelprovetta= m4.scale(m4.translation(6, 7, -35), 3, 3, 3)
    u_modelprovetta= m4.yRotate(u_modelprovetta, time);
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_provetta)
    webglUtils.setUniforms(ProgramInfo, {u_colorMult: [0.5, 0.5, 1, 1], u_world: u_modelprovetta, u_texture: texture_provetta,})
    webglUtils.drawBufferInfo(gl, bufferInfo_provetta)
}

function drawProvetta2(ProgramInfo, time){
    let u_modelprovetta= m4.scale(m4.translation(32, 7, -8), 3, 3, 3)
    u_modelprovetta= m4.yRotate(u_modelprovetta, -time);
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_provetta)
    webglUtils.setUniforms(ProgramInfo, {u_colorMult: [0.5, 0.5, 1, 1], u_world: u_modelprovetta, u_texture: texture_provetta})
    webglUtils.drawBufferInfo(gl, bufferInfo_provetta)
}

function drawProvetta3(ProgramInfo, time){
    let u_modelprovetta= m4.scale(m4.translation(-15, 7, 35), 3, 3, 3)
    u_modelprovetta= m4.yRotate(u_modelprovetta, time);
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_provetta)
    webglUtils.setUniforms(ProgramInfo, {u_colorMult: [0.5, 0.5, 1, 1], u_world: u_modelprovetta, u_texture: texture_provetta})
    webglUtils.drawBufferInfo(gl, bufferInfo_provetta)
}

function drawPavimento(ProgramInfo){
    let u_modelpavimento= m4.identity()
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_pavimento)
    webglUtils.setUniforms(ProgramInfo, {
        u_world: u_modelpavimento, 
        u_texture: texture_pavimento,
    })
    webglUtils.drawBufferInfo(gl, bufferInfo_pavimento)
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