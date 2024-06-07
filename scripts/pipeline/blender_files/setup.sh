#! /bin/bash

# update and install requirements
sudo apt update -y
sudo apt install -y gvfs snapd subversion
sudo snap install blender --classic

# alias our snap-blender to "blender"
alias blender=/snap/bin/blender

# this ends up being used as a "/tmp"
sudo mkdir -p /run/user/1000/gvfs

# create paths for data files if they dont exist, replace ~/ad-creator-fs-az/ with the file store we are using
mkdir ~/ad-creator-fs-az/public/
mkdir ~/ad-creator-fs-az/public/renders/
mkdir ~/ad-creator-fs-az/public/sku/
