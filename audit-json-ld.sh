#!/bin/bash

# sh audit-json-ld.sh "http://localhost:3000/blog/exceeding-reaction-chamber-thermal-limit"
echo "First->"  $1
# cURL
curl $1 > tmp_file

pbcopy < tmp_file

open "https://search.google.com/structured-data/testing-tool/u/0/#new-test-code-tab"