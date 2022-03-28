# DJSets-for-Web
## Description
This Project is a small DJ-Tool for organizing Songs and Setlists. It is based on the Desktop-Project, which you can find [here](https://github.com/ericmuench/DJ-Sets), but rewritten with the Vue-Framework.
## Features
This Project is very similar to the original DJSets-Project based on WPF for Desktop. Therefore it contains very common features like:
- Manage Songs (CRUD)
- Manage Setlists (CRUD)
- Moving Songs in Setlists
- Filter for Songs
- Automatic Calculation of Setlists-Lengths based on their Songs
- Export Setlists as `txt`-File

Compared to to the original WPF-Version, this Version has the following feature differences
| Feature       | Desktop-Version   | Web-Version|
| ------------- |:-------------:| :---------:|
| Export all Application data as a JSON| ❌|✔️|
| Wipe all Application data as once |❌|✔️|
| Responsive Design with Mobile Device Design|❌|✔️|
| Import all Application Data from a JSON|❌|✔️|
| Linking Songs to local Audio Files on the Computer|✔️|❌|
| Scanning the Computer for Songs and import Songs from them|✔️|❌|
| Export Setlist as a `m3u`-File|✔️|❌|
| Autogenerate Setlists|✔️|❌|

## Very important Notes !!
- As this Project was created in Kontext of a Study-Thesis, it is completely in German.
- For storing data, this Project uses the local broweser cache as there is no backend-implementation. Please make sure to set your browser to not clear the cache of this App, otherwise Application-data is lost after closing the App. Alternatively, you can create a JSON-backup regulary using the export/import feature.

## Images
### All Songs UI
![Manage all of your Songs!](https://github.com/ericmuench/DJSets-for-Web/raw/main/img/SongsView.jpg "Manage all of your Songs")
### Edit Songs UI
![Edit your Songs!](https://github.com/ericmuench/DJSets-for-Web/raw/main/img/EditSongView.jpg "Edit your Songs!")
### All Setlists UI
![Manage all of your Setlists!](https://github.com/ericmuench/DJSets-for-Web/raw/main/img/SetlistsView.jpg "Manage all of your Setlists")
### Setlist-Detail UI
![Manage a Setlist!](https://github.com/ericmuench/DJSets-for-Web/raw/main/img/SetlistView.jpg "Manage a Setlist")
### Settings UI
![Change App-Data in the settings!](https://github.com/ericmuench/DJSets-for-Web/raw/main/img/SettingsView.jpg "Change App-Data in the settings")
