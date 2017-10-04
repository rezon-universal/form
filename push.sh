#!/bin/sh

setup_git() {  
  echo ${USER}	
  git config --global user.email ${GH_EMAIL}
  git config --global user.name ${GH_USER}
}

commit_website_files() { 
  git checkout --orphan minify 
  git rm -rf --quiet .
  git add minified/\*.min.js minified/\*min.css minified/\*.map origin/* html/*
  git commit --message "Travis minify: $TRAVIS_BUILD_NUMBER"   
}
 upload_files() {
   git remote add rezon https://${GH_TOKEN}@github.com/rezon-universal/form.git > /dev/null 2>&1           
   git fetch --quiet rezon    
   git checkout -b master rezon/master  
   git merge minify --quiet --commit -m --allow-unrelated-histories "Travis build: $TRAVIS_BUILD_NUMBER" -X theirs   
   git push rezon master  --set-upstream --quiet
 }

setup_git
commit_website_files
upload_files

