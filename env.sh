#!/bin/sh

if [ -n "$DIGITAL_OCEAN" ]; then
    . ../env-do.sh
else
    . ../env-local.sh
fi
