// Day page consts

const day = new URLSearchParams(location.search).get("day");
const backBtn = document.querySelector('#back');
const allTasks = pullTaskData();
const allEmps = pullEmpData();
const taskEl = document.querySelector('#taskDisplay');
const rosterEl = document.querySelector('#empDisplay');
const assignError = document.querySelector('#assignIndicator');
const assignBtn = document.querySelector('#assignmentBtn');
const empAssignBtn = document.querySelector('#empAssignment');


// Filter for the day selected
const currentDayTasks = allTasks.filter(function (task) {
  return task.day === day;
});


function populateRoster() {
  const allTasks = pullTaskData();
  const allEmps = pullEmpData();

  while (rosterEl.children.length > 0) {
    rosterEl.removeChild(rosterEl.children[0]);
  }

  const list = document.createElement('ul');
  const assignedEmployees = [];
  const assignedFiltered = [];

  for (const task of currentDayTasks ) {
    for (const employee of allEmps) {
      if (task.assigned.includes(employee.fullName)) {
        assignedEmployees.push(employee);
      }
    }
  }

  assignedEmployees.forEach(function (emp) {
    if (!assignedFiltered.includes(emp)) {
      assignedFiltered.push(emp);
    }
  });

  for (const employee of assignedFiltered) {
    const item = document.createElement('li');
    item.textContent = employee.fullName;
    list.appendChild(item);
  }

  if (!assignedFiltered.length) {
    const noAssigned = document.createElement('li');
    noAssigned.textContent = "No employees assigned to tasks today.";
    list.appendChild(noAssigned);
  }
  rosterEl.appendChild(list);
}


//Displays the days tasks
function buildDay() {
  const allTasks = pullTaskData();
  const allEmps = pullEmpData();
  if (currentDayTasks.length > 0) {
    currentDayTasks.forEach(function (task) {
      taskBuilder('div', task, taskEl);
    });
  } else {
    blankTasks();
  }
}


function blankTasks() {
  const blank = document.createElement('div');
  blank.textContent = "No tasks yet!";
  taskEl.appendChild(blank);
}


function taskBuilder(type, task, parentEl) {
  const elem = document.createElement(type);
  elem.classList.add('card-body2');

  const taskName = task.task;
  const taskStart = task.startTime;
  const taskDuration = task.duration;

  const title = document.createElement('h5');
  title.textContent = taskName;
  title.classList.add('card-title');

  const info = document.createElement('p');
  info.textContent = `Start Time: ${taskStart}  Duration: ${taskDuration}`;
  info.classList.add('card-text');

  const empList = document.createElement('ul');
  if (task.assigned.length > 0) {
    fetchTaskEmps(empList, task);
  } else {
    const noEmp = document.createElement('li');
    noEmp.textContent = "No employees assigned to task.";
    empList.appendChild(noEmp);
  }

  elem.appendChild(title);
  elem.appendChild(info);
  elem.appendChild(empList);

  parentEl.appendChild(elem);
}


function fetchTaskEmps(assignedEl, dayTask) {
  allEmps.filter((emp) => dayTask.assigned.includes(emp.fullName)).forEach((emp) => empBuilder('li', emp, assignedEl));
}


//Display the days employees
function empBuilder(type, empIndexed, parentEl) {
  const emp = document.createElement(type);
  emp.textContent = `${empIndexed.fullName} assigned.`;
  parentEl.appendChild(emp);
}


// Redirect functionality
let redirectURL = '';
const redirectPage = function (url) {
  redirectURL = url;
  location.assign(url);
};


// Offcanvas functions and task assignment on offcanvas
function populateEmpOffCanv() {
  let selectElement = document.getElementById('nameSelect');
  let existingEmpData = pullEmpData();
  selectElement.innerHTML = '';

  existingEmpData.forEach(function (employee) {
    const optionElement = document.createElement('option');
    optionElement.text = `${employee.firstName} ${employee.lastName}`;
    selectElement.appendChild(optionElement);
  });
}

function populateTaskOffCanv() {
  assignError.textContent = "";
  assignError.classList.remove('invalid');

  let selectElement = document.getElementById('taskSelect');
  let existingTaskData = pullTaskData();
  selectElement.innerHTML = '';

  existingTaskData.forEach(function (taskData) {
    const optionElement = document.createElement('option');
    optionElement.text = `${taskData.task} ${taskData.day}`;
    optionElement.value = taskData.id; // undefined value?
    selectElement.appendChild(optionElement);
  });
}


function taskAssign() {
  const nameSelect = document.getElementById("nameSelect");
  const taskSelect = document.getElementById("taskSelect");

  let selectedEmp = nameSelect.value;
  let selectedTask = taskSelect.value;
  const tmpTasks = [...allTasks];

  const taskToUpdate = tmpTasks.find(task => String(task.id) === selectedTask); // what is String(task.id)? undefined?

  const updateIndex = tmpTasks.indexOf(taskToUpdate);
  if (!taskToUpdate.assigned.includes(selectedEmp)) {
    taskToUpdate.assigned.push(selectedEmp);
    tmpTasks.splice(updateIndex, 1, taskToUpdate);

    localStorage.setItem('taskData', JSON.stringify(tmpTasks));
    location.reload();
  } else {
    assignError.textContent = "Employee is already assigned."
    assignError.classList.add('invalid');
    return;
  }
};

function setCompanyNameDay() {
  compName = localStorage.getItem('companyName');
  console.log(compName)
  document.getElementById('companyNameDay').textContent = `${compName} - ${day}`;
}

//Event Listeners
backBtn.addEventListener('click', function () { redirectPage('index.html') });
assignBtn.addEventListener('click', function () { taskAssign() });
empAssignBtn.addEventListener('click', populateEmpOffCanv);
empAssignBtn.addEventListener('click', populateTaskOffCanv);


// Initialize Day Page
populateRoster();
buildDay();
setCompanyNameDay()