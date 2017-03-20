**website-watcher** watches the database. When the database changes, it recreates the static website files.
- it creates the new website in a timestamped folder, then renames the old folder and renames the new one on top.
- aiming for atomic website updates…
- records changes in its log
- `.database.json` is located by the `$BMC_PHOTOS_DATABASE_FILE` environment variable
