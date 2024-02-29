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
    loadGlasses()
    loadProvetta()
    loadPavimento()
    loadSkybox()
    loadOcchio()
}

function loadPavimento(){
    const S= 70;
    const H= 0;
    const textureCoords= [0, 0, 1, 0, 0, 1, 1, 1];
    const arrays_floor= {
        position: {numComponents: 3, data: [-S, H, -S, S, H, -S, -S, H, S, S, H, S], },
        texcoord: {numComponents: 2, data: textureCoords, },
        indices: {numComponents: 3, data:[0, 2, 1, 2, 3, 1, ],},
        normal: {numComponents: 3, data:[0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,],},
    };
    bufferInfo_pavimento= webglUtils.createBufferInfoFromArrays(gl, arrays_floor);
    texture_pavimento= loadTextureFromImg("../oggetti/pavimento.jpeg")
    console.log("bufferInfo_pavimento", bufferInfo_pavimento)
}

function loadGlasses(){
    loadObj("../oggetti/nemico.obj")
    const glasses_array={
        position: {numComponents: 3, data: webglVertexData[0],},
        texcoord: {numComponents: 2, data: webglVertexData[1],},
        normal: {numComponents: 3, data: webglVertexData[2],},
    }
    bufferInfo_glasses= webglUtils.createBufferInfoFromArrays(gl, glasses_array)
    texture_glasses= loadTextureFromImg("../oggetti/fototessera.JPG")
}

function loadProvetta(){
    loadObj("../oggetti/provetta.obj")
    const array_provetta= {
        position: {numComponents: 3, data: webglVertexData[0],},
        texcoord: {numComponents: 2, data: webglVertexData[1],},
        normal: {numComponents: 3, data: webglVertexData[2],},
    }
    bufferInfo_provetta= webglUtils.createBufferInfoFromArrays(gl, array_provetta)
    texture_provetta= loadTextureFromImg("../oggetti/collirio.png")
}

//occhio
function loadOcchio(){
    loadObj("../oggetti/occhio.obj")
    const array_occhio= {
        position: {numComponents: 3, data: webglVertexData[0],},
        texcoord: {numComponents: 2, data: webglVertexData[1],},
        normal: {numComponents: 3, data: webglVertexData[2],},
    }
    bufferInfo_mouse= webglUtils.createBufferInfoFromArrays(gl, array_occhio)
    texture_mouse= loadTextureFromImg("../oggetti/occhio.jpeg")
}

function loadSkybox(){
    texture_skybox= loadSkyboxTexture()
    bufferInfo_skybox= webglUtils.createBufferInfoFromArrays(gl, {position: {data: new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,]), numComponents: 2,},});
    console.log("bufferInfo_skybox", texture_skybox)
}
