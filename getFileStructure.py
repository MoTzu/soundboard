import os
import json

def get_files_info(folder_path, output_file="files_info.json"):
    """
    Traverse a folder and create a JSON object with file information.

    Args:
    folder_path (str): Path to the folder to scan.
    output_file (str): Name of the output JSON file.
    """
    files_info = []
    existing_files = set()

    # Load existing data if file exists
    if os.path.exists(output_file):
        with open(output_file, "r", encoding="utf-8") as json_file:
            try:
                existing_data = json.load(json_file)
                existing_files = {entry["src"] for entry in existing_data}
            except json.JSONDecodeError:
                existing_data = []
    else:
        existing_data = []

    for root, _, files in os.walk(folder_path):
        for file_name in files:
            # Skip hidden files
            if file_name.startswith('.'):
                continue

            # Extract file information
            file_name_no_ext = os.path.splitext(file_name)[0]
            subfolder = os.path.relpath(root, folder_path)
            relative_url = os.path.join(subfolder, file_name).replace("\\", "/")  # Ensure URL uses forward slashes
            
            # Prepend "/audio" to the src path
            full_src = f"/audio/{relative_url}".lstrip("/") if subfolder != "." else f"/audio/{file_name}"
            
            # Only add new entries
            if full_src not in existing_files:
                files_info.append({
                    "name": file_name_no_ext,
                    "category": subfolder if subfolder != "." else "",  # Exclude "." for the base folder
                    "src": full_src
                })
                existing_files.add(full_src)

    # Combine old and new data
    updated_data = existing_data + files_info
    
    # Write the JSON object to a file
    with open(output_file, "w", encoding="utf-8") as json_file:
        json.dump(updated_data, json_file, indent=4)
    print(f"File info has been updated in {output_file}")

# Example usage
folder_to_scan = "../../soundboard-1/audio"  # Replace with your folder path
get_files_info(folder_to_scan)
