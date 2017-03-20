**unsorted-watcher** watches “/unsorted”. When something is added with a name matching the pattern (probably /year name/), it sorts it into the appropriate folder
- records every movement in its log
- `/unsorted` is determined by the `$BMC_PHOTOS_UNSORTED_DIR` environment variable
- the destination is determined by the `$BMC_PHOTOS_ROOT_DIR` environment variable
