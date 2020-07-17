//icons by Eucalyp at flaticon

/* Imports */
// import * as THREE from '/node_modules/three/src/Three.js';
import * as THREE from '/js/three.js';
import { GLTFLoader } from '/js/GLTFLoader.js';
import { OrbitControls } from '/js/OrbitControls.js';

/**
 * Variables and Events related to three.js Laboratory Scene
 */

/* Globals scene and camera */
var sceneState = "lab";
var scene = new THREE.Scene();
var winHeight = document.getElementById("main").offsetHeight;
var winWidth = document.getElementById("main").offsetWidth;

var canvasRef = document.querySelector('#canvasthree');

//Renderer creation and general settings definition
var renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvasRef
});
renderer.setClearColor( 0xC5C5C3 );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( winWidth, winHeight );
renderer.gammaOutput = true;

//Camera creation
//Angle, AspectRatio, Min and Max Length
var camera = new THREE.PerspectiveCamera( 60, winWidth / winHeight, 1, 50 );

//Mouse controls defined here
// var controls = new OrbitControls( camera, renderer.domElement );
// controls.enabled = false; //Mouse should be ruled by Clicking

var cameraZoom = "Bancada";
function setCameraPosition() { //TODO: https://github.com/tweenjs/tween.js/
    //others: https://jsfiddle.net/f2Lommf5/13374/
    //https://discourse.threejs.org/t/camera-in-front-of-an-object/4047
    if (cameraZoom === "Bancada") {
        // camera.rotation.z = 90 * Math.PI / 180; //https://github.com/mrdoob/three.js/issues/730
        camera.zoom = 1;
        camera.position.set( 4.5, 6, -1 );
        camera.rotation.z = 1.5707963267948966; //cant explain this, lol
        camera.rotation.y = 1.0471975511965976; //like looking up and down with your neck
        camera.rotation.x = -1.5707963267948966;//like neck to shoulders
        camera.updateProjectionMatrix();
    } else if (cameraZoom === "Rack") {
        camera.zoom = 5;
        camera.position.set( 4.5, 6, -0.5 );
        camera.rotation.z = 1.5707963267948966;
        camera.rotation.y = 1.0471975511965976;
        camera.rotation.x = -1.5707963267948966;
        camera.updateProjectionMatrix();
    } else if (cameraZoom === "Termociclador") {
        camera.zoom = 3;
        camera.position.set( 4.5, 6, -3 );
        camera.rotation.z = 1.5707963267948966;
        camera.rotation.y = 0.95;
        camera.rotation.x = -1.5707963267948966;
        camera.updateProjectionMatrix();
    } else if (cameraZoom === "Balde de Gelo" || cameraZoom === "Gelo") {
        camera.zoom = 3;
        camera.position.set( 5.5, 6, 1.5 );
        camera.rotation.z = 1.5707963267948966;
        camera.rotation.y = 1.0471975511965976;
        camera.rotation.x = -1.5707963267948966;
        camera.updateProjectionMatrix();
    }
}

setCameraPosition();
scene.add(camera);

//Lights definition
var ambientLight = new THREE.AmbientLight( 0xffffff );
var directionalLight = new THREE.DirectionalLight( 0xffffff );
directionalLight.position.set( 0, 1, 1 ).normalize();

//Lights added to scene
scene.add( ambientLight );
scene.add( directionalLight );

// Hoverable objects which mouse gets Cursor
var sceneObjs = [];
var sceneFilterObjs = [];
//Allowable clickable objects names for later parsing
var sceneObjsNames = ["Table",  "TableCube",  "Thermocycler",  "Themocube",  "Rack",  "RackObj",  "Eppendorf001",  "Eppendorf002",  "Eppendorf003",  "Eppendorf004",  "Eppendorf005",  "Eppendorf006",  "Eppendorf007",  "Eppendorf008",  "Eppendorf009",  "Eppendorf010",  "Eppendorf011",  "Eppendorf012",  "Eppendorf013",  "EpCylinder001",  "EpCylinder002",  "EpCylinder003",  "EpCylinder004",  "EpCylinder005",  "EpCylinder006",  "EpCylinder007",  "EpCylinder008",  "EpCylinder009",  "EpCylinder010",  "EpCylinder011",  "EpCylinder012",  "EpCylinder013",  "Eppendorf",  "EpCylinder",  "Icebox",  "IceBoxCube",  "Ice",  "IceCubes"];
var numberPattern = /\d+/g;
var tubeDictionary = {
    "0" : "Vazio",
    "001": "Vazio",
    "002": "Vazio",
    "003": "Vazio",
    "004": "DNA alvo",
    "005": "dGTP",
    "006": "dATP",
    "007": "dCTP",
    "008": "dTTP",
    "009": "DNA Polimerase",
    "010": "ddGTP", //G
    "011": "ddATP", //A
    "012": "ddCTP", //C
    "013": "ddTTP", // T
}

// Mouse raycasting registering
var raycaster = new THREE.Raycaster();
// Mouse position registering
var mouse = new THREE.Vector2();

//Blender Scene Loading Object
var loader = new GLTFLoader();
loader.load( 'scene/Lab_plain.glb', function ( gltf ) { //Blender Scene Loading function
    gltf.scene.scale.set( 2, 2, 2 );			   
    gltf.scene.position.x = 0;				    //Position (x = right+ left-) 
    gltf.scene.position.y = 0;				    //Position (y = up+, down-)
    gltf.scene.position.z = 0;
    scene.add( gltf.scene );

    // console.log(gltf.scene); // THREE.Group
    // console.log(gltf.scenes); // Array<THREE.Group>
    // console.log(gltf.cameras); // Array<THREE.Camera>
    // console.log(gltf.asset); // Object

    //After Objects are passed from Blender to Scene, they are saved here
    scene.traverse(function(child) {
        if (child.type === "Group" && sceneObjsNames.indexOf(child.name) !== -1) {
            //get all children of group and append to sceneFilterObjs
            console.log(child)
            sceneFilterObjs.push(...child.children)
        } else if (child.type === "Mesh" && sceneObjsNames.indexOf(child.name) !== -1) {
            //append directly to sceneFilterObjs
            sceneFilterObjs.push(child);
        }
        // child.material = ClassMaterial; //apply same material to all meshes
    });
    console.log(sceneFilterObjs);
    // camera.lookAt( sceneObjs[0].position );
    scene.getObjectByName("Bench");
},
function ( xhr ) { // called while loading is progressing
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
}, function ( error ) { // called if error
    console.error( error );
} );


function onMouseMove( event ) { //Mouseover function https://stackoverflow.com/questions/24035234/three-js-raycast-off-from-mouse-position
    let canvas = document.querySelector('canvas');
    mouse.x = (event.offsetX / canvas.clientWidth) * 2 - 1;
    mouse.y = -(event.offsetY / canvas.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera)
    var intersects = raycaster.intersectObjects(sceneFilterObjs, false) //array
    // console.log(intersects);
    if (intersects.length > 0 && sceneState === "lab") {
        //the object of interest is the closest one to the ray bzzzzzzz
        let objectOfInterest = intersects[0];
        let realName;
        let nameAddition = "";
        if (objectOfInterest.object.name.includes("Ep")) {
            realName = "Eppendorf";
            let number = objectOfInterest.object.name.match(numberPattern);
            number = number[0]
            nameAddition = " " + tubeDictionary[number + ""];
        } else if (objectOfInterest.object.name.includes("IceBox")) {
            realName = "Balde de Gelo";
        }  else if (objectOfInterest.object.name.includes("Ice")) {
            realName = "Gelo";
        } else if (objectOfInterest.object.name.includes("Themo")) {
            realName = "Termociclador";
        } else if (objectOfInterest.object.name.includes("Table")) {
            realName = "Bancada";
        } else if (objectOfInterest.object.name.includes("Rack")) {
            realName = "Rack";
        }
        document.getElementById("tooltip").style.display = "";
        document.getElementById("tooltip").style.top = (event.clientY + 30) + "px";
        document.getElementById("tooltip").style.left = (event.clientX + 30) + "px";
        document.getElementById("tooltip").textContent = realName + nameAddition;
        document.getElementsByTagName("body")[0].style.cursor = 'pointer';
        // if (realName !== "Eppendorf") {
            // document.getElementsByTagName("body")[0].className = 'cursor_search';
        // } else {
            // document.getElementsByTagName("body")[0].className = 'cursor_pipette';
        // }
        // 	
    } else {
        document.getElementById("tooltip").style.display = "none";
        document.getElementById("pipettingtooltip").style.display = "none";
        // document.getElementsByTagName("body")[0].className = "";
        document.getElementsByTagName("body")[0].style.cursor = 'default';
        if (sceneState === "pipette") {
            if (event.target.classList.contains("eppendorf_hoverable") ) {
                document.getElementById("pipettingtooltip").style.display = "";
                document.getElementById("pipettingtooltip").style.top = (event.clientY + 30) + "px";
                document.getElementById("pipettingtooltip").style.left = (event.clientX + 30) + "px";
                document.getElementById("pipettingtooltip").textContent = "Conteúdo: " + tubeDictionary[event.target.edata];
            }
        }
    }
}
function onMouseClick(event) {
    let canvas = document.querySelector('canvas');
    mouse.x = (event.offsetX / canvas.clientWidth) * 2 - 1;
    mouse.y = -(event.offsetY / canvas.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera)
    var intersects = raycaster.intersectObjects(sceneFilterObjs, false) //array
    // console.log(intersects);
    if (intersects.length > 0 && sceneState === "lab") {
        //the object of interest is the closest one to the ray bzzzzzzz
        let objectOfInterest = intersects[0];
        let realName;
        console.log(objectOfInterest);
        if (objectOfInterest.object.name.includes("Ep")) {
            realName = "Eppendorf";
        } else if (objectOfInterest.object.name.includes("IceBox")) {
            realName = "Balde de Gelo";
        }  else if (objectOfInterest.object.name.includes("Ice")) {
            realName = "Gelo";
        } else if (objectOfInterest.object.name.includes("Themo")) {
            realName = "Termociclador";
        } else if (objectOfInterest.object.name.includes("Table")) {
            realName = "Bancada";
        } else if (objectOfInterest.object.name.includes("Rack")) {
            realName = "Rack";
        }
        if (realName !== "Eppendorf") {
            cameraZoom = realName;
            setCameraPosition();
        } else {
            //add test if tube is correct tube for scene
            let nameAddition = "";
            let number = objectOfInterest.object.name.match(numberPattern);
            number = number[0] + "";
            // nameAddition = " " + tubeDictionary[number + ""];
            //open eppendorf floating transfer dialog
            let parenttype = "rack";
            if (arrayRack.indexOf(number) === -1) {
                parenttype = "icebox";
            }
            openPipetteDialog(number, parenttype);
        }
    }
}

let commitValue = null;
let checkBoxCheck = false;

let expectedState = 0;
let arrayRack = ["0", "001", "002", "003"];
let expectedStates = [
    {
    "allowed": {"Vazio": [0, 4], "DNA alvo": [0, 4]},
    "true": {"Vazio": 0, "DNA alvo": 4}
    },
    {
    "allowed": {"DNA alvo": [4, 4], "dATP": [0, 4], "dGTP": [0, 4], "dCTP": [0, 4],  "dTTP": [0, 4] },
    "true": {"DNA alvo": 4, "dATP": 4, "dGTP": 4, "dCTP": 4, "dTTP": 4}
    },
    {
    "allowed": {"DNA alvo": [4, 4], "dATP": [4, 4], "dGTP": [4, 4], "dCTP": [4, 4],  "dTTP": [4, 4], "ddATP": [0, 1], "ddGTP": [0, 1], "ddCTP": [0, 1],  "ddTTP": [0, 1] },
    "true": {"DNA alvo": 4, "dATP": 4, "dGTP": 4, "dCTP": 4, "dTTP": 4, "ddATP": 1, "ddGTP": 1, "ddCTP": 1, "ddTTP": 1}
    },
    {
    "allowed": {"DNA alvo": [4, 4], "dATP": [4, 4], "dGTP": [4, 4], "dCTP": [4, 4],  "dTTP": [4, 4], "ddATP": [1, 1], "ddGTP": [1, 1], "ddCTP": [1, 1],  "ddTTP": [1, 1], "DNA Polimerase": [0, 4] },
    "true": {"DNA alvo": 4, "dATP": 4, "dGTP": 4, "dCTP": 4, "dTTP": 4, "ddATP": 1, "ddGTP": 1, "ddCTP": 1, "ddTTP": 1, "DNA Polimerase": 4}
    },
]

function closePipetteDialog() {
    console.log(checkBoxCheck);
    if (checkBoxCheck === true) {
        //below get all checkboxes
        var checkboxes = document.querySelectorAll('.einside');
        for (let z = 0; z < checkboxes.length; z++) {
            //below get each checkbox
            let item = checkboxes[z];
            //below if checkbox is checked
            if (item.checked === true) {
                console.log("true checked");
                //below if tube is empty
                if (tubeDictionary[item.edata] === "Vazio") {
                    //add substance to rack eppendorf of checkbox
                    tubeDictionary[item.edata] = commitValue;
                    console.log("added");
                //below if tube is NOT empty
                } else if (tubeDictionary[item.edata].includes(commitValue) === false) {
                    //add substance to rack eppendorf of checkbox
                    tubeDictionary[item.edata] += ", " + commitValue;
                    console.log("added");
                }
            }
        }
        //verify if state is the expected state
        var verifyAllowedStates = expectedStates[expectedState]["allowed"];
        var verifyTrueStates = expectedStates[expectedState]["true"];
        var verified = "true";
        console.log("expectedState");
        console.log(expectedState);
        console.log("expectedStates[expectedState]['allowed']");
        console.log(expectedStates[expectedState]["allowed"]);

        //below for each substance allowed in tubes
        for (const stateKey in expectedStates[expectedState]["allowed"]) {
            console.log("stateKey");
            console.log(stateKey);
            if (expectedStates[expectedState]["allowed"].hasOwnProperty(stateKey)) {
                console.log("yes")
                let count = 0;
                //below for each eppendorf tube of the rack
                for (let i = 0; i < arrayRack.length; i++) {
                    let tubeEl = tubeDictionary[arrayRack[i]];
                    let tubeAllEls = tubeEl.split(", ");
                    console.log("tubeAllEls");
                    console.log(tubeAllEls);
                    for (const eachWord of tubeAllEls) {
                        // console.log("stateKey");
                        // console.log(stateKey);
                        //below adds to substance count if substance is in rack eppendorf 
                        // if (eachWord.includes(stateKey)) {
                        if (eachWord === stateKey) {
                            count += 1;
                        //below checks if current substance is not allowed in tube
                        } else if (expectedStates[expectedState]["allowed"].hasOwnProperty(eachWord) === false) {
                            console.log("eachWord");
                            console.log(eachWord);
                            verified = "false";
                            break;
                        }
                    }
                    //if there is a non allowed substance, break
                    if (verified === "false") {
                        break;
                    }
                }
                //if there is a non allowed substance, break
                if (verified === "false") {
                    break;
                }
                //verify if current substance is in allowed count in the tubes
                if (count !== expectedStates[expectedState]["true"][stateKey]) {
                    verified = "allowed";
                }
                //verify if there is excess or shortage of something in tube
                if (count < expectedStates[expectedState]["allowed"][stateKey][0] || count > expectedStates[expectedState]["allowed"][stateKey][1]) {
                    verified = "false";
                    break;
                }
            }
        }
        //if there is a non allowed substance or there is too much or too little of a substance, gameover
        if (verified === "false") {
            console.log("verified");
            console.log(verified);
            console.log("verifyAllowedStates");
            console.log(verifyAllowedStates);
            console.log("tubeDictionary");
            console.log(tubeDictionary);
            sceneState = "gameover";
            showGameOver();
        //if verified is 'allowed' pass
        } else if (verified === "allowed") {
            sceneState = "lab";
        //if verified is 'true', go to next scene
        } else if (verified === "true") {
            expectedState += 1;
            updateFrame();
        }
    } else {
        sceneState = "lab";
    }
    document.getElementById("pipettingdiv").style.display = "none";
    checkBoxCheck = false;
    commitValue = null;
}

function showGameOver() {
    alert("Game Over! Cuidado ao Pipetar!");
}

function openPipetteDialog(number, parenttype) {
    //microtubes https://www.labicons.net/microcentrifuge-tubes/conical-eppendorf/doc/conical-eppendorf-v5.html
    let pipetteDiv = document.getElementById("pipettingdiv");
    pipetteDiv.style.display = "flex";

    sceneState = "pipette";
    //reset pipettingdiv contents
    pipetteDiv.innerHTML = "";
    //add center div with white background and black border
    let centerDiv = document.createElement("div");
    centerDiv.className = "centerPipette";
    if (parenttype === "rack") {
        checkBoxCheck = false;
        commitValue = null;
        //show single rack contents
        let centerLi = document.createElement("div");
        centerLi.className = "center_li";
        let i = 1;
        for (const key of arrayRack) {
            let ulEl = document.createElement("span");
            ulEl.className = "eppendorf_el eppendorf_hoverable";
            ulEl.edata = key;
            // eppendorf_hoverable
            // edata

            let ulEl1Img = document.createElement("img");
            ulEl1Img.className = "eppendorf_img eppendorf_hoverable";
            ulEl1Img.edata = key;
            ulEl1Img.style.maxWidth = "10%";
            // max-width: 20%;
            ulEl1Img.src = "./eppendorf-conical.png"
            ulEl.appendChild(ulEl1Img);

            // let ulEl = document.createElement("ul");

            let ulEl_txt = document.createElement("span");
            ulEl_txt.className = "eppendorf_hoverable";
            ulEl_txt.edata = key;
            ulEl_txt.textContent = "Eppendorf " + i + " da Rack";

            ulEl.appendChild(ulEl_txt);
            centerLi.appendChild(ulEl);

            let br_el = document.createElement("br");
            centerLi.appendChild(br_el);

            i += 1;
        }
        centerDiv.appendChild(centerLi);
    } else {
        //show rack and icebox contents
        //show single rack contents
        commitValue = tubeDictionary[number + ""];
        checkBoxCheck = true;

        let leftLi = document.createElement("div");
        leftLi.className = "left_li";
        
        let ulEl2 = document.createElement("span");
        ulEl2.className = "eppendorf_el eppendorf_hoverable";
        ulEl2.edata = number;
        
        let ulEl2Img = document.createElement("img");
        ulEl2Img.className = "eppendorf_img eppendorf_hoverable";
        ulEl2Img.edata = number;
        ulEl2Img.style.maxWidth = "20%";
        ulEl2Img.src = "./eppendorf-conical-v5.png"
        ulEl2.appendChild(ulEl2Img);

        let ulEl2_txt = document.createElement("span");
        ulEl2_txt.className = "eppendorf_hoverable";
        ulEl2_txt.edata = number;
        ulEl2_txt.textContent = " Eppendorf contendo " + tubeDictionary[number + ""] ;

        ulEl2.appendChild(ulEl2_txt);
        leftLi.appendChild(ulEl2);

        let centerLi = document.createElement("div");
        centerLi.className = "center_li2";
        
        let centerImg = document.createElement("img");
        centerImg.className = "pipette_btnimg";
        centerImg.src = "./pipette_big.png"
        centerLi.appendChild(centerImg);

        let rightLi = document.createElement("div");
        rightLi.className = "right_li";
        let i = 1;
        for (const key of arrayRack) {
            let ulEl = document.createElement("span");
            ulEl.className = "eppendorf_el eppendorf_hoverable";
            ulEl.edata = key;

            let ulCheck = document.createElement("input");
            ulCheck.type = "checkbox";
            ulCheck.className = "eppendorf_hoverable einside";
            ulCheck.edata = key;
            ulCheck.id = "ep_" + key;
            ulEl.appendChild(ulCheck);
        
            let ulEl1Img = document.createElement("img");
            ulEl1Img.className = "eppendorf_img eppendorf_hoverable";
            ulEl1Img.edata = key;
            ulEl1Img.style.maxWidth = "20%";
            ulEl1Img.src = "./eppendorf-conical.png"
            ulEl.appendChild(ulEl1Img);

            let ulEl_txt = document.createElement("span");
            ulEl_txt.className = "eppendorf_hoverable";
            ulEl_txt.edata = key;
            ulEl_txt.textContent = "Eppendorf " + i + " da Rack";

            ulEl.appendChild(ulEl_txt);

            rightLi.appendChild(ulEl);

            let br_el = document.createElement("br");
            rightLi.appendChild(br_el);

            i += 1;
        }
        
        centerDiv.appendChild(leftLi);
        centerDiv.appendChild(centerLi);
        centerDiv.appendChild(rightLi);

    }

    let bottomLi = document.createElement("div");
    bottomLi.className = "bottom_li";
    let okBtn = document.createElement("button");
    okBtn.id = "okpipette";
    okBtn.textContent = "Pipetar";
    if (parenttype === "rack") {
        okBtn.textContent = "Fechar";
    }
    okBtn.addEventListener("click", closePipetteDialog);
    bottomLi.appendChild(okBtn);
    centerDiv.appendChild(bottomLi);
    pipetteDiv.appendChild(centerDiv);

}

var characters = 'ATCG';
function makeSequence(length) {
    var result = '';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 
var sangerResult = null;

function answerSanguer() {
    //get content of input, compare to sanguerResult
    var userResult = document.getElementById("answerSanguerRes").value;
    if (userResult === sangerResult) {
        console.log("RIGHT!");
        updateFrame();
    } else {
        console.log("WRONG!");
        alert("Tente novamente!")
    }
}

function generateEletrophoresisSanguer() {
    let d3CanvasDiv = document.getElementById("d3div_id");

    //get height and width of div
    var d3height = d3CanvasDiv.clientHeight;

    var yScale = d3.scaleLinear()
        .domain([0,sangerResult.length])
        .range([60,d3height]);
    
    var d3width = d3CanvasDiv.clientWidth;

    // var bandWidth = d3width / (characters.length * 2);
    var bandWidth = 120;

    var xScale = d3.scaleLinear()
        .domain([0,(characters.length*2)+1])
        .range([0,d3width]);
    
    var jsonRects = [];

    var sanguerData = sangerResult.split("").reverse().join("");
    for (let i = 0; i < sanguerData.length; i++) {
        let character = sanguerData[i];
        jsonRects.push({
            "char": character,
            "x": xScale( (characters.indexOf(character)*2)+1 ),
            "y": yScale(i)
        });
    }
    
    var svgContainer = d3.select("#d3div_id")
        .append("svg")
        .attr("id", "d3svg")
        .attr("width", d3width)
        .attr("height", d3height);
    
    svgContainer.append("text")
        .attr("x", function () { return xScale(1) + 15 } )
        .attr("y", "30" )
        .text( "A" )
        .attr("font-family", "sans-serif")
        .attr("font-size", "30px");
    svgContainer.append("text")
        .attr("x", function () { return xScale(3) + 15 } )
        .attr("y", "30" )
        .text( "T" )
        .attr("font-family", "sans-serif")
        .attr("font-size", "30px");
    svgContainer.append("text")
        .attr("x", function () { return xScale(5) + 15 } )
        .attr("y", "30" )
        .text( "C" )
        .attr("font-family", "sans-serif")
        .attr("font-size", "30px");
    svgContainer.append("text")
        .attr("x", function () { return xScale(7) + 15 } )
        .attr("y", "30" )
        .text( "G" )
        .attr("font-family", "sans-serif")
        .attr("font-size", "30px");
    
    var rects = svgContainer.selectAll("rect")
        .data(jsonRects)
        .enter()
        .append("rect");
    
    var rectAttributes = rects.attr("x", function (d) { return d.x; })
        .attr("y", function (d) { return d.y; })
        .attr("width", bandWidth)
        .attr("height", 15)

}

function openSangerResultsDialog() { //TODO: Open Sanger Results Dialog
    let sanguerDiv = document.getElementById("sangerresults");
    sanguerDiv.style.display = "";
    sangerResult = makeSequence(15);
    console.log(sangerResult);
    sanguerDiv.style.display = "flex";

    //reset sanguerDiv contents
    sanguerDiv.innerHTML = "";
    //add center div with white background and black border
    let centerDiv = document.createElement("div");
    centerDiv.className = "centerSanguer";

    //TODO Add random Sanger with d3.js
    let d3CanvasDiv = document.createElement("div");
    d3CanvasDiv.id = "d3div_id"
    d3CanvasDiv.className = "d3div";

    let bottomTxtLi = document.createElement("div");
    bottomTxtLi.className = "sanger_row";
    let inputText = document.createElement("input");
    inputText.id = "answerSanguerRes"
    inputText.type = "text";
    bottomTxtLi.appendChild(inputText);

    let bottomLi = document.createElement("div");
    bottomLi.className = "sanger_row";
    // bottomLi.className = "bottom_li";
    let okBtn = document.createElement("button");
    okBtn.textContent = "Responder";
    okBtn.addEventListener("click", answerSanguer);
    bottomLi.appendChild(okBtn);

    centerDiv.appendChild(d3CanvasDiv);
    centerDiv.appendChild(bottomTxtLi);
    centerDiv.appendChild(bottomLi);
    sanguerDiv.appendChild(centerDiv);
    generateEletrophoresisSanguer();
}


function openFinalQuestionsDialog() { //TODO: Open Questions Dialog
    document.getElementById("questions").style.display = "";
}

//Mouseover function registering
window.addEventListener( 'mousemove', onMouseMove, false )
window.addEventListener( 'click', onMouseClick, false )

function animate() { //Rendering function on screen
    requestAnimationFrame( animate );
    raycaster.setFromCamera( mouse, camera ); //raycasting registering
    renderer.render( scene, camera );
}
//Rendering function startup
animate();

/**
 * Functions related to Screen Dialog Events 
 */


/* Global currentFrame */
let currentFrame = 0;

/* Global textArray */
let textArray = [
    "Hoje realizaremos um protocolo para o sequenciamento de Sanguer em nosso Laboratório Virtual",
    "Este protocolo foi inicialmente desenvolvido em 1977 por Frederick Sanger e seus colaboradores",
    "Foi considerado tão revolucionário na época que levou Sanger a ganhar o Prêmio Nobel de Química em 1980!",
    "Sendo suas formas automatizadas muito utilizadas durante o Projeto Genoma Humano",
    "Ainda hoje este método é considerado o Padrão Ouro de sequenciamento",
    "O protocolo simulado aqui é uma versão simplificada e atualizada do procedimento",
    "Nada substitui a verdadeira prática, mas espero poder passar uma noção da metodologia aqui",
    "Você pode notar que do lado direito da tela temos um laboratório virtual",
    "Ao clicar em um objeto do Laboratório, você dá zoom no mesmo",
    "Ao clicar em um Eppendorf da Rack, você vê o conteúdo dos mesmos",
    "Já um clique nos Eppendorfs da Caixa de Gelo, permite pode pipetar o conteúdo do mesmos para os Eppendorfs da Rack",
    "Vamos lá! Comece pipetando o DNA que queremos sequenciar da Caixa de Gelo, para todos os 4 tubos da Rack",

    "Muito bem! Agora iremos pipetar dATP, dCTP, dGTP e dTTP para todos os 4 tubos da Rack",
    "Estes nucleotídeos irão permitir o prolongamento do nosso DNA alvo quando ele for amplificado pela DNA Polimerase",
    "Vou deixar você trabalhando enquanto faço um café!",

    "Ótimo! Agora adicione ddATP em SOMENTE UM dos Eppendorfs. ddGTP em SOMENTE UM dos Eppendorfs.",
    "ddCTP em SOMENTE UM dos Eppendorfs. E ddTTP em SOMENTE UM dos Eppendorfs",
    "Esses didesoxirribonucleosídeos não possuem o grupo 3’-OH e portanto causam a parada do prolongamento",
    "do DNA Alvo durante sua amplificação pela DNA Polimerase",
    "Eles são incorporados aleatoriamente, por isso cadeias de diferentes tamanhos são geradas durante a amplificação!",
    "Lembrando: adicione ddATP em SOMENTE UM dos Eppendorfs. ddGTP em SOMENTE UM dos Eppendorfs.",
    "ddCTP em SOMENTE UM dos Eppendorfs. E ddTTP em SOMENTE UM dos Eppendorfs",

    "Perfeito! Podemos prosseguir para o último passo que é a adição da DNA Polimerase nos quatro tubos",
    "Esta é a enzima que irá realizar a reação de prolongamento do nosso DNA Alvo",


    "Agora iremos adicionar os quatro tubos ao termociclador.",
    "Inicialmente o DNA será aquecido a uma temperatura elevada capaz de quebrar sua dupla hélice",
    "Em seguida, o Primer adicionado irá se ligar ao DNA fita simples se hibridizando",
    "Desoxirribonucleosídeos ou didesoxirribonucleosídeos serão incorporados aleatoriamente",
    "Quando um didesoxirribonucleosídeo for incorporado em uma cadeia, a reação termina",
    "Em cada um dos Eppendorfs haverá parada em somente um nucleotídeo: A, T, C ou G",
    "Após diversos ciclos de prolongamento, utilizaremos um gel de eletroforese para separar o DNA por tamanho",
    "Acho que já discutimos essa técnica anteriormente, certo?",
    "O conteúdo de cada um dos Eppendorfs irá correr em um poço diferente",
    "Após o final da corrida, o gel será revelado e poderemos deduzir a sequência do DNA alvo a partir",
    "do tamanho dos fragmentos interrompidos por diferentes ddNTPs",
    "Vamos lá! Escreva qual a sequência obtida no Gel a seguir. Lembre-se de Escrever a sequência no sentido 5' -> 3' ",
    
    // "Excelente. Estamos quase lá. Responda agora duas perguntas de múltipla escolha sobre o Sequenciamento de Sanger e podemos encerar o dia!",

    "Parabéns! Você brilhou! Espero que tenha aprendido bastante.",

    // "#começar falando dos materiais necessários",
    // "#iniciar procedimento pipetando polimerase nos 4 tubos contendo dna já amplificado",
    // "#continuar procedimento pipetando o primer marcado radiativamente ou fluorescentemente",
    // "#falar sobre como primer pode afetar a técnica",
    // "#continuar pipetando os ddNTPs e NTPs",
    // "#falar das diferenças entre a incorporação de ddNTPs e NTPs",
    // "#falar do termociclador utilizado para a amplificação do dna",
    // "#passagem de tempo",
    // "#falar brevemente sobre a eletroforese",
    // "#falar brevemente sobre a leitura dos fragmentos",
    // "#pedir para o aluno completar a sequência (gerada aleatoriamente)",
    // "#fazer perguntas para o aluno sobre a metodologia e dar a nota final",
]

/* Global msgDetails */
let msgDetails = [
    // {"type": "showSanger"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "showLab"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "showLab"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "showLab"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "showLab"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "updateMessage"},
    {"type": "showSanger"},
    // {"type": "updateMessage"},
    // {"type": "showQuestions"},
    {"type": "updateMessage"},
]


function updateText() {
    //get dialog and dialog value
    let dialogHeader = document.getElementById("dialogo")
    let currentValue = parseInt(dialogHeader.getAttribute("value"))
    //set new dialog text and value
    currentValue = currentValue + 1
    let text = textArray[currentValue]
    //update dialog text and value
    dialogHeader.textContent = text
    dialogHeader.setAttribute("value", currentValue + "")
    if (currentValue === textArray.length-1) {
        document.getElementById("nextbtn").style.display = "none";

    }
}

function updateFrame() {
    //bound currentFrame limits
    document.getElementById("dialogbox").style.display = "none";
    document.getElementById("sangerresults").style.display = "none";
    document.getElementById("questions").style.display = "none";
    if (msgDetails[currentFrame]["type"] === "updateMessage") {
        document.getElementById("dialogbox").style.display = "";
        sceneState = "dialog";
        updateText();
    } else if (msgDetails[currentFrame]["type"] === "showLab") {
        //show lab
        sceneState = "lab";
        //pass
    } else if (msgDetails[currentFrame]["type"] === "showSanger") {
        document.getElementById("sangerresults").style.display = "";
        //show method
        sceneState = "sanger";
        openSangerResultsDialog();
        //pass
    } else if (msgDetails[currentFrame]["type"] === "showExplanation") {
        //show explanation
        sceneState = "explanation";
        //pass
    } else if (msgDetails[currentFrame]["type"] === "showQuestions") {
        document.getElementById("questions").style.display = "";
        //show explanation
        sceneState = "questions";
        openFinalQuestionsDialog();
        //pass
    }
    currentFrame += 1
}

/* Bind Click Event to Button */
document.getElementById("nextbtn").addEventListener("click", updateFrame);