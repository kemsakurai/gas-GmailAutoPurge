#!/bin/sh
TOOL_HOME=`pwd`
cd $TOOL_HOME/frontend
ng build --prod
cd $TOOL_HOME/backend
npm run push
