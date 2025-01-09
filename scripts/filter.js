async function filter() {
    const courses = document.getElementsByClassName("coursebox");
    // const sideBarCourses = document.getElementsByClassName("unlist")[0].querySelectorAll("li");
    let whiteListBox = [];
    let whiteListSide = [];
    let hidedCourses = [];
    await chrome.storage.sync.get("boxCourses", function (result) {
        const storedCourses = result.boxCourses;
        if (storedCourses) {
            whiteListBox = storedCourses;
        }
    });

    // await chrome.storage.sync.get("sideCourses", function (result) {
    //     const storedCourses = result.sideCourses;
    //     if (storedCourses) {
    //         whiteListSide = storedCourses;
    //     }
    // });

    let prevCourseBox = [];

    await chrome.storage.sync.get("courseBox", function (result) {
        const storedCourses = result.courseBox;
        if (storedCourses) {
            prevCourseBox = storedCourses;
        }
    })

    // let prevSideBar = [];

    // await chrome.storage.sync.get("sideBarCourses", function (result) {
    //     const storedCourses = result.sideBarCourses;
    //     if (storedCourses) {
    //         prevSideBar = storedCourses;
    //     }
    // })

    await new Promise(resolve => setTimeout(resolve, 250));

    const courseNameList = [];

    if (window.location.href === 'https://moodle.hku.hk/') {
        for (let i = 0; i < courses.length; i++) {
            const courseName = courses[i].getElementsByClassName("coursename")[0].children[0].innerText

            if (!prevCourseBox.includes(courseName)) {
                console.log(courseName)
                whiteListBox.push(courseName)
            }

            courseNameList.push(courseName)
        }
    }

    // const sideBarCourseNameList = [];

    // for (let i = 0; i < sideBarCourses.length; i++) {
    //     const courseName = sideBarCourses[i].innerText.substring(0, 8)

    //     if (!prevSideBar.includes(courseName)) {
    //         console.log(courseName)
    //         whiteListSide.push(courseName)
    //     }

    //     sideBarCourseNameList.push(sideBarCourses[i].innerText.substring(0, 8))
    // }

    await new Promise(resolve => setTimeout(resolve, 250));

    await chrome.storage.sync.set({ boxCourses: whiteListBox, courseBox: (courseNameList.length ? courseNameList : prevCourseBox) });

    console.log(whiteListBox, whiteListSide)

    await new Promise(resolve => setTimeout(resolve, 250));

    if (window.location.href === 'https://moodle.hku.hk/') {
        if (whiteListBox.length) {
            let timeToRun = courses.length

            for (let i = 0; i < timeToRun; i++) {
                const courseName = courses[i].getElementsByClassName("coursename")[0].children[0].innerText;
                if (!whiteListBox.includes(courseName)) {
                    console.log(courses[i].style.display)
                    courses[i].style.display = 'none'
                    hidedCourses.push([courseName, i])
                    // offset++;
                } else {
                    const hideButton = document.createElement("button")
                    const tempIndex = i
                    hideButton.innerText = "Hide this course"

                    hideButton.style.backgroundColor = '#00b48d';
                    hideButton.style.color = '#fff';
                    hideButton.style.border = '0';
                    hideButton.style.borderRadius = '2px';
                    hideButton.style.padding = '.55rem 1.75rem';
                    hideButton.style.boxShadow = '0 2px 5px 0 rgba(0, 0, 0, 0.16)';
                    hideButton.style.fontSize = '1.08em';
                    hideButton.style.transition = '0.3s ease-out';
                    hideButton.style.margin = '6px';

                    hideButton.style.display = 'inline-block';
                    hideButton.style.width = 'auto';

                    hideButton.onclick = () => {
                        whiteListBox.splice(whiteListBox.indexOf(courseName), 1)
                        chrome.storage.sync.set({ boxCourses: whiteListBox, courseBox: (courseNameList.length ? courseNameList : prevCourseBox) });
                        setTimeout(() => {
                            location.reload();
                        }, 250)
                    }
                    courses[i].appendChild(hideButton)
                }
            }

            const frontpageCourseList = document.getElementById("frontpage-course-list")

            const hidedCoursesDiv = document.createElement("div")

            const hidedCourseTitle = document.createElement("h2")
            hidedCourseTitle.innerText = "Hided Courses"

            hidedCoursesDiv.appendChild(hidedCourseTitle)

            hidedCourses.forEach(([courseName, index]) => {
                const restoreCourse = document.createElement("div")
                restoreCourse.style.display = 'flex';

                const restoreCourseName = document.createElement("h6")
                restoreCourseName.innerText = courseName
                restoreCourseName.style.flex = '6';

                restoreCourse.appendChild(restoreCourseName)

                const restoreCourseButton = document.createElement("button")
                restoreCourseButton.innerText = "Restore this course"

                restoreCourseButton.style.backgroundColor = '#00b48d';
                restoreCourseButton.style.color = '#fff';
                restoreCourseButton.style.border = '0';
                restoreCourseButton.style.borderRadius = '2px';
                restoreCourseButton.style.padding = '.55rem 1.75rem';
                restoreCourseButton.style.boxShadow = '0 2px 5px 0 rgba(0, 0, 0, 0.16)';
                restoreCourseButton.style.fontSize = '1.08em';
                restoreCourseButton.style.transition = '0.3s ease-out';
                restoreCourseButton.style.margin = '6px';

                restoreCourseButton.style.display = 'inline-block';
                restoreCourseButton.style.width = 'auto';
                restoreCourseButton.flex = '4';

                restoreCourseButton.onclick = () => {
                    courses[index].style.display = ''
                    if (whiteListBox.indexOf(courseName) === -1) {
                        whiteListBox.push(courseName)
                    }
                    chrome.storage.sync.set({ boxCourses: whiteListBox, courseBox: (courseNameList.length ? courseNameList : prevCourseBox) });

                    setTimeout(() => {
                        location.reload();
                    }, 250)
                }

                restoreCourse.appendChild(restoreCourseButton)

                hidedCoursesDiv.appendChild(restoreCourse)
            })

            frontpageCourseList.appendChild(hidedCoursesDiv)
        }
    }

    // if (whiteListSide.length) {
    //     timeToRun = sideBarCourses.length;

    //     for (let i = 0; i < timeToRun; i++) {
    //         const courseName = sideBarCourses[i].innerText.substring(0, 8);
    //         if (!whiteListSide.includes(courseName)) {
    //             sideBarCourses[i].remove();
    //         }
    //     }
    // }
}

filter();
