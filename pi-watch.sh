#!/usr/bin/env bash

inotifywait -e close_write,moved_to,create --exclude "(node_modules|build|\.idea)" -r -m . |
while read -r directory events filename; do
    if [[ "$filename" =~ ^.+\.ts$ ]]; then
        echo "ts modified $filename"
        tsc
        npm run build
        scp -r build pi@raspberrypi.local:/home/pi/projects/rmtpi-client/
    elif [[ "$filename" == "package.json" ]]; then
        echo "packages modified"
        scp -r package* pi@raspberrypi.local:/home/pi/projects/rmtpi-client/
    fi
done


