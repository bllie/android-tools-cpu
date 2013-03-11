#!/bin/bash
dir=`dirname $0`
cd $dir
php -t . -S localhost:8083
