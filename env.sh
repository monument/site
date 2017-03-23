#!/bin/bash

if [[ $DIGITAL_OCEAN ]]; then
    source ../env-do.sh
else
    source ../env-local.sh
fi
