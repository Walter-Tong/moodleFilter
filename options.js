const boxCheckboxList = document.getElementById("boxCheckboxList");

const sideBarCheckboxList = document.getElementById("sideBarCheckboxList")

const toRun = async () => {
    let courseBox;
    let sideBarCourses;
    let whiteListBox;
    let whiteListSide;

    const handleCheck = (name, list, isAdd) => {
        if (isAdd) {
            list.push(name)
            return [...list]
        } else {
            return list.filter((item) => item !== name)
        }
    }

    await chrome.storage.sync.get("courseBox", function (result) {
        courseBox = result.courseBox;
    })

    await chrome.storage.sync.get("sideBarCourses", function (result) {
        sideBarCourses = result.sideBarCourses;
    })

    await chrome.storage.sync.get("boxCourses", function (result) {
        whiteListBox = result.boxCourses;
    })

    await chrome.storage.sync.get("sideCourses", function (result) {
        whiteListSide = result.sideCourses;
    })

    await new Promise(resolve => setTimeout(resolve, 500));

    console.log(courseBox, sideBarCourses, whiteListBox, whiteListSide)

    courseBox.forEach((item, index) => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = item;
        checkbox.id = item.replace(/\s/g, "") + index + "Box";
        checkbox.checked = whiteListBox.includes(item);

        const label = document.createElement("label");
        label.htmlFor = checkbox.id;
        label.appendChild(document.createTextNode(item));

        boxCheckboxList.appendChild(checkbox);
        boxCheckboxList.appendChild(label);
        boxCheckboxList.appendChild(document.createElement("br"));

        checkbox.addEventListener("change", () => {
            whiteListBox = handleCheck(item, whiteListBox, checkbox.checked)
            console.log(whiteListBox, "box")
        })
    });

    sideBarCourses.forEach((item, index) => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = item;
        checkbox.id = item.replace(/\s/g, "") + index + "Side";
        checkbox.checked = whiteListSide.includes(item);

        const label = document.createElement("label");
        label.htmlFor = checkbox.id;
        label.appendChild(document.createTextNode(item));

        sideBarCheckboxList.appendChild(checkbox);
        sideBarCheckboxList.appendChild(label);
        sideBarCheckboxList.appendChild(document.createElement("br"));

        checkbox.addEventListener("change", () => {
            whiteListSide = handleCheck(item, whiteListSide, checkbox.checked)
            console.log(whiteListSide, "side")
        })
    })

    const handleSubmit = () => {
        document.getElementById("output").textContent = "Submitted";
        chrome.storage.sync.set({ courseBox, sideBarCourses, boxCourses: whiteListBox, sideCourses: whiteListSide })
    }
    
    document.getElementById("form").addEventListener("submit", function (event) {
        event.preventDefault();
        handleSubmit()
    });
}

toRun();