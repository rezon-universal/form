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
   git checkout -b master   
   #git merge minify --ff-only --quiet --commit -m "Travis build: $TRAVIS_BUILD_NUMBER" -X theirs   
   git merge --allow-unrelated-histories minify   
   git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
   git push -u -f --quiet rezon 
 }

setup_git
commit_website_files
upload_files

