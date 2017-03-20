**database-watcher** watches “/photos”. When something is added or changed, it updates the “database”
- write to the individual metadata files for each modified file in “/metadata”
- recreate the master metadata file from the individual files
- records changes into its log
- writes… xattr? tags… to the filesystem? (fn)
- `/photos` is determined by the `$BMC_PHOTOS_ROOT_DIR` environment variable
- `.database.json` is located by the `$BMC_PHOTOS_DATABASE_FILE` environment variable
- `/metadata` is located by the `$BMC_PHOTOS_METADATA_DIR` environment variable
