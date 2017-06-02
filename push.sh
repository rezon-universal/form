#!/bin/sh

setup_git() {  
  echo ${USER}	
  git config --global user.email "tickets_mail@mail.ua"
  git config --global user.name "travisbotik"
}

commit_website_files() {
  git checkout -b master   
}

 upload_files() {
   git remote add rezon https://${GH_TOKEN}@github.com/rezon-universal/form.git > /dev/null 2>&1   
   git fetch rezon 
   git merge rezon/master
   git add dest/\*.min.js dest/\*min.css
   git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
   git push --quiet --set-upstream rezon master:master 
 }

setup_git
commit_website_files
upload_files