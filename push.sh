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
  echo "----minify files----"
  git ls-tree -r minify
  echo "--------"
  
}
 upload_files() {
   git remote add rezon https://${GH_TOKEN}@github.com/rezon-universal/form.git > /dev/null 2>&1           
   git fetch rezon
   echo "----list of branhces----"
   git branch
   echo "--------"
   git checkout -b master   
   git merge minify  
   git commit -a -m "Travis build: $TRAVIS_BUILD_NUMBER"
    echo "----second list of branhces----"
   git branch
   echo "--------"
    echo "master status"
   git status 
   echo "--------"
    echo "master files"
   git ls-tree -r master
   echo "--------"
   echo "check user"
   git show-branch minify
   echo "--------"
   git push rezon master --quiet --set-upstream 
 }

setup_git
commit_website_files
upload_files

