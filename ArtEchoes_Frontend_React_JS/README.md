file Utils.js

Purpose Summary:

moveFile: Moves an uploaded file into a category-specific folder, creating the folder if it doesn't exist.

classifyImage: Invokes a Python script via a child process to classify the image and returns the classification result.

cleanupUploads: Cleans the uploads directory by deleting temporary files while keeping the directory structure intact (preserving a .gitkeep file).

clip script.py

to classify the art using a pre built model

#react native project startup

npx create-expo-app React_Native_mobile // to create the app ( previously we had to use expo init project_name but its depriciated now )
