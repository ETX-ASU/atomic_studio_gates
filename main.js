$(window).on('load', function () {
    // This starts your app after the whole page has loaded which gives you access to the variables in your other script files
    var myCoolApp = new MyArgosApp();
    /*
    	from here you can access and manually test functions in your app in the browser console by typing something like:
    	myCoolApp.UpdateObject5();
    	
    	Usually you can open the browser console by pressing f12, but you may need to enable it depending on your browser.
    	
    	you can also tell your myCoolArgosClass to log its favorite color by typing this into the terminal:
    	myCoolApp.myCoolArgosClass.SatFavoriteColor();
    */
});

var MyArgosApp = function () {

    let currentlySelected = 1;

    class ObjectItem {
        constructor(id, imgSrc) {
            this.id = id;
            this.image = new Image();
            this.image.src = imgSrc;
            this.value = 0;
            this.positions = [];
            this.graphed = 0;
        }

        removeObjects(objectValue) {
            let difference = this.positions.length - objectValue;
            for (let i = 0; i < difference; i++) {
                let index = this.positions.length - 1;
                let removeLocation = this.positions[index];
                ctx.clearRect(removeLocation[0], removeLocation[1], width, height);
                this.positions.pop();
            }
            allObjects = objectItems.flatMap(item => item.positions);
        }

        addObjects(objectValue, maxObjects = 100) {
            this.graphed = this.positions.length;
            while (this.graphed < objectValue) {
                let [x, y] = getRandomXY();
                if (!checkExists(x, y)) {
                    allObjects = objectItems.flatMap(item => item.positions);
                    if (allObjects.length < maxObjects) {
                        this.positions.push([x, y]);
                        this.graphed++;
                    } else {
                        break;
                    }
                }
            }
            if (this.graphed > objectValue) {
                this.graphed = objectValue;
                this.positions = this.positions.slice(0, objectValue);
            }
            for (const position of this.positions) {
                ctx.drawImage(this.image, position[0], position[1], width, height);
            }
        }

    }

    // defining the object items
    const objectItems = [
        new ObjectItem("object_1_button", "images/paint-shape_01.png"),
        new ObjectItem("object_2_button", "images/paint-shape_02.png"),
        new ObjectItem("object_3_button", "images/paint-shape_03.png"),
        new ObjectItem("object_4_button", "images/paint-shape_04.png"),
        new ObjectItem("object_5_button", "images/paint-shape_05.png"),
    ];

    const canvas = document.getElementById("atomic_canvas");
    const canvas_container = document.getElementById("canvas_section");
    const ctx = canvas.getContext("2d");

    canvas.width = canvas_container.clientWidth;
    canvas.height = canvas_container.clientHeight;

    const width = Math.floor(canvas.width / 20);
    const height = Math.floor(canvas.height / 20);

    let allObjects = [];

    function updateObjects(value) {
        popup.classList = "popuptext";
        if (selectedObject) {
            let objectValue = parseInt(value);
            const totalObjectButtons = objectItems.reduce((total, item) => total + item.value, 0);
            const maxAllowedValue = 100 - totalObjectButtons + selectedObject.value;

            if (objectValue > maxAllowedValue) {
                objectValue = maxAllowedValue;
                objectSlider.value = maxAllowedValue;
                object_num.value = maxAllowedValue;
                popup.classList.toggle("show");
            }

            selectedObject.value = objectValue;
            object_num.value = objectValue;

            if (objectValue < selectedObject.positions.length) {
                selectedObject.removeObjects(objectValue);
            } else {
                selectedObject.addObjects(objectValue, 100);
            }
            totalObjectsOutput.innerHTML = objectItems.reduce((total, item) => total + item.value, 0);
        }

        atomicStudio.set("dataObject1Value", objectItems[0].positions.length);
        atomicStudio.set("dataObject2Value", objectItems[1].positions.length);
        atomicStudio.set("dataObject3Value", objectItems[2].positions.length);
        atomicStudio.set("dataObject4Value", objectItems[3].positions.length);
        atomicStudio.set("dataObject5Value", objectItems[4].positions.length);

        checkAndCompareValues();
    }

    function mapSlider() {
        for (const button of buttons) {
            button.classList.remove("selected");
        }
        this.classList.add("selected");

        const objectImages = ["images/paint-shape_01.png", "images/paint-shape_02.png", "images/paint-shape_03.png", "images/paint-shape_04.png", "images/paint-shape_05.png"];
        const objectNames = [object1Name, object2Name, object3Name, object4Name, object5Name];
        for (let i = 0; i < objectNames.length; i++) {
            // Format the object names
            objectNames[i] = formatObjectName(objectNames[i]);
        }
        const id = this.id.match(/\d+/)[0]; // extract the number from the button ID
        currentlySelected = Number(id);
        splatter_mini.setAttribute("src", objectImages[id - 1]);
        selected_object = Number(id);
        document.getElementById("object_name").innerHTML = objectNames[id - 1];
    }

    function getRandomXY() {
        const xMin = 0;
        const xMax = canvas.width - (width);
        const x = Math.floor(Math.random() * (xMax - xMin + 1) + xMin);
        const yMin = 0;
        const yMax = canvas.height - (height);
        const y = Math.floor(Math.random() * (yMax - yMin + 1) + yMin);
        return [x, y];
    }

    function checkExists(x, y) {
        allObjects = objectItems.flatMap(item => item.positions);
        const exists = allObjects.some(subArray => {
            const [subX, subY] = subArray;
            const withinX = Math.abs(subX - x) <= width;
            const withinY = Math.abs(subY - y) <= height;
            return withinX && withinY;
        });
        return exists;
    }

    function checkAndCompareValues() {
        // Calculates the total of all values in the 'correctArray'
        correctArrayString = atomicStudio.get("dataExpectedValues");
        let inputArrayLength = correctArrayString.length;
        if (inputArrayLength != 5) {
            for (let i = inputArrayLength; i < 5; i++) {
                correctArrayString.push(0);
            }
        }
        let correctArray = correctArrayString.map(Number);
        var correctTotal = correctArray.reduce((sum, val) => sum + val, 0);

        // Calculates an array of correct ratios
        var correctRatios = correctArray.map(val => val / correctTotal);

        error = atomicStudio.get("dataTolerance");

        // Iterate through each object in the array and calculates the user ratio 
        objectItems.forEach((item, i) => {
            if (objectItems.reduce((sum, item) => sum + item.value, 0) !== 0) {
                var userRatio = item.positions.length / objectItems.reduce((sum, item) => sum + item.value, 0);
                // Sends the value to CAPI dataObject#Percent
                atomicStudio.set(`dataObject${i+1}Percent`, userRatio * 100);

                var upperBound = correctRatios[i] + correctRatios[i] * error;
                var lowerBound = correctRatios[i] - correctRatios[i] * error;
                var isCorrect = false;

                if (userRatio >= lowerBound && userRatio <= upperBound) {
                    isCorrect = true;
                }
                // Sends the boolean value to CAPI dataObject#Correct
                atomicStudio.set(`dataObject${i+1}Correct`, isCorrect);
            } else {
                atomicStudio.set(`dataObject${i+1}Correct`, false);
            }

        });
        object1Correct = atomicStudio.get("dataObject1Correct");
        object2Correct = atomicStudio.get("dataObject2Correct");
        object3Correct = atomicStudio.get("dataObject3Correct");
        object4Correct = atomicStudio.get("dataObject4Correct");
        object5Correct = atomicStudio.get("dataObject5Correct");
        if (object1Correct && object2Correct && object3Correct && object4Correct && object5Correct) {
            atomicStudio.set("dataCorrect", true);
        } else {
            atomicStudio.set("dataCorrect", false);
        }
    }

    // Event listeners and other functions
    let objectSlider = document.getElementById("object_slider");
    let object_num = document.getElementById("object_num");
    let totalObjectsOutput = document.getElementById("total_objects_output");
    let splatterMini = document.getElementById("splatter_mini");
    let objectName = document.getElementById("object_name");
    let popup = document.getElementById("myPopup");

    let selectedObject = null;

    for (const objectItem of objectItems) {
        const button = document.getElementById(objectItem.id);
        button.addEventListener("click", function () {
            selectedObject = objectItem;
            objectSlider.value = selectedObject.value;
            object_num.value = selectedObject.value;
            totalObjectsOutput.innerHTML = objectItems.reduce((total, item) => total + item.value, 0);
            splatterMini.src = selectedObject.image.src;
        });
    }

    document.getElementById("myPopup").addEventListener("click", function () {
        popup.classList = "popuptext";
    });

    document.getElementById("object_1_button").click();

    let buttons = document.querySelectorAll("button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", mapSlider);
    }

    objectSlider.addEventListener("input", function () {
        updateObjects(this.value);
    });

    object_num.addEventListener("input", function () {
        updateObjects(this.value);
    });




    /*--------------------------
       The CAPI Stuff
    --------------------------*/

    console.log("Setting up CAPI");

    let preventRecursion = false;

    function capiHandler(name, value) {
        // console.log(name, value);
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

            case 'controlsVisible':
                break;

            case 'controlsEnabled':
                break;

            case 'dataCorrect':
                break;

            case 'dataTolerance':
                break;

            case 'dataExpectedValues':
                break;

            case 'dataObject1Value':
                break;

            case 'dataObject1Percent':
                break;

            case 'dataObject1Correct':
                break;

            case 'dataObject2Value':
                break;

            case 'dataObject2Percent':
                break;

            case 'dataObject2Correct':
                break;

            case 'dataObject3Value':
                break;

            case 'dataObject3Percent':
                break;

            case 'dataObject3Correct':
                break;

            case 'dataObject4Value':
                break;

            case 'dataObject4Percent':
                break;

            case 'dataObject4Correct':
                break;

            case 'dataObject5Value':
                break;

            case 'dataObject5Percent':
                break;

            case 'dataObject5Correct':
                break;

            default:
                console.log(name, value);
                break;
        }

        preventRecursion = false;
    }

    let capi = {
        defaults: {
            numberObjects: 2,
            nameObject1: "obj1",
            nameObject2: "obj2",
            nameObject3: "obj3",
            nameObject4: "obj4",
            nameObject5: "obj5",
            objectsVisible: true,
            objectsEnabled: true,
            controlsVisible: true,
            controlsEnabled: true,
            dataCorrect: false,
            dataTolerance: 0.05,
            dataExpectedValues: [99, 1, 0, 0, 0],
            dataObject1Value: 0,
            dataObject1Percent: 0,
            dataObject1Correct: false,
            dataObject2Value: 0,
            dataObject2Percent: 0,
            dataObject2Correct: false,
            dataObject3Value: 0,
            dataObject3Percent: 0,
            dataObject3Correct: false,
            dataObject4Value: 0,
            dataObject4Percent: 0,
            dataObject4Correct: false,
            dataObject5Value: 0,
            dataObject5Percent: 0,
            dataObject5Correct: false,
        },
        exposeWith: {
            numberObjects: {
                alias: "Objects.Number",
            },
            nameObject1: {
                alias: "Objects.Names.Object1",
            },
            nameObject2: {
                alias: "Objects.Names.Object2",
            },
            nameObject3: {
                alias: "Objects.Names.Object3",
            },
            nameObject4: {
                alias: "Objects.Names.Object4",
            },
            nameObject5: {
                alias: "Objects.Names.Object5",
            },
            objectsVisible: {
                alias: "Objects.Visible",
            },
            objectsEnabled: {
                alias: "Objects.Enabled",
            },
            controlsVisible: {
                alias: "Controls.Visible",
            },
            controlsEnabled: {
                alias: "Controls.Enabled",
            },
            dataCorrect: {
                alias: "Data.Correct",
            },
            dataTolerance: {
                alias: "Data.Tolerance",
            },
            dataExpectedValues: {
                alias: "Data.ExpectedPercents",
            },
            dataObject1Value: {
                alias: "Data.Object1.Value",
            },
            dataObject1Percent: {
                alias: "Data.Object1.Percent",
            },
            dataObject1Correct: {
                alias: "Data.Object1.IsCorrect",
            },
            dataObject2Value: {
                alias: "Data.Object2.Value",
            },
            dataObject2Percent: {
                alias: "Data.Object2.Percent",
            },
            dataObject2Correct: {
                alias: "Data.Object2.IsCorrect",
            },
            dataObject3Value: {
                alias: "Data.Object3.Value",
            },
            dataObject3Percent: {
                alias: "Data.Object3.Percent",
            },
            dataObject3Correct: {
                alias: "Data.Object3.IsCorrect",
            },
            dataObject4Value: {
                alias: "Data.Object4.Value",
            },
            dataObject4Percent: {
                alias: "Data.Object4.Percent",
            },
            dataObject4Correct: {
                alias: "Data.Object4.IsCorrect",
            },
            dataObject5Value: {
                alias: "Data.Object5.Value",
            },
            dataObject5Percent: {
                alias: "Data.Object5.Percent",
            },
            dataObject5Correct: {
                alias: "Data.Object5.IsCorrect",
            },

        },
    }

    let atomicStudio = new simcapi.CapiAdapter.CapiModel(capi.defaults);

    let object1Name = atomicStudio.get("nameObject1");
    let object2Name = atomicStudio.get("nameObject2");
    let object3Name = atomicStudio.get("nameObject3");
    let object4Name = atomicStudio.get("nameObject4");
    let object5Name = atomicStudio.get("nameObject5");
    let totalObjectButtons = atomicStudio.get("numberObjects");
    let objectsVisible = atomicStudio.get("objectsVisible");
    let objectsEnabled = atomicStudio.get("objectsEnabled");
    let controlsVisible = atomicStudio.get("controlsVisible");
    let controlsEnabled = atomicStudio.get("controlsEnabled");
    let correctArrayString = atomicStudio.get("dataExpectedValues");
    let object1Correct = atomicStudio.get("dataObject1Correct");
    let object2Correct = atomicStudio.get("dataObject2Correct");
    let object3Correct = atomicStudio.get("dataObject3Correct");
    let object4Correct = atomicStudio.get("dataObject4Correct");
    let object5Correct = atomicStudio.get("dataObject5Correct");
    let error = atomicStudio.get("dataTolerance");

    updateCAPI();




    function addListener(key) {
        atomicStudio.on("change:" + key, (atomicStudio, value) => {
            capiHandler(key, value);
            object1Name = atomicStudio.get("nameObject1");
            object2Name = atomicStudio.get("nameObject2");
            object3Name = atomicStudio.get("nameObject3");
            object4Name = atomicStudio.get("nameObject4");
            object5Name = atomicStudio.get("nameObject5");
            totalObjectButtons = atomicStudio.get("numberObjects");
            objectsVisible = atomicStudio.get("objectsVisible");
            objectsEnabled = atomicStudio.get("objectsEnabled");
            controlsVisible = atomicStudio.get("controlsVisible");
            controlsEnabled = atomicStudio.get("controlsEnabled");
            correctArrayString = atomicStudio.get("dataExpectedValues");
            error = atomicStudio.get("dataTolerance");
            updateCAPI();
        })
    }

    function formatObjectName(inputString) {
        // Regular expression for superscripts
        const superScriptRegExp = /\^(\d+)\^/g;

        // Regular expression for subscripts
        const subScriptRegExp = /_(\d+)_/g;

        // Replace instances with HTML superscript and subscript tags
        let formattedString = inputString.replace(superScriptRegExp, "<sup>$1</sup>").replace(subScriptRegExp, "<sub>$1</sub>");

        return formattedString;
    }

    let item, key;
    for (key in capi.defaults) {
        item = capi.exposeWith[key];
        simcapi.CapiAdapter.expose(key, atomicStudio, item);
        addListener(key);
    }

    function updateCAPI() {
        document.getElementById("buttons").className = "";
        updateName();
        // updatetotalObjectButtons();
        updateUI();

        function updateName() {

            // Array of object names
            let objectNames = [object1Name, object2Name, object3Name, object4Name, object5Name];

            // Array of buttons
            let buttons = [object_1_button, object_2_button, object_3_button, object_4_button, object_5_button];

            for (let i = 0; i < objectNames.length; i++) {
                // Format the object names
                objectNames[i] = formatObjectName(objectNames[i]);

                // Update the innerHTML of the button
                buttons[i].querySelector(".button_text span").innerHTML = objectNames[i];

                // If the button is selected, update the object_name
                if (buttons[i].className == "selected") {
                    document.getElementById("object_name").innerHTML = objectNames[i];
                }
            }

        }

        // Update UI
        function updateUI() {
            // Start by reseting the class names for the buttons.
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].classList = "";
            }
            buttons[currentlySelected - 1].classList = "selected";

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
                // object_1_button.className = "selected";
            }

            // If CAPI Controls.Visible = false --> hide the controls
            if (controlsVisible == false) {
                document.getElementById("main_controls").className = "hidden";
                document.getElementById("object_num_div").className = "hidden";
                document.getElementById("total_objects").className = "hidden";
            } else {
                // Otherwise, show the controls
                document.getElementById("main_controls").className = "";
                document.getElementById("object_num_div").className = "";
                document.getElementById("total_objects").className = "";
            }
            // If CAPI Controls.Enabled = false --> disable the controls
            if (controlsEnabled == false) {
                object_slider.disabled = true;
                object_num.disabled = true;
            }
            if (controlsEnabled == true) {
                object_slider.disabled = false;
                object_num.disabled = false;
            }

            updatetotalObjectButtons();

            checkAndCompareValues();

            function updatetotalObjectButtons() {
                for (let i = 5; i > totalObjectButtons; i--) {
                    const button = document.getElementById(`object_${i}_button`);
                    if (button) {
                        button.classList.add("hidden");
                    }
                }
            }
        }
    }

    simcapi.Transporter.notifyOnReady();

}