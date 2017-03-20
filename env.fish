#!/bin/bash

# set BMC_ROOT "/Users/hawken/Dropbox/Benchmark Photos"
# set BMC_DATA "/Users/hawken/Dropbox/Benchmark Photos/_app"

set BMC_ROOT "/Users/hawken/Sites/bmc-photos-test"
set BMC_DATA "/Users/hawken/Sites/bmc-photos-app-data"

set -x BMC_PHOTOS_DIR "$BMC_ROOT/photos"
set -x BMC_PHOTOS_UNSORTED_DIR "$BMC_ROOT/unsorted"

set -x BMC_METADATA_DIR "$BMC_DATA/metadata"
set -x BMC_THUMBNAILS_DIR "$BMC_DATA/thumbnails"
set -x BMC_DATABASE_FILE "$BMC_DATA/database.json"
