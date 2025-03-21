# soundboard
audio clip soundboard

v1.0
Original layout 
** FEATURES ** 
 * category buttons pulled from the parent folder of the sound - allowing you to filter sounds by category
 * reset filters button
 * search bar to find sound based on file name
 * sort alphabetically buttons
 * stop all sounds button
 * nsfw sound toggle checkbox

** STRUCTURE **
 json object uses this structure
 [
    {
        "name": "name",
        "category": "directory",
        "src": "audio/directory/name.wav"
    }
 ]

** STYLESHEET **
Fonts: Rubik Dirt & Noto Sans

Not set up for mobile

** PYTHON **
run getFileStructure.py in a folder that also contains the folder /soundboard-1/audio. Or, you know, change that in the python script. I don't really care. 
Running this will give you the file "files_info.json".
files_info.json will be appended (or created on first run) by running getFileStructure.py
If you remove a file in your audio folder, it will be removed from files_info.json.
Please keep only audio files in your folder. This tool will catalog and create a button/entry for any file type you have.
