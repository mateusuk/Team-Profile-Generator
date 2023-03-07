const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");


// TODO: Write Code to gather information about the development team members, and render the HTML file.

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }



const employees = [];

// Prompt the user for information about the team manager
inquirer.prompt([
  {
    type: 'input',
    message: 'What is the team manager\'s name?',
    name: 'name',
  },
  {
    type: 'input',
    message: 'What is the team manager\'s employee ID?',
    name: 'id',
  },
  {
    type: 'input',
    message: 'What is the team manager\'s email address?',
    name: 'email',
  },
  {
    type: 'input',
    message: 'What is the team manager\'s office number?',
    name: 'officeNumber',
  },
])
.then((managerData) => {
  // Create a Manager object using the user's input and add it to the employees array
  const manager = new Manager(managerData.name, managerData.id, managerData.email, managerData.officeNumber);
  employees.push(manager);

  // Define a function that prompts the user to add an Engineer or an Intern, and recursively calls itself
  function addEmployee() {
    inquirer.prompt([
      {
        type: 'list',
        message: 'What type of employee would you like to add?',
        name: 'type',
        choices: ['Engineer', 'Intern', 'Finish building the team'],
      },
    ])
    .then((response) => {
      if (response.type === 'Finish building the team') {
        // If the user chooses to finish building the team, generate the HTML and write it to a file
        const html = render(employees);
        fs.writeFile(outputPath, html, (err) =>
          err ? console.error(err) : console.log('Successfully generated team.html!')
        );
      } else {
        // Otherwise, prompt the user for information about the employee and create an object of the correct class
        const questions = [
          {
            type: 'input',
            message: `What is the ${response.type.toLowerCase()}'s name?`,
            name: 'name',
          },
          {
            type: 'input',
            message: `What is the ${response.type.toLowerCase()}'s employee ID?`,
            name: 'id',
          },
          {
            type: 'input',
            message: `What is the ${response.type.toLowerCase()}'s email address?`,
            name: 'email',
          },
        ];
        if (response.type === 'Engineer') {
          questions.push({
            type: 'input',
            message: 'What is the Engineer\'s GitHub username?',
            name: 'github',
          });
        } else {
          questions.push({
            type: 'input',
            message: 'What school does the Intern attend?',
            name: 'school',
          });
        }
        inquirer.prompt(questions)
        .then((employeeData) => {
          const EmployeeClass = response.type === 'Engineer' ? Engineer : Intern;
          const employee = new EmployeeClass(employeeData.name, employeeData.id, employeeData.email, employeeData.github || employeeData.school);
          employees.push(employee);
          addEmployee();
        });
      }
    });
  }

  // Start the process of adding employees
  addEmployee();
});
