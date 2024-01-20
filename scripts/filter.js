async function filter() {
    const courses = document.getElementsByClassName("coursebox");
    const sideBarCourses = document.getElementsByClassName("unlist")[0].querySelectorAll("li");
    let whiteListBox = [];
    let whiteListSide = [];
    await chrome.storage.sync.get("boxCourses", function (result) {
        const storedCourses = result.boxCourses;
        if (storedCourses) {
            whiteListBox = storedCourses;
        }
    });

    await chrome.storage.sync.get("sideCourses", function (result) {
        const storedCourses = result.sideCourses;
        if (storedCourses) {
            whiteListSide = storedCourses;
        }
    });

    let prevCourseBox = [];

    await chrome.storage.sync.get("courseBox", function (result) {
        const storedCourses = result.courseBox;
        if (storedCourses) {
            prevCourseBox = storedCourses;
        }
    })

    let prevSideBar = [];

    await chrome.storage.sync.get("sideBarCourses", function (result) {
        const storedCourses = result.sideBarCourses;
        if (storedCourses) {
            prevSideBar = storedCourses;
        }
    })

    await new Promise(resolve => setTimeout(resolve, 250));

    const courseNameList = [];

    if (window.location.href === 'https://moodle.hku.hk/' ) {
        for (let i = 0; i < courses.length; i++) {
            const courseName = courses[i].getElementsByClassName("coursename")[0].children[0].innerText.substring(0, 8)
    
            if (!prevCourseBox.includes(courseName)) {
                console.log(courseName)
                whiteListBox.push(courseName)
            }
    
            courseNameList.push(courseName)
        }
    }

    const sideBarCourseNameList = [];

    for (let i = 0; i < sideBarCourses.length; i++) {
        const courseName = sideBarCourses[i].innerText.substring(0, 8)

        if (!prevSideBar.includes(courseName)) {
            console.log(courseName)
            whiteListSide.push(courseName)
        }

        sideBarCourseNameList.push(sideBarCourses[i].innerText.substring(0, 8))
    }

    await new Promise(resolve => setTimeout(resolve, 250));

    await chrome.storage.sync.set({ boxCourses: whiteListBox, sideCourses: whiteListSide, courseBox: (courseNameList.length ? courseNameList : prevCourseBox) , sideBarCourses: (sideBarCourseNameList.length ? sideBarCourseNameList : prevSideBar) });

    console.log(whiteListBox, whiteListSide)

    await new Promise(resolve => setTimeout(resolve, 250));
    let offset = 0;

    if (window.location.href === 'https://moodle.hku.hk/' ) {
        if (whiteListBox.length) {
            let timeToRun = courses.length
    
            for (let i = 0; i < timeToRun; i++) {
                const courseName = courses[i - offset].getElementsByClassName("coursename")[0].children[0].innerText.substring(0, 8);
                if (!whiteListBox.includes(courseName)) {
                    courses[i - offset].remove();
                    offset++;
                }
            }
        }
    }

    if (whiteListSide.length) {
        timeToRun = sideBarCourses.length;

        for (let i = 0; i < timeToRun; i++) {
            const courseName = sideBarCourses[i].innerText.substring(0, 8);
            if (!whiteListSide.includes(courseName)) {
                sideBarCourses[i].remove();
            }
        }
    }
}

filter();
