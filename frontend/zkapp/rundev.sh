#!/usr/bin/env bash
# @MAZ - 2024-02-20
#
# Setup the right API config and other params
# for running as dev
#
# Use:
#       ./run.sh local 
#       ./run.sh devnet
#       ./run.sh mainnet
#
cp config-$1.ts ./src/lib/apis/config.ts
npm run dev
