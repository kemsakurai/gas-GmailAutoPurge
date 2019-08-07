#!/bin/sh
TOOL_HOME=`pwd`
cd $TOOL_HOME/frontend
ng build --prod
cd $TOOL_HOME/backend
DEPLOYMENT_ID=`npm run deployments | grep "web app meta-version" | cut -f 2 -d " "`
npm run deploy --  --deploymentId $DEPLOYMENT_ID
