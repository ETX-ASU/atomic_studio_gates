/*---------------------------------------------------------------------------------------------

    This will be broken up into several sections
    
    1. Define all the variables we'll be using
    2. Functionality between the object buttons, the slider, and the number input
    3. Eveything with actually drawing to the canvas
    4. Maybe CAPI stuff?

    Good luck... maybe one day I'll learn how to incorporate multiple JS files...

---------------------------------------------------------------------------------------------*/

/*----------------------------------
    Defining All the Variables
-----------------------------------*/

// Object buttons
let object_1_button = document.getElementById("object_1_button");
let object_2_button = document.getElementById("object_2_button");
let object_3_button = document.getElementById("object_3_button");
let object_4_button = document.getElementById("object_4_button");
let object_5_button = document.getElementById("object_5_button");

// Slider
let object_slider = document.getElementById("object_slider");

// Number Input
let object_num = document.getElementById("object_num");

// Total Number of Objects
let total_objects_output = document.getElementById("total_objects_output");

// Mini Splatter Image
let splatter_mini = document.getElementById("splatter_mini");

// Values for each object
let object_1_value = 0;
let object_2_value = 0;
let object_3_value = 0;
let object_4_value = 0;
let object_5_value = 0;

// Object Images
let splatter1 = new Image();
splatter1.src = "/images/object1.png";
let splatter2 = new Image();
splatter2.src = "/images/object2.png";
let splatter3 = new Image();
splatter3.src = "/images/object3.png";
let splatter4 = new Image();
splatter4.src = "/images/object4.png";
let splatter5 = new Image();
splatter5.src = "/images/object5.png";

// Canvas Stuff
let canvas = document.getElementById("atomic_canvas");
let canvas_container = document.getElementById("canvas_section");
let ctx = canvas.getContext("2d");

// For the position arrays
let objects1Graphed = 0;
let objects2Graphed = 0;
let objects3Graphed = 0;
let objects4Graphed = 0;
let objects5Graphed = 0;

let newTotal = 0;
let max = 100;
let object1Max = 0;
let object2Max;
let object3Max;
let object4Max;
let object5Max;

let objects1 = [];
let objects2 = [];
let objects3 = [];
let objects4 = [];
let objects5 = [];
let allObjects = [];

let [x, y] = [];

let selected_object = 1;
let popup = document.getElementById("myPopup");

/*----------------------------------------
    Mapping Slider and Number Input
-----------------------------------------*/
let newValue1 = 0;
let newValue2 = 0;
let newValue3 = 0;
let newValue4 = 0;
let newValue5 = 0;

object_slider.oninput = function () {
    popup.classList = "popuptext";
    if (selected_object == 1) {
        newValue1 = this.value;
        object_num.value = this.value;
        updateObject1();
    }
    if (selected_object == 2) {
        newValue2 = this.value;
        object_num.value = this.value;
        updateObject2();
    }
    if (selected_object == 3) {
        newValue3 = this.value;
        object_num.value = this.value;
        updateObject3();
    }
    if (selected_object == 4) {
        newValue4 = this.value;
        object_num.value = this.value;
        updateObject4();
    }
    if (selected_object == 5) {
        newValue5 = this.value;
        object_num.value = this.value;
        updateObject5();
    }
}

object_num.oninput = function () {
    popup.classList = "popuptext";
    if (selected_object == 1) {
        newValue1 = this.value;
        object_slider.value = this.value;
        updateObject1();
    }
    if (selected_object == 2) {
        newValue2 = this.value;
        object_slider.value = this.value;
        updateObject2();
    }
    if (selected_object == 3) {
        newValue3 = this.value;
        object_slider.value = this.value;
        updateObject3();
    }
    if (selected_object == 4) {
        newValue4 = this.value;
        object_slider.value = this.value;
        updateObject4();
    }
    if (selected_object == 5) {
        newValue5 = this.value;
        object_slider.value = this.value;
        updateObject5();
    }
}

function mapSlider() {
    // let selected = obj;
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("selected");
    }
    this.classList.toggle("selected");

    if (this.id == "object_1_button") {
        splatter_mini.setAttribute("src", "/images/object1.png");
        selected_object = 1;
        object_slider.value = object_1_value;
        object_num.value = object_slider.value;
        document.getElementById("object_name").innerHTML = object1Name;
    }
    if (this.id == "object_2_button") {
        splatter_mini.setAttribute("src", "/images/object2.png");
        selected_object = 2;
        object_slider.value = object_2_value;
        object_num.value = object_2_value;
        document.getElementById("object_name").innerHTML = object2Name;
    }
    if (this.id == "object_3_button") {
        splatter_mini.setAttribute("src", "/images/object3.png");
        selected_object = 3;
        object_slider.value = object_3_value;
        object_num.value = object_3_value;
        document.getElementById("object_name").innerHTML = object3Name;
    }
    if (this.id == "object_4_button") {
        splatter_mini.setAttribute("src", "/images/object4.png");
        selected_object = 4;
        object_slider.value = object_4_value;
        object_num.value = object_4_value;
        document.getElementById("object_name").innerHTML = object4Name;
    }
    if (this.id == "object_5_button") {
        splatter_mini.setAttribute("src", "/images/object5.png");
        selected_object = 5;
        object_slider.value = object_5_value;
        object_num.value = object_5_value;
        document.getElementById("object_name").innerHTML = object5Name;
    }
}
/*------------------------------
    The Canvas Stuff
------------------------------*/

// Set canvas dimensions based on the width of the container
canvas.width = canvas_container.clientWidth;
canvas.height = canvas_container.clientHeight;
let width = Math.floor(canvas.width / 20);
let height = Math.floor(canvas.height / 20);

function updateObject1() {
    object1Max = max - objects2.length - objects3.length - objects4.length - objects5.length;
    // object_1_value = document.getElementById("object_slider").value;
    // console.log("Object 1 Value: " + object_1_value);
    if (checkMax(newValue1, object1Max)) {
        popupError();
        console.log(object1Max);
        console.log(objects1.length);
        if (objects1.length == 0) {
            initialAdd(object1Max, objects1, objects1Graphed, splatter1);
        }
        if (objects1.length < object1Max) {
            addObjects(object1Max, objects1, objects1Graphed, splatter1);
        }
        // alert("You have placed the maximum number of objects on the canvas. Please remove some.");
        console.log("objects1.length: " + objects1.length);
        // popupError();
    } else {
        object_1_value = object_slider.value;
        if (objects1.length != 0) {
            if (object_1_value < objects1.length) {
                removeObjects(object_1_value, objects1);
            }
            if (object_1_value > objects1.length) {
                addObjects(object_1_value, objects1, objects1Graphed, splatter1);
            }
        }
        if (objects1.length == 0) {
            objects1 = [];
            objects1Graphed = 0;
            allObjects = [];
            allObjects = [...objects1, ...objects2, ...objects3, ...objects4, ...objects5];
            initialAdd(object_1_value, objects1, objects1Graphed, splatter1);
        }

    }
    allObjects = [];
    allObjects = [...objects1, ...objects2, ...objects3, ...objects4, ...objects5]
    document.getElementById("total_objects_output").innerHTML = allObjects.length;
}

function updateObject2() {
    object2Max = max - objects1.length - objects3.length - objects4.length - objects5.length;
    // object_1_value = document.getElementById("object_slider").value;
    // console.log("Object 1 Value: " + object_2_value);
    if (checkMax(newValue2, object2Max)) {
        popupError();
        console.log(object2Max);
        console.log(objects2.length);
        if (objects2.length == 0) {
            initialAdd(object2Max, objects2, objects2Graphed, splatter2);
        }
        if (objects2.length < object2Max) {
            addObjects(object2Max, objects2, objects2Graphed, splatter2);
        }
        // alert("You have placed the maximum number of objects on the canvas. Please remove some.");
        console.log("objects2.length: " + objects2.length);
        // popupError();
    } else {
        object_2_value = object_slider.value;
        if (objects2.length != 0) {
            if (object_2_value < objects2.length) {
                removeObjects(object_2_value, objects2);
            }
            if (object_2_value > objects2.length) {
                addObjects(object_2_value, objects2, objects2Graphed, splatter2);
            }
        }
        if (objects2.length == 0) {
            objects2 = [];
            objects2Graphed = 0;
            allObjects = [];
            allObjects = [...objects1, ...objects2, ...objects3, ...objects4, ...objects5];
            initialAdd(object_2_value, objects2, objects2Graphed, splatter2);
        }

    }
    allObjects = [];
    allObjects = [...objects1, ...objects2, ...objects3, ...objects4, ...objects5]
    document.getElementById("total_objects_output").innerHTML = allObjects.length;
}

function updateObject3() {
    object3Max = max - objects1.length - objects2.length - objects4.length - objects5.length;
    if (checkMax(newValue3, object3Max)) {
        popupError();
        console.log(object3Max);
        console.log(objects3.length);
        if (objects3.length == 0) {
            initialAdd(object3Max, objects3, objects3Graphed, splatter3);
        }
        if (objects3.length < object3Max) {
            addObjects(object3Max, objects3, objects3Graphed, splatter3);
        }
        console.log("objects3.length: " + objects3.length);
    } else {
        object_3_value = object_slider.value;
        if (objects3.length != 0) {
            if (object_3_value < objects3.length) {
                removeObjects(object_3_value, objects3);
            }
            if (object_3_value > objects3.length) {
                addObjects(object_3_value, objects3, objects3Graphed, splatter3);
            }
        }
        if (objects3.length == 0) {
            objects3 = [];
            objects3Graphed = 0;
            allObjects = [];
            allObjects = [...objects1, ...objects2, ...objects3, ...objects4, ...objects5];
            initialAdd(object_3_value, objects3, objects3Graphed, splatter3);
        }

    }
    allObjects = [];
    allObjects = [...objects1, ...objects2, ...objects3, ...objects4, ...objects5]
    document.getElementById("total_objects_output").innerHTML = allObjects.length;
}

function updateObject4() {
    object4Max = max - objects1.length - objects2.length - objects3.length - objects5.length;
    if (checkMax(newValue4, object4Max)) {
        popupError();
        console.log(object4Max);
        console.log(objects4.length);
        if (objects4.length == 0) {
            initialAdd(object4Max, objects4, objects4Graphed, splatter4);
        }
        if (objects4.length < object4Max) {
            addObjects(object4Max, objects4, objects4Graphed, splatter4);
        }
        console.log("objects4.length: " + objects4.length);
    } else {
        object_4_value = object_slider.value;
        if (objects4.length != 0) {
            if (object_4_value < objects4.length) {
                removeObjects(object_4_value, objects4);
            }
            if (object_4_value > objects4.length) {
                addObjects(object_4_value, objects4, objects4Graphed, splatter4);
            }
        }
        if (objects4.length == 0) {
            objects4 = [];
            objects4Graphed = 0;
            allObjects = [];
            allObjects = [...objects1, ...objects2, ...objects3, ...objects4, ...objects5];
            initialAdd(object_4_value, objects4, objects4Graphed, splatter4);
        }

    }
    allObjects = [];
    allObjects = [...objects1, ...objects2, ...objects3, ...objects4, ...objects5]
    document.getElementById("total_objects_output").innerHTML = allObjects.length;
}

function updateObject5() {
    object5Max = max - objects1.length - objects2.length - objects3.length - objects4.length;
    if (checkMax(newValue5, object5Max)) {
        popupError();
        console.log(object5Max);
        console.log(objects5.length);
        if (objects5.length == 0) {
            initialAdd(object5Max, objects5, objects5Graphed, splatter5);
        }
        if (objects5.length < object5Max) {
            addObjects(object5Max, objects5, objects5Graphed, splatter5);
        }
        console.log("objects5.length: " + objects5.length);
    } else {
        object_5_value = object_slider.value;
        if (objects5.length != 0) {
            if (object_5_value < objects5.length) {
                removeObjects(object_5_value, objects5);
            }
            if (object_5_value > objects5.length) {
                addObjects(object_5_value, objects5, objects5Graphed, splatter5);
            }
        }
        if (objects5.length == 0) {
            objects5 = [];
            objects5Graphed = 0;
            allObjects = [];
            allObjects = [...objects1, ...objects2, ...objects3, ...objects4, ...objects5];
            initialAdd(object_5_value, objects5, objects5Graphed, splatter5);
        }

    }
    allObjects = [];
    allObjects = [...objects1, ...objects2, ...objects3, ...objects4, ...objects5]
    document.getElementById("total_objects_output").innerHTML = allObjects.length;
}

function popupError() {
    popup.classList = "popuptext show";
}

function initialAdd(objectValue, objectArray, objectsGraphed, objectImg) {

    while (objectsGraphed < objectValue) {
        [x, y] = getRandomXY();
        if (objectsGraphed != 0) {
            if (!(checkExists())) {
                objectArray.push([x, y]);
                objectsGraphed++;
                allObjects = [...objects1, ...objects2, ...objects3, ...objects4, ...objects5];
            }
        }
        if (objectsGraphed == 0) {
            if (!(checkExists())) {
                objectArray.push([x, y]);
                objectsGraphed++;
            }
        }

        if (objectArray.length == objectValue) {
            for (let i = 0; i < objectArray.length; i++) {
                let location = objectArray[i];
                ctx.drawImage(objectImg, location[0], location[1], width, height);
                console.log(objects1Graphed);
            }
            console.log("objects graphed: " + objects1Graphed);
        }
    }
}

function checkMax(value, maxx) {
    if (value > maxx) {
        object_slider.value = maxx;
        object_num.value = object_slider.value;
        return true;
    }
}

function removeObjects(objectValue, objectArray) {
    let difference = objectArray.length - objectValue;
    for (let i = 0; i < difference; i++) {
        let index = objectArray.length - 1;
        let removeLocation = objectArray[index];
        ctx.clearRect(removeLocation[0], removeLocation[1], width, height);
        objectArray.pop()
    }
    allObjects = [...objects1, ...objects2, ...objects3, ...objects4, ...objects5];
}

function addObjects(objectValue, objectArray, objectsGraphed, objectImg) {
    objectsGraphed = objectArray.length;
    while (objectsGraphed < objectValue) {
        [x, y] = getRandomXY();
        if (objectsGraphed != 0) {
            if (!(checkExists())) {
                objectArray.push([x, y]);
                objectsGraphed++;
                allObjects = [...objects1, ...objects2, ...objects3, ...objects4, ...objects5];
            }
        }
        if (objectArray.length == objectValue) {
            for (let i = 0; i < objectArray.length; i++) {
                let location = objectArray[i];
                ctx.drawImage(objectImg, location[0], location[1], width, height);
            }
            allObjects = [...objects1, ...objects2, ...objects3, ...objects4, ...objects5];
        }

    }
}

function getRandomXY() {
    let xMin = 0;
    let xMax = canvas.width - (width);
    let x = Math.floor(Math.random() * (xMax - xMin + 1) + xMin);
    let yMin = 0;
    let yMax = canvas.height - (height);
    let y = Math.floor(Math.random() * (yMax - yMin + 1) + yMin);
    return [x, y];
}

function checkExists() {
    allObjects = [];
    allObjects = [...objects1, ...objects2, ...objects3, ...objects4, ...objects5];
    const exists = allObjects.some(subArray => {
        const [subX, subY] = subArray;
        const withinX = Math.abs(subX - x) <= width;
        const withinY = Math.abs(subY - y) <= height;
        return withinX && withinY;
    });
    if (exists) {
        // console.log('Array exists!!');
        return true;
    } else {
        // console.log("Array doesn't exist!");
        return false;
    }
}


/*------------------------------
    CAPI STUFF
------------------------------*/

console.log("Setting up CAPI");

let preventRecursion = false;

function capiHandler(name, value) {
    console.log(name, value);
    if (preventRecursion) {
        return;
    }
    preventRecursion = true;

    switch (name) {
        case 'numberObjects':
            break;

        case 'nameObject1':
            break;

        case 'nameObject2':
            break;

        case 'nameObject3':
            break;

        case 'nameObject4':
            break;

        case 'nameObject5':
            break;

        case 'objectsVisible':
            break;

        case 'objectsEnabled':
            break;

        case 'sliderVisible':
            break;

        case 'sliderEnabled':
            break;

        default:
            console.log(name, value);
            break;
    }

    preventRecursion = false;
}

let capi = {
    defaults: {
        numberObjects: 5,
        nameObject1: "obj1",
        nameObject2: "obj2",
        nameObject3: "obj3",
        nameObject4: "obj4",
        nameObject5: "obj5",
        objectsVisible: true,
        objectsEnabled: true,
        sliderVisible: true,
        sliderEnabled: true,
    },
    exposeWith: {
        numberObjects: {
            alias: "Objects.Number",
        },
        nameObject1: {
            alias: "Objects.Names.Object 1",
        },
        nameObject2: {
            alias: "Objects.Names.Object 2",
        },
        nameObject3: {
            alias: "Objects.Names.Object 3",
        },
        nameObject4: {
            alias: "Objects.Names.Object 4",
        },
        nameObject5: {
            alias: "Objects.Names.Object 5",
        },
        objectsVisible: {
            alias: "Objects.Visible",
        },
        objectsEnabled: {
            alias: "Objects.Enabled",
        },
        sliderVisible: {
            alias: "Slider.Visible",
        },
        sliderEnabled: {
            alias: "Slider.Enabled",
        },
    },
}

let atomicStudio = new simcapi.CapiAdapter.CapiModel(capi.defaults);

let totalObjects = atomicStudio.get("numberObjects");
let object1Name = atomicStudio.get("nameObject1");
let object2Name = atomicStudio.get("nameObject2");
let object3Name = atomicStudio.get("nameObject3");
let object4Name = atomicStudio.get("nameObject4");
let object5Name = atomicStudio.get("nameObject5");
let objectsVisible = atomicStudio.get("objectsVisible");
let objectsEnabled = atomicStudio.get("objectsEnabled");
let sliderVisible = atomicStudio.get("sliderVisible");
let sliderEnabled = atomicStudio.get("sliderEnabled");
updateWidgey();

function addListener(key) {
    atomicStudio.on("change:" + key, (atomicStudio, value) => {
        capiHandler(key, value);
        totalObjects = atomicStudio.get("numberObjects");
        object1Name = atomicStudio.get("nameObject1");
        object2Name = atomicStudio.get("nameObject2");
        object3Name = atomicStudio.get("nameObject3");
        object4Name = atomicStudio.get("nameObject4");
        object5Name = atomicStudio.get("nameObject5");
        objectsVisible = atomicStudio.get("objectsVisible");
        objectsEnabled = atomicStudio.get("objectsEnabled");
        sliderVisible = atomicStudio.get("sliderVisible");
        sliderEnabled = atomicStudio.get("sliderEnabled");
        updateWidgey();
    })
}

let item, key;
for (key in capi.defaults) {
    item = capi.exposeWith[key];
    simcapi.CapiAdapter.expose(key, atomicStudio, item);
    addListener(key);
}

simcapi.Transporter.notifyOnReady();

// Now all the stuff for changing based on CAPI

function updateWidgey() {
    object_2_button.className = "";
    object_3_button.className = "";
    object_4_button.className = "";
    object_5_button.className = "";
    document.getElementById("buttons").className = "";
    updateTotalObjects();
    updateName();
    updateUI();

    function updateName() {
        object_1_button.querySelector(".button_text span").textContent = object1Name;
        object_2_button.querySelector(".button_text span").textContent = object2Name;
        object_3_button.querySelector(".button_text span").textContent = object3Name;
        object_4_button.querySelector(".button_text span").textContent = object4Name;
        object_5_button.querySelector(".button_text span").textContent = object5Name;

        if (object_1_button.className == "selected") {
            document.getElementById("object_name").innerHTML = object1Name;
        }
        if (object_2_button.className == "selected") {
            document.getElementById("object_name").innerHTML = object2Name;
        }
        if (object_3_button.className == "selected") {
            document.getElementById("object_name").innerHTML = object3Name;
        }
        if (object_4_button.className == "selected") {
            document.getElementById("object_name").innerHTML = object4Name;
        }
        if (object_5_button.className == "selected") {
            document.getElementById("object_name").innerHTML = object5Name;
        }
    }

    function updateUI() {
        // If CAPI Objects.Visible = false --> hide the object buttons
        // Don't need a second show the objects because we do this at the beginning by resetting the class names
        if (objectsVisible == false) {
            document.getElementById("buttons").classList.add("hidden");
        }
    
        // If CAPI Objects.Enabled = false --> disable the object buttons
        if (objectsEnabled == false) {
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].disabled = true;
                buttons[i].classList = "";
            }
        }
        // If CAPI Objects.Enabled = true --> enable the object buttons
        if (objectsEnabled == true) {
            object_1_button.disabled = false;
            object_2_button.disabled = false;
            object_3_button.disabled = false;
            object_4_button.disabled = false;
            object_5_button.disabled = false;
            object_1_button.selected = true;
            object_1_button.className = "selected";
        } 

        // If CAPI Slider.Visible = false --> hide the slider
        if (sliderVisible == false) {
            document.getElementById("slider_area").className = "hidden";
        }
    }
    
    // Show/hide the object buttons based on the number specified with CAPI Objects.Number
    function updateTotalObjects() {
        if (totalObjects == 4) {
            object_5_button.classList.add("hidden");
        }
        if (totalObjects == 3) {
            object_5_button.classList.add("hidden");
            object_4_button.classList.add("hidden");
        }
        if (totalObjects == 2) {
            object_5_button.classList.add("hidden");
            object_4_button.classList.add("hidden");
            object_3_button.classList.add("hidden");
        }
        if (totalObjects == 1) {
            object_5_button.classList.add("hidden");
            object_4_button.classList.add("hidden");
            object_3_button.classList.add("hidden");
            object_2_button.classList.add("hidden");
        }
    }

}

/*------------------------------
    Event Listeners
------------------------------*/

let buttons = document.querySelectorAll("button");
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", mapSlider);
}

window.addEventListener("resize", function () {
    canvas.width = canvas_container.clientWidth;
    canvas.height = canvas_container.clientHeight;
    width = Math.floor(canvas.width / 20);
    height = Math.floor(canvas.height / 20);

    for (let i = 0; i < objects1.length; i++) {
        console.log("does this fire?");
        let location = objects1[i];
        ctx.drawImage(splatter1, location[0], location[1], width, height);
    }
});

document.getElementById("myPopup").addEventListener("click", function () {
    popup.classList = "popuptext";
});