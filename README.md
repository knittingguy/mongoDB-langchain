Previously missing the package-lock.json file.

After downloading the package-lock.json file, remove the node-modules from your local and make sure that your package.json matches the one in the repo and then run npm ci to install the packages.

Afterward, run npx ts-node index.ts and it should start the server up (assuming that you have your MongoDB set up and have your API Keys in your .env file)