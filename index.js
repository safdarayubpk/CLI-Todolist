#!/usr/bin/env node
// Import necessary libraries
import inquirer from "inquirer"; // Library for creating interactive command line interfaces
import chalk from "chalk"; // Library for styling console output
// Array to store todo items
const todos = [];
// Function to display a welcome message
async function displayWelcomeMessage() {
    //ASCII representation
    console.log(chalk.green(`   
    ███████╗ ██████╗███████╗███╗   ██╗██╗   ██╗
    ██╔════╝██╔════╝██╔════╝████╗  ██║██║   ██║
    ███████╗██║     █████╗  ██╔██╗ ██║██║   ██║
    ╚════██║██║     ██╔══╝  ██║╚██╗██║██║   ██║
    ███████║╚██████╗███████╗██║ ╚████║╚██████╔╝
    ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝ ╚═════╝ 
    \nWelcome to Todo List App!\n`));
}
// Function to display the list of todo items
async function displayTodos() {
    console.log(chalk.yellow("Your Todo List:")); // Print a message in yellow color
    if (todos.length === 0) {
        console.log(chalk.gray("No items in the todo list.\n")); // Print a message in gray color if the todo list is empty
    }
    else {
        // Loop through each todo item and print its index and name
        todos.forEach((todo, index) => console.log(chalk.cyan(`${index + 1}. ${todo.name}`)));
        console.log(""); // Print an empty line for spacing
    }
}
// Function to add a new todo item
async function addTodo() {
    const response = await inquirer.prompt({
        type: "input",
        name: "todoItem",
        message: chalk.blue("Enter a new todo item:"), // Prompt the user to enter a new todo item in blue color
    });
    const trimmedTodo = response.todoItem.trim(); // Remove leading and trailing whitespace from the user input
    if (trimmedTodo === "") {
        console.log(chalk.red("Todo item cannot be empty.\n")); // Print an error message in red color if the input is empty
    }
    else {
        todos.push({ name: trimmedTodo }); // Add the trimmed input as a new todo item to the array
        console.log(chalk.green(`'${trimmedTodo}' added to the todo list.\n`)); // Print a success message in green color
    }
}
// Function to update an existing todo item
async function updateTodo() {
    if (todos.length === 0) {
        console.log(chalk.yellow("No items to update.\n")); // Print a message in yellow color if there are no todo items
        return;
    }
    await displayTodos(); // Display the current todo list
    let indexResponse = await inquirer.prompt({
        type: "input",
        name: "index",
        message: chalk.blue("Enter the index of the todo item to update:"), // Prompt the user to enter the index of the todo item to update
        validate: (value) => {
            const parsedIndex = parseInt(value);
            if (isNaN(parsedIndex) || parsedIndex < 1 || parsedIndex > todos.length) {
                return "Please enter a valid index."; // Validate the input to ensure it is a valid index
            }
            return true;
        },
    });
    let index = parseInt(indexResponse.index) - 1; // Convert the input index to a number and adjust for zero-based indexing
    const { newTodo } = await inquirer.prompt({
        type: "input",
        name: "newTodo",
        message: chalk.blue("Enter the new value for the todo item:"), // Prompt the user to enter the new value for the todo item
    });
    const trimmedNewTodo = newTodo.trim(); // Remove leading and trailing whitespace from the user input
    if (trimmedNewTodo === "") {
        console.log(chalk.red("New todo item cannot be empty.\n")); // Print an error message in red color if the new value is empty
    }
    else {
        todos[index].name = trimmedNewTodo; // Update the name of the todo item at the specified index
        console.log(chalk.green("Todo item updated.\n")); // Print a success message in green color
    }
}
// Function to delete an existing todo item
async function deleteTodo() {
    if (todos.length === 0) {
        console.log(chalk.yellow("No items to delete.\n")); // Print a message in yellow color if there are no todo items
        return;
    }
    await displayTodos(); // Display the current todo list
    let indexResponse = await inquirer.prompt({
        type: "input",
        name: "index",
        message: chalk.blue("Enter the index of the todo item to delete:"), // Prompt the user to enter the index of the todo item to delete
        validate: (value) => {
            const parsedIndex = parseInt(value);
            if (isNaN(parsedIndex) || parsedIndex < 1 || parsedIndex > todos.length) {
                return "Please enter a valid index."; // Validate the input to ensure it is a valid index
            }
            return true;
        },
    });
    let index = parseInt(indexResponse.index) - 1; // Convert the input index to a number and adjust for zero-based indexing
    const deletedTodo = todos.splice(index, 1)[0].name; // Remove the todo item at the specified index from the array
    console.log(chalk.green(`'${deletedTodo}' deleted from the todo list.\n`)); // Print a success message in green color
}
// Main function to manage the todo list app
async function main() {
    await displayWelcomeMessage(); // Display a welcome message when the app starts
    let continueOperation = true;
    while (continueOperation) {
        // Prompt the user to choose an action from a list of options
        const { action } = await inquirer.prompt({
            type: "list",
            name: "action",
            message: chalk.blue("What would you like to do?"), // Prompt the user to choose an action in blue color
            choices: ["Add", "Update", "Delete", "Exit"], // List of available actions
        });
        switch (action) {
            case "Add":
                await addTodo(); // Call the addTodo function if the user chooses to add a new todo item
                break;
            case "Update":
                await updateTodo(); // Call the updateTodo function if the user chooses to update an existing todo item
                break;
            case "Delete":
                await deleteTodo(); // Call the deleteTodo function if the user chooses to delete an existing todo item
                break;
            case "Exit":
                continueOperation = false; // Exit the app if the user chooses to exit
                console.log(chalk.yellow("Exiting Todo List App...\n")); // Print a farewell message in yellow color
                break;
        }
    }
    await displayTodos(); // Display the final todo list before exiting the app
}
main(); // Start the main function
