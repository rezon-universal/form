#!/bin/sh

setup_git() {  
  echo ${USER}	
  git config --global user.email "tickets_mail@mail.ua"
  git config --global user.name "travisbotik"
}

commit_website_files() {
  git checkout --orphan minify
  git rm -rf . 
  git add dest/\*.min.js dest/\*min.css
  git commit --message "Travis minify: $TRAVIS_BUILD_NUMBER"
  
}
 upload_files() {
   git remote add rezon https://${GH_TOKEN}@github.com/rezon-universal/form.git > /dev/null 2>&1      
   git fetch rezon
   git checkout master     
   git merge minify --no-commit   
   git push   --quiet --set-upstream rezon master
 }

setup_git
commit_website_files
upload_files