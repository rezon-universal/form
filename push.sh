#!/bin/sh

setup_git() {  
  git config --global user.email "tickets_mail@mail.ua"
  git config --global user.name "travisbotik"
}

commit_website_files() {
  git checkout -b minify
  git add dest/\*.min.js dest/\*min.css
  git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
}

 upload_files() {
   git remote add rezon https://${GH_TOKEN}@github.com/rezon-universal/form.git > /dev/null 2>&1   
   git push --quiet --set-upstream rezon minify 
 }

setup_git
commit_website_files
upload_files