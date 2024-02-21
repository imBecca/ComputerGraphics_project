//Buffer degli oggetti
let bufferInfo_cube
let bufferInfo_enemy
let bufferInfo_foto
let bufferInfo_glasses
let bufferInfo_mouse
let bufferInfo_pavimento
let bufferInfo_provetta
let bufferInfo_rotella
let bufferInfo_skybox
// Buffer texture
let texture_mouse
let texture_pavimento
let texture_cube
let texture_enemy
let texture_enemy_purp
let texture_face
let texture_foto
let texture_glasses
let texture_provetta
let texture_rotella
let texture_skybox
let texture_win

//Cordinate oggetti
function setCoor(gl){
    loadEnemy()
    loadGlasses()
    loadCube()
    loadProvetta()
    loadPavimento()
    loadFoto()
    loadSkybox()
    loadMouse()
}

function loadPavimento(){
    const S= 70;
    const H= 0;
    const textureCoords= [0, 0, 1, 0, 0, 1, 1, 1];
    const arrays_floor= {
        position: {numComponents: 3, data: [-S, H, -S, S, H, -S, -S, H, S, S, H, S], },
        textcoord: {numComponents: 2, data: textureCoords, },
        indices: {numComponents: 3, data:[0, 2, 1, 2, 3, 1, ],},
        normal: {numComponents: 3, data:[0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,],},
    };
    bufferInfo_pavimento= webglUtils.createBufferInfoFromArrays(gl, arrays_floor);
    texture_pavimento= loadTextureFromImg("../oggetti/pavimento.jpeg")
    console.log("bufferInfo_pavimento", bufferInfo_pavimento)
}

function loadFoto(){
    const position=[
        -0.5, -0.5, -0.5,   -0.5, 0.5,-0.5,   0.5, -0.5, -0.5,   -0.5,  0.5, -0.5,    0.5, 0.5, -0.5,   0.5, -0.5, -0.5,
        -0.5, -0.5,  0.5,   -0.5, 0.5, 0.5,   0.5, -0.5,  0.5,    0.5, -0.5,  0.5,   -0.5, 0.5,  0.5,   0.5,  0.5,  0.5,
        -0.5,  0.5, -0.5,   -0.5, 0.5, 0.5,   0.5,  0.5, -0.5,   -0.5,  0.5,  0.5,    0.5, 0.5,  0.5,   0.5,  0.5, -0.5,
        -0.5, -0.5, -0.5,    0.5,-0.5,-0.5,  -0.5, -0.5,  0.5,   -0.5, -0.5,  0.5,    0.5,-0.5, -0.5,   0.5, -0.5,  0.5,
        -0.5, -0.5, -0.5,   -0.5,-0.5, 0.5,  -0.5,  0.5, -0.5,   -0.5, -0.5,  0.5,   -0.5, 0.5,  0.5,  -0.5,  0.5, -0.5,
         0.5, -0.5, -0.5,    0.5, 0.5,-0.5,   0.5, -0.5,  0.5,    0.5, -0.5,  0.5,    0.5, 0.5, -0.5,   0.5,  0.5,  0.5,
    ];
    const normal=[
        0, 0, -1,   0, 0, -1,   0, 0, -1,   0, 0, -1,   0, 0, -1,   0, 0, -1,
        0, 0, 1,    0, 0, 1,    0, 0, 1,    0, 0, 1,    0, 0, 1,    0, 0, 1,
        0, 1, 0,    0, 1, 0,    0, 1, 0,    0, 1, 0,    0, 1, 0,    0, 1, 0,
        0, -1, 0,   0, -1, 0,   0, -1, 0,   0, -1, 0,   0, -1, 0,   0, -1, 0,
        -1, 0, 0,   -1, 0, 0,   -1, 0, 0,   -1, 0, 0,   -1, 0, 0,   -1, 0, 0,
        1, 0, 0,    1, 0, 0,    1, 0, 0,    1, 0, 0,    1, 0, 0,    1, 0, 0,
    ];

    const texcoor=[
        1.0, 0.0,   0.0, 0.0,   1.0, 1.0,   0.0, 0.0,   0.0, 1.0,   1.0, 1.0,
        1.0, 0.0,   1.0, 1.0,   0.0, 0,0,   0.0, 0.0,   1.0, 1.0,   0.0, 1.0,
        1.0, 1.0,   1.0, 0.0,   0.0, 1.0,   1.0, 0.0,   0.0, 0.0,   0.0, 1.0,
        0.0, 0.1,   1.0, 1.0,   0.0, 0.0,   0.0, 0.0,   1.0, 1.0,   1.0, 0.0,
        1.0, 1.0,   1.0, 0.0,   0.0, 1.0,   1.0, 0.0,   0.0, 0.0,   0.0, 1.0,
        0.0, 1.0,   1.0, 1.0,   0.0, 0.0,   0.0, 0.0,   1.0, 1.0,   1.0, 0.0,
    ];

    const arrays_foto={
        position: {numComponents: 3, data: position},
        textcoord: {numComponents: 2, data: texcoor,},
        normale: {numComponents: 3, data: normal,},
    }

    bufferInfo_foto= webglUtils.createBufferInfoFromArrays(gl, arrays_foto);
    texture_foto= loadTextureFromImg("../oggetti/sfondo.png")
    texture_win= loadTextureFromImg("../oggetti/sfondo.png")
}

//sole 
function loadEnemy(){
    loadObj("../oggetti/sol/sol.obj")
    const enemy_array={
        position: {numComponents: 3, data: webglVertexData[0],},
        texcoord: {numComponents: 2, data: webglVertexData[1],},
        normal: {numComponents: 3, data: webglVertexData[2],},
    }
    bufferInfo_enemy= webglUtils.createBufferInfoFromArrays(gl, enemy_array)
    texture_enemy= loadTextureFromImg("../oggetti/sol/2k_sun.jpg")
}

function loadGlasses(){
    loadObj("../oggetti/Glasses.obj")
    const glasses_array={
        position: {numComponents: 3, data: webglVertexData[0],},
        texcoord: {numComponents: 2, data: webglVertexData[1],},
        normal: {numComponents: 3, data: webglVertexData[2],},
    }
    bufferInfo_glasses= webglUtils.createBufferInfoFromArrays(gl, glasses_array)
    texture_glasses= loadTextureFromImg("../oggetti/texOcchiali.jpg")
}

function loadCube(){
    loadObj("../oggetti/cubeInternet.obj")
    const array_cubo= {
        position: {numComponents: 3, data: webglVertexData[0],},
        texcoord: {numComponents: 2, data: webglVertexData[1],},
        normal: {numComponents: 3, data: webglVertexData[2],},
    }
    bufferInfo_cube= webglUtils.createBufferInfoFromArrays(gl, array_cubo)
}

function loadProvetta(){
    loadObj("../oggetti/provetta.obj")
    const array_provetta= {
        position: {numComponents: 3, data: webglVertexData[0],},
        texcoord: {numComponents: 2, data: webglVertexData[1],},
        normal: {numComponents: 3, data: webglVertexData[2],},
    }
    bufferInfo_provetta= webglUtils.createBufferInfoFromArrays(gl, array_provetta)
    texture_provetta= loadTextureFromImg("../oggetti/blue.jpeg")
}

//occhio
function loadMouse(){
    loadObj("../oggetti/eyeball.obj")
    const array_occhio= {
        position: {numComponents: 3, data: webglVertexData[0],},
        texcoord: {numComponents: 2, data: webglVertexData[1],},
        normal: {numComponents: 3, data: webglVertexData[2],},
    }
    bufferInfo_mouse= webglUtils.createBufferInfoFromArrays(gl, array_occhio)
    texture_mouse= loadTextureFromImg("../oggetti/Eye_D.jpg")
}

function loadSkybox(){
    texture_skybox= loadSkyboxTexture()
    bufferInfo_skybox= webglUtils.createBufferInfoFromArrays(gl, {position: {data: new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,]), numComponents: 2,},});
    console.log("bufferInfo_skybox", texture_skybox)
}
