# Download Environment
Download any environment that is compatible with Typescript. For the best outcome use visual studio code which you can download here: https://code.visualstudio.com/download

Make sure you download the correct version for Windows or Mac!

# Install Node.js
If you do not already have Node.js installed please download here:  https://nodejs.org/en/

Once downloaded, for installation double click on the installation file and follow the step by step process.

Now open any Console Window and type the command: node -v
This will confirm Node.js is installed.

# Install Typescript
Since you must have Node.js installed at this point you can now install typescript.

Open the Console Window and type the command: npm install -g typescript

IMPORTANT: Make sure you install typescript either globally or locally within the file that you are running the typescript code.

# Deploying Code
Attached to this github I have uploaded my files. In order for my typescript to display on the index.html file you have to make sure there is a JS version of the typescript file being used. For my hello.ts fill I had to go into the terminal and convert the file to JS. You can do this by running the command tsc hello.ts 

That command should create the JS file if not already there. Then enter the command node hello.js

Then just open the index.html file in the browser!! 

  
