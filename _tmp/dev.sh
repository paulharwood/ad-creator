#!/bin/bash

# start the local server / STOP WITH PROCESS KILL ONLY

serve -l 57538 public/ &

# node live-server.js &

node process-scss.js &

# start the required development envoronment

npm run dev