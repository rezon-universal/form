#!/bin/sh

setup_git() {  
  echo ${USER}	
  git config --global user.email "tickets_mail@mail.ua"
  git config --global user.name "travisbotik"
}

commit_website_files() { 
  git checkout --orphan minify
  git rm 
  git add dest/\*.min.js dest/\*min.css  
  git commit --message "Travis minify: $TRAVIS_BUILD_NUMBER"  
  echo "----minify files----"
  git ls-tree -r minify
  echo "--------"  
}
 upload_files() {
   git remote add rezon https://${GH_TOKEN}@github.com/rezon-universal/form.git > /dev/null 2>&1           
   git fetch rezon   
   git checkout -b master rezon/master  
   git merge minify --commit -m "Travis build: $TRAVIS_BUILD_NUMBER" -X theirs   
   git push rezon master  --set-upstream 
 }

setup_git
commit_website_files
upload_files

