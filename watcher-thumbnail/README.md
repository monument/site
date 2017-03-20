**thumbnail-watcher** watches “/photos”.

When a photo is added or changed, it eagerly recreates the thumbnails for it.

When a photo is removed, it removes the associated thumbnails.

- records actions in its log
- adds watermarks to the thumbnails
- generates optimized 1x, 2x, 3x versions at original, 2000px, 1500px, 1000px, 800px, 600px, 400px, 200px wide.
- `/photos` is determined by the `$BMC_PHOTOS_ROOT_DIR` environment variable
